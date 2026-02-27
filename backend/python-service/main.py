import os
import io
import re

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import spacy
from pdfminer.high_level import extract_text

from skill_taxonomy import SKILL_TAXONOMY, expand_skills

load_dotenv()

app = FastAPI(title="SkillBridge NLP Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_md")

KNOWN_SKILLS = sorted(set(
    list(SKILL_TAXONOMY.keys()) +
    [s for parents in SKILL_TAXONOMY.values() for s in parents]
))

PROFICIENCY_PATTERNS = {
    5: [r"expert\s+(?:in|with)", r"advanced\s+(?:knowledge|experience)", r"lead\s+.*(?:developer|engineer)"],
    4: [r"proficient\s+(?:in|with)", r"strong\s+(?:knowledge|experience)", r"extensive\s+experience"],
    3: [r"experienced\s+(?:in|with)", r"good\s+(?:knowledge|understanding)", r"comfortable\s+with"],
    2: [r"familiar\s+with", r"basic\s+(?:knowledge|understanding)", r"exposure\s+to"],
    1: [r"beginner", r"learning", r"introductory"],
}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "skillbridge-python", "spacy_model": "en_core_web_md"}


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    try:
        pdf_bytes = await file.read()
        pdf_stream = io.BytesIO(pdf_bytes)
        raw_text = extract_text(pdf_stream)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not extract text from PDF: {str(e)}")

    if not raw_text or len(raw_text.strip()) < 20:
        raise HTTPException(status_code=422, detail="PDF appears to be empty or unreadable.")

    doc = nlp(raw_text)

    name = None
    location = None
    organizations = []

    for ent in doc.ents:
        if ent.label_ == "PERSON" and name is None:
            name = ent.text.strip()
        elif ent.label_ == "GPE" and location is None:
            location = ent.text.strip()
        elif ent.label_ == "ORG":
            organizations.append(ent.text.strip())

    email_match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", raw_text)
    email = email_match.group(0) if email_match else None

    phone_match = re.search(r"(?:\+?\d{1,3}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}", raw_text)
    phone = phone_match.group(0).strip() if phone_match else None

    linkedin_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9\-_%]+/?", raw_text)
    linkedin_url = linkedin_match.group(0) if linkedin_match else None

    text_lower = raw_text.lower()
    detected_skills = []
    seen_skills = set()

    for skill in KNOWN_SKILLS:
        skill_lower = skill.lower()
        pattern = r'\b' + re.escape(skill_lower) + r'\b'
        if re.search(pattern, text_lower) and skill_lower not in seen_skills:
            proficiency = _infer_proficiency(text_lower, skill_lower)
            detected_skills.append({"skillName": skill_lower, "proficiency": proficiency})
            seen_skills.add(skill_lower)

    expanded_skills = expand_skills(detected_skills, min_proficiency=1)

    return {
        "name": name, "email": email, "phone": phone, "location": location,
        "linkedinUrl": linkedin_url, "skills": expanded_skills,
        "organizations": organizations[:5], "rawTextLength": len(raw_text),
    }


def _infer_proficiency(text: str, skill: str) -> int:
    for match in re.finditer(re.escape(skill), text):
        start = max(0, match.start() - 100)
        end = min(len(text), match.end() + 100)
        window = text[start:end]

        for level in [5, 4, 3, 2, 1]:
            for pattern in PROFICIENCY_PATTERNS[level]:
                if re.search(pattern, window, re.IGNORECASE):
                    return level
    return 2


class SkillEntry(BaseModel):
    skillName: str
    proficiency: int


class PostingSkillEntry(BaseModel):
    skillName: str
    weight: int


class ScoreRequest(BaseModel):
    candidateSkills: list[SkillEntry]
    postingSkills: list[PostingSkillEntry]


@app.post("/calculate-score")
async def calculate_score(req: ScoreRequest):
    candidate_raw = [{"skillName": s.skillName, "proficiency": s.proficiency} for s in req.candidateSkills]
    expanded = expand_skills(candidate_raw, min_proficiency=3)

    skill_lookup = {s["skillName"].lower().strip(): s["proficiency"] for s in expanded}

    earned = 0
    max_possible = 0
    breakdown = []
    gaps = []

    for ps in req.postingSkills:
        ps_name = ps.skillName.lower().strip()
        weight = ps.weight
        max_possible += 5 * weight

        candidate_prof = skill_lookup.get(ps_name, 0)
        matched = candidate_prof > 0
        contribution = candidate_prof * weight
        earned += contribution

        breakdown.append({
            "skillName": ps.skillName, "weight": weight,
            "candidateProficiency": candidate_prof, "contribution": contribution,
            "maxContribution": 5 * weight, "matched": matched,
        })

        if not matched or candidate_prof < 3:
            suggestions = []
            for child, parents in SKILL_TAXONOMY.items():
                if ps_name in [p.lower() for p in parents]:
                    suggestions.append(child)
            gaps.append({
                "skillName": ps.skillName, "currentProficiency": candidate_prof,
                "requiredWeight": weight, "suggestions": suggestions[:5],
            })

    score = round((earned / max_possible) * 100, 2) if max_possible > 0 else 0

    projected_earned = 0
    for ps in req.postingSkills:
        ps_name = ps.skillName.lower().strip()
        weight = ps.weight
        candidate_prof = skill_lookup.get(ps_name, 0)
        projected_earned += max(candidate_prof, 5) * weight

    projected_score = round((projected_earned / max_possible) * 100, 2) if max_possible > 0 else 0

    return {
        "score": score, "breakdown": breakdown, "gaps": gaps,
        "projectedScore": projected_score, "earned": earned, "maxPossible": max_possible,
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PYTHON_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
