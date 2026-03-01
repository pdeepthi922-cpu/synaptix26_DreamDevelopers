"""
Skill Taxonomy — maps specific frameworks/tools to parent skills.
Also includes dependency-based proficiency boosting.
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
    "svelte": ["javascript", "frontend"],
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
    "keras": ["python", "machine learning", "deep learning"],
    "opencv": ["python", "computer vision"],
    "spring boot": ["java", "backend"],
    "spring": ["java", "backend"],
    "hibernate": ["java", "orm", "databases"],
    "postgresql": ["sql", "databases"],
    "mysql": ["sql", "databases"],
    "mongodb": ["nosql", "databases"],
    "redis": ["databases", "caching"],
    "prisma": ["orm", "databases"],
    "sequelize": ["orm", "databases", "javascript"],
    "docker": ["devops", "containerization"],
    "kubernetes": ["devops", "containerization"],
    "aws": ["cloud computing"],
    "azure": ["cloud computing"],
    "gcp": ["cloud computing"],
    "git": ["version control"],
    "rest apis": ["backend"],
    "graphql": ["backend", "apis"],
    "tailwindcss": ["css", "frontend"],
    "tailwind css": ["css", "frontend"],
    "bootstrap": ["css", "frontend"],
    "sass": ["css"],
    "selenium": ["testing", "automation"],
    "jest": ["testing", "javascript"],
    "pytest": ["testing", "python"],
    "junit": ["testing", "java"],
    "c++": ["c"],
    "c#": [".net"],
    "asp.net": [".net", "backend"],
    "unity": ["c#", "game development"],
    "flutter": ["dart", "mobile development"],
    "react native": ["javascript", "react", "mobile development"],
    "swift": ["ios development", "mobile development"],
    "kotlin": ["android development", "mobile development", "java"],
}

# Proficiency boost rules: when a child skill is known at level X,
# the parent skill should be at least X or X+1 (capped at 5).
# E.g. Flask 3 → Python should be at least 3 (or 4 for core language parents).
CORE_LANGUAGE_PARENTS = {
    "python", "javascript", "java", "c", "c#", "dart", "sql", "css",
}


def expand_skills(skills: list[dict], min_proficiency: int = 1) -> list[dict]:
    """
    Expand skills via taxonomy and boost parent proficiency intelligently.
    If a child skill (Flask) is at level 3, the parent language (Python) 
    should be at least 3, or +1 for core language parents (capped at 5).
    """
    skill_map = {}

    # First pass: add all direct skills
    for s in skills:
        name = s["skillName"].lower().strip()
        prof = s["proficiency"]
        if name not in skill_map or prof > skill_map[name]:
            skill_map[name] = prof

    # Second pass: expand via taxonomy with proficiency boosting
    for s in skills:
        name = s["skillName"].lower().strip()
        prof = s["proficiency"]

        if name in SKILL_TAXONOMY and prof >= min_proficiency:
            for parent in SKILL_TAXONOMY[name]:
                parent_lower = parent.lower()
                # For core language parents, boost by +1 (capped at 5)
                if parent_lower in CORE_LANGUAGE_PARENTS:
                    boosted = min(prof + 1, 5)
                else:
                    boosted = prof

                if parent_lower not in skill_map or boosted > skill_map[parent_lower]:
                    skill_map[parent_lower] = boosted

    return [{"skillName": k, "proficiency": v} for k, v in skill_map.items()]
