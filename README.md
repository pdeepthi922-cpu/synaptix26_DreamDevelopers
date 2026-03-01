# 🌉 SkillBridge

**Intelligent, Fair, and Transparent Internship & Project Matching**

[![Node.js](https://img.shields.io/badge/Node.js-v20_LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Resume Parsing Pipeline](#-resume-parsing-pipeline)
- [Match Score Algorithm](#-match-score-algorithm)
- [Project Structure](#-project-structure)
- [Sample Credentials](#-sample-credentials)
- [Contributing](#-contributing)

---

## 🎯 Overview

Traditional internship and project allocation systems rely on keyword matching and manual screening, which fail to accurately evaluate candidates' competencies. These approaches introduce bias, reduce transparency, and create unfair outcomes.

**SkillBridge** solves this with an intelligent, explainable platform that:

- Evaluates candidates using **weighted skill competencies**
- Generates a transparent **Match Score** with full skill-by-skill breakdown
- Provides **gap guidance** — telling candidates exactly what to learn to become eligible
- Gives recruiters a **ranked, data-driven candidate view** with one-click notifications

---

## ✨ Features

### For Candidates

| Feature                            | Description                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------- |
| 📄 **Smart Resume Parsing**        | Upload PDF resume → NLP extracts skills, projects, experience automatically |
| 📊 **Match Score**                 | See a detailed breakdown of how your skills match each posting              |
| 🎯 **Gap Guidance**                | Get personalized learning suggestions to improve your score                 |
| 🔔 **Accept/Reject Notifications** | Receive recruiter invites and respond with one click                        |
| 🏆 **Transparent Rankings**        | View where you stand among all applicants                                   |
| 📝 **Profile Management**          | Edit details, re-upload resume, manage skills/projects/experience           |

### For Recruiters

| Feature                   | Description                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| 📝 **Post Opportunities** | Create internship or project listings with weighted skill requirements |
| 📈 **Ranked Candidates**  | See all candidates sorted by match score                               |
| 🔔 **One-Click Notify**   | Invite top candidates directly from the ranking view                   |
| ✏️ **Manage Postings**    | Edit, delete, and track applied candidates per posting                 |
| 👤 **Company Profile**    | Manage company details and account                                     |

### Platform-Wide

- 🔐 JWT-based authentication with role-based access control
- ✅ Server-side input validation using Zod schemas
- 🧠 NLP-powered skill taxonomy expansion (e.g., Flask → Python)
- ⚡ Score caching with automatic staleness detection
- 🎨 Premium dark UI with warm amber accent palette

---

## 🏗 Architecture

```
┌─────────────────────┐
│   React/Vite SPA    │     TypeScript + Tailwind + Shadcn UI
│   (port 8080)       │
└────────┬────────────┘
         │ HTTP REST (Axios)
         ▼
┌─────────────────────┐
│  Node.js / Express  │     Express 5 + Prisma ORM + Zod Validation
│  (port 5000)        │
│                     │
│  /auth              │ ──► Register, Login, Delete Account
│  /candidates        │ ──► Profile, Onboarding, Resume Upload
│  /recruiters        │ ──► Company Profile
│  /postings          │ ──► CRUD Internships & Projects
│  /scores            │ ──► Match Score (cached)
│  /applications      │ ──► Apply, Withdraw
│  /rankings          │ ──► Ranked Candidate Lists
│  /notifications     │ ──► In-App Notify + Accept/Reject
│  /recommendations   │ ──► Skill-Based Suggestions
└────────┬────────────┘
         │ Internal HTTP              ┌──────────────┐
         ▼                            │              │
┌────────────────────────┐            │  PostgreSQL  │
│  Python / FastAPI      │            │  Database    │
│  (port 8000)           │            │              │
│                        │            └──────────────┘
│  POST /parse-resume    │                   ▲
│  POST /calculate-score │                   │ Prisma ORM
│  pdfminer + spaCy      │                   │
└────────────────────────┘        ───────────┘
```

---

## 🔧 Tech Stack

### Frontend

| Technology                       | Purpose                            |
| -------------------------------- | ---------------------------------- |
| **React 18** + TypeScript        | UI framework with type safety      |
| **Vite 5**                       | Fast dev server & optimized builds |
| **Tailwind CSS 3**               | Utility-first styling              |
| **Shadcn UI** (Radix primitives) | 49 accessible UI components        |
| **React Router DOM 6**           | Client-side routing                |
| **TanStack React Query**         | Server state management            |
| **Axios**                        | HTTP client with interceptors      |
| **Sonner**                       | Toast notifications                |
| **Recharts**                     | Data visualization                 |
| **Zod** + React Hook Form        | Form validation                    |
| **Lucide React**                 | Icon library                       |

### Backend — Node.js Service

| Technology           | Purpose                               |
| -------------------- | ------------------------------------- |
| **Express.js 5**     | HTTP framework (async error handling) |
| **Prisma 5**         | Type-safe ORM with migrations         |
| **PostgreSQL**       | Relational database                   |
| **JWT** + **bcrypt** | Authentication & password hashing     |
| **Zod 4**            | Request body validation               |
| **Multer 2**         | File upload handling                  |
| **Axios**            | Internal HTTP calls to Python service |

### Backend — Python Service

| Technology                   | Purpose                              |
| ---------------------------- | ------------------------------------ |
| **FastAPI**                  | ASGI web framework with auto-docs    |
| **spaCy** (`en_core_web_md`) | Named Entity Recognition             |
| **pdfminer.six**             | PDF text extraction                  |
| **Custom Skill Taxonomy**    | 200+ skill mappings (child → parent) |
| **Uvicorn**                  | High-performance ASGI server         |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 LTS or higher
- **Python** 3.11 or higher
- **PostgreSQL** running locally or remotely
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/pdeepthi922-cpu/synaptix26_DreamDevelopers.git
cd synaptix26_DreamDevelopers
```

### 2. Set Up the Database

Create a PostgreSQL database:

```sql
CREATE DATABASE skillbridge_dev;
```

### 3. Set Up the Node.js Service

```bash
cd backend/node-service
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start the server
npm run dev
```

The Node.js API will be running at `http://localhost:5000`.

### 4. Set Up the Python Service

```bash
cd backend/python-service
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_md

# Start the server
python main.py
```

The Python service will be running at `http://localhost:8000`.

### 5. Set Up the Frontend

```bash
cd frontend
npm install

# Create .env file
echo VITE_API_BASE_URL=http://localhost:5000 > .env

# Start the dev server
npm run dev
```

The frontend will be running at `http://localhost:8080`.

---

## 🔑 Environment Variables

### Node.js Service (`/backend/node-service/.env`)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/skillbridge_dev?schema=public"
JWT_SECRET="your-strong-random-secret-here"
PYTHON_SERVICE_URL=http://localhost:8000
```

### Python Service (`/backend/python-service/.env`)

```env
PYTHON_PORT=8000
ENVIRONMENT=development
```

### Frontend (`/frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🗄 Database Schema

SkillBridge uses **10 Prisma models** across 4 enums:

```
User ──────────┬──► CandidateProfile ──► Skill (1:many)
               │                     ──► Application (1:many)
               │                     ──► MatchScore (1:many)
               │
               └──► RecruiterProfile ──► Posting ──► PostingSkill (1:many)
                                                  ──► Application (1:many)
                                                  ──► MatchScore (1:many)
                                                  ──► Notification (1:many)
```

| Model                | Key Fields                                                             | Purpose                     |
| -------------------- | ---------------------------------------------------------------------- | --------------------------- |
| **User**             | email, passwordHash, role                                              | Authentication              |
| **CandidateProfile** | name, phone, location, linkedinUrl, projects (JSON), experience (JSON) | Candidate data              |
| **RecruiterProfile** | companyName, companySize                                               | Company data                |
| **Skill**            | skillName, proficiency (1-5)                                           | Candidate skills            |
| **Posting**          | title, type, description, stipend, deadline                            | Job/project listings        |
| **PostingSkill**     | skillName, weight (1-5)                                                | Required skills per posting |
| **Application**      | candidateId, postingId, withdrawn                                      | Applications                |
| **MatchScore**       | score, breakdown (JSON), gaps (JSON), isStale                          | Cached scores               |
| **Notification**     | message, type (GENERAL/INVITE), actionTaken (NONE/ACCEPTED/REJECTED)   | In-app notifications        |

---

## 📡 API Reference

### Authentication

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | `/auth/signup`  | Register new user          |
| POST   | `/auth/login`   | Login and receive JWT      |
| DELETE | `/auth/account` | Delete account permanently |

### Candidates

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| PUT    | `/candidates/onboarding` | Save onboarding data    |
| POST   | `/candidates/resume`     | Upload PDF for parsing  |
| GET    | `/candidates/me`         | Get profile with skills |
| PUT    | `/candidates/profile`    | Update profile          |

### Recruiters

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| PUT    | `/recruiters/onboarding` | Save company details  |
| GET    | `/recruiters/me`         | Get recruiter profile |
| PUT    | `/recruiters/profile`    | Update company info   |

### Postings

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/postings`     | Create posting               |
| GET    | `/postings`     | List (paginated, filterable) |
| GET    | `/postings/:id` | Get single posting           |
| PUT    | `/postings/:id` | Update (owner only)          |
| DELETE | `/postings/:id` | Delete (owner only)          |

### Scoring & Applications

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | `/scores/check/:postingId` | Calculate/get match score    |
| POST   | `/applications/:postingId` | Apply (score ≥ 80% required) |
| DELETE | `/applications/:postingId` | Withdraw application         |
| GET    | `/applications/mine`       | List applied postings        |

### Rankings & Notifications

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/rankings/:postingId`      | Ranked candidate list    |
| POST   | `/notifications/notify`     | Send invite to candidate |
| GET    | `/notifications/mine`       | Get notifications        |
| PUT    | `/notifications/:id/accept` | Accept invite            |
| PUT    | `/notifications/:id/reject` | Reject invite            |

### Recommendations

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/candidates/recommendations` | Skill-based suggestions |

---

## 📄 Resume Parsing Pipeline

SkillBridge uses a **multi-stage NLP pipeline** for resume parsing:

```
PDF Upload → pdfminer.six → Raw Text Extraction
                                    │
                                    ▼
                         Section Detection
                    (header pattern matching)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             Personal Info    Skill Extraction   Project Extraction
             (spaCy NER +     (200+ known        (character-level
              regex)           skills matching)    bullet parsing)
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                        Structured JSON Response
```

### Key Technical Details

- **Bullet Character Detection**: Handles Unicode bullets AND Private Use Area (PUA) characters (e.g., `\uf0b7` from Wingdings fonts) that pdfminer commonly extracts
- **Inline Bullet Splitting**: Character-level loop detects mid-line bullets and splits them into separate lines
- **Continuation Line Merging**: Joins PDF-wrapped lines (lowercase starters) back together
- **Title vs. Sentence Detection**: Rejects sentence-like lines (ending with `.`, starting with common verbs) from being treated as project titles
- **Multi-space Normalization**: Cleans up the double/triple spaces pdfminer often produces

---

## 🧮 Match Score Algorithm

```
Score = (Σ candidate_proficiency × skill_weight) / (Σ 5 × skill_weight) × 100
```

### Example Calculation

| Required Skill | Weight | Candidate Proficiency | Contribution | Max Possible |
| -------------- | ------ | --------------------- | ------------ | ------------ |
| Python         | 5      | 4                     | 20           | 25           |
| Django         | 4      | 0 (missing)           | 0            | 20           |
| SQL            | 3      | 3                     | 9            | 15           |
| **Total**      |        |                       | **29**       | **60**       |

**Score = 29/60 × 100 = 48%** (Below 80% threshold → Not eligible)

### Skill Taxonomy Expansion

The system expands candidate skills using a taxonomy:

```
Flask → Python, REST APIs, Web Development
React → JavaScript, Frontend Development
Django → Python, Web Development, REST APIs
TensorFlow → Python, Machine Learning, Deep Learning
```

This ensures a candidate with "Flask" experience gets credit for Python-related postings.

---

## 📁 Project Structure

```
skillbridge/
├── frontend/                          # React + Vite SPA
│   ├── src/
│   │   ├── api/axios.ts              # API client configuration
│   │   ├── components/               # 10 custom + 49 Shadcn UI components
│   │   ├── contexts/AuthContext.tsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── Landing.tsx           # Public landing page
│   │   │   ├── Login.tsx             # Login form
│   │   │   ├── Signup.tsx            # Registration
│   │   │   ├── candidate/            # 8 candidate pages
│   │   │   └── recruiter/            # 7 recruiter pages
│   │   └── App.tsx                   # Route definitions
│   ├── .env                          # API base URL
│   └── package.json
│
├── backend/
│   ├── node-service/                  # Main API
│   │   ├── src/
│   │   │   ├── routes/               # 9 route files (auth, candidates, etc.)
│   │   │   ├── middleware/auth.js    # JWT + role verification
│   │   │   └── index.js             # Express app setup
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema (10 models)
│   │   │   └── seed.js               # Sample data seeder
│   │   ├── .env                      # DB URL, JWT secret, Python URL
│   │   └── package.json
│   │
│   └── python-service/                # NLP Microservice
│       ├── main.py                    # FastAPI routes + parsing logic
│       ├── skill_taxonomy.py          # 200+ skill mappings
│       ├── requirements.txt           # Python dependencies
│       └── .env                       # Service port
│
├── Project description.txt            # Full project specification
├── Frontend description.txt           # Frontend documentation
├── Backend Description.txt            # Backend documentation
└── README.md                          # This file
```

---

## 🔑 Sample Credentials

For testing and demonstration:

### Candidates

| Name             | Email                | Password  |
| ---------------- | -------------------- | --------- |
| Kaustubh Thallam | kaustubh@example.com | Test@1234 |
| Priya Sharma     | priya@example.com    | Test@1234 |
| Arjun Patel      | arjun@example.com    | Test@1234 |

### Recruiters

| Company            | Email                 | Password       |
| ------------------ | --------------------- | -------------- |
| TechCorp Solutions | hr@techcorp.com       | Recruiter@1234 |
| InnoStudio         | hiring@innostudio.com | Recruiter@1234 |

> **Note**: Create these accounts manually through the sign-up flow or use the database seeder.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by <strong>Dream Developers</strong>
</p>
