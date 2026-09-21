# MedGuard AI - Multi-Drug Interaction & Polypharmacy Safety Predictor

MedGuard AI is an advanced clinical AI platform designed to evaluate and predict complex multi-drug interactions (DDI), synergistic adverse events, and organ toxicity for multimorbidity and polypharmacy patients.

## Key Features

- **Multi-Drug Interaction Predictor**: Evaluates combinations of 3 to 10+ medications simultaneously beyond simple pairwise checks.
- **Patient-Specific Calibration**: Adjusts risk modeling based on age, kidney function (eGFR), liver function (enzymes), comorbidities, and allergies.
- **Explainable AI (XAI)**: Detailed clinical breakdowns, metabolic pathway competition, and organ vulnerability indices (Cardiotoxicity, Nephrotoxicity, Hepatotoxicity).
- **Audible Guidance & Accessibility**: Integrated text-to-speech engine and accessibility preferences.
- **Wellness & Home Remedies**: Evidence-based lifestyle protocols, yoga therapy, and household remedies with medical red-flag consult guidelines.
- **Clinical Dashboard**: Electronic patient records, medication adherence tracking, dose reminder alerts, and interaction history.
- **Interactive AI Medical Copilot**: Context-aware clinical chatbot for drug alternatives and safety inquiries.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with Shadcn UI & Framer Motion
- **Icons**: Lucide React
- **State Management & Routing**: React Router v6 & TanStack Query

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Database**: SQLite (SQLAlchemy ORM)
- **AI & ML**: Scikit-Learn, PyTorch, NetworkX, BioPython, Transformers

## Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`

## License
MIT License
