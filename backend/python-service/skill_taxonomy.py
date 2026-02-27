"""
Skill Taxonomy — maps specific frameworks/tools to parent skills.
"""

SKILL_TAXONOMY = {
    "react": ["javascript", "frontend"],
    "react.js": ["javascript", "frontend"],
    "reactjs": ["javascript", "frontend"],
    "next.js": ["javascript", "react", "frontend"],
    "nextjs": ["javascript", "react", "frontend"],
    "angular": ["javascript", "typescript", "frontend"],
    "vue": ["javascript", "frontend"],
    "vue.js": ["javascript", "frontend"],
    "node.js": ["javascript", "backend"],
    "nodejs": ["javascript", "backend"],
    "express": ["javascript", "node.js", "backend"],
    "express.js": ["javascript", "node.js", "backend"],
    "typescript": ["javascript"],
    "flask": ["python", "backend", "rest apis"],
    "django": ["python", "backend", "rest apis"],
    "fastapi": ["python", "backend", "rest apis"],
    "pandas": ["python", "data analysis"],
    "numpy": ["python", "data analysis"],
    "scikit-learn": ["python", "machine learning"],
    "tensorflow": ["python", "machine learning", "deep learning"],
    "pytorch": ["python", "machine learning", "deep learning"],
    "postgresql": ["sql", "databases"],
    "mysql": ["sql", "databases"],
    "mongodb": ["nosql", "databases"],
    "redis": ["databases", "caching"],
    "prisma": ["orm", "databases"],
    "docker": ["devops", "containerization"],
    "kubernetes": ["devops", "containerization"],
    "aws": ["cloud computing"],
    "azure": ["cloud computing"],
    "gcp": ["cloud computing"],
    "git": ["version control"],
    "rest apis": ["backend"],
    "graphql": ["backend", "apis"],
}


def expand_skills(skills: list[dict], min_proficiency: int = 3) -> list[dict]:
    skill_map = {}

    for s in skills:
        name = s["skillName"].lower().strip()
        prof = s["proficiency"]
        if name not in skill_map or prof > skill_map[name]:
            skill_map[name] = prof

    for s in skills:
        name = s["skillName"].lower().strip()
        prof = s["proficiency"]

        if name in SKILL_TAXONOMY and prof >= min_proficiency:
            for parent in SKILL_TAXONOMY[name]:
                parent_lower = parent.lower()
                if parent_lower not in skill_map or prof > skill_map[parent_lower]:
                    skill_map[parent_lower] = prof

    return [{"skillName": k, "proficiency": v} for k, v in skill_map.items()]
