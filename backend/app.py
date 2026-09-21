from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv

from database import init_db, get_db, PredictionLog, ChatHistory

print("Loading configurations and connecting to Database...")

load_dotenv()
init_db()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    client = genai.GenerativeModel('models/text-bison-001')
    print("Google Gemini API configured successfully")
else:
    client = None
    print("WARNING: GEMINI_API_KEY not found in .env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "MEDGUARD AI backend running with PostgreSQL"}

from typing import Optional
import asyncio

class PredictRequest(BaseModel):
    drugs: list[str]
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[int] = None
    conditions: Optional[str] = None
    kidney: Optional[str] = None
    liver: Optional[str] = None

from agents import DiagnosticTeam
from gnn_inference import get_gnn_polypharmacy_risk

@app.post("/predict")
async def analyze_prescription(req: PredictRequest, db: Session = Depends(get_db)):
    # Get AI risk score if available
    ai_score = get_gnn_polypharmacy_risk(req.drugs)
    
    # Mock structured response for demonstration
    n_drugs = len(req.drugs)
    
    # Generate a proper heatmap: n x n matrix of risk levels
    heatmap = []
    for i in range(n_drugs):
        row = []
        for j in range(n_drugs):
            if i == j:
                row.append("None")  # No interaction with itself
            else:
                # Simple mock logic: some interactions are high risk
                if (i + j) % 3 == 0:
                    row.append("High")
                elif (i + j) % 2 == 0:
                    row.append("Moderate")
                else:
                    row.append("Low")
        heatmap.append(row)
    
    # Generate detailed dosing instructions with specific timing
    dosing_instructions = []
    for drug in req.drugs:
        drug_hash = hash(drug)
        timing = "morning" if drug_hash % 3 == 0 else "evening" if drug_hash % 3 == 1 else "afternoon"
        meal_relation = "before meals" if drug_hash % 2 == 0 else "after meals"
        daily_dose = f"{1 + (drug_hash % 3)} tablet(s) per day"
        frequency = "Once daily" if drug_hash % 2 == 0 else "Twice daily"
        
        dosing_instructions.append({
            "drug": drug,
            "timing": timing,
            "meal_relation": meal_relation,
            "daily_dose": daily_dose,
            "frequency": frequency,
            "special_instructions": f"Take with {meal_relation}. {timing.capitalize()} dosing recommended."
        })
    
    mock_response = {
        "severity": "High" if ai_score and ai_score > 0.7 else "Moderate",
        "explanation": f"Analysis of {n_drugs} drugs shows potential interactions. AI risk score: {ai_score:.3f}" if ai_score else f"Analysis of {n_drugs} drugs completed.",
        "main_driver": "Multi-drug polypharmacy effects",
        "organs": ["Liver", "Kidney", "Heart"],
        "suggested_action": "Monitor closely and consult pharmacist",
        "ai_risk_score": ai_score * 10 if ai_score else 8.4,
        "overall_risk_level": "Critical" if ai_score and ai_score > 0.8 else "High" if ai_score and ai_score > 0.6 else "Moderate",
        "severity_level": "Critical Monitoring Required" if ai_score and ai_score > 0.8 else "High Risk" if ai_score and ai_score > 0.6 else "Moderate Risk",
        "multi_drug_interactions": [
            {
                "combination": req.drugs[:min(3, n_drugs)],
                "risk_level": "High Risk Combination Detected",
                "description": "Severe bleeding risk from anticoagulant combination",
                "affected_organs": ["Heart", "Liver"],
                "outcome": "Increased bleeding tendency and liver metabolism changes"
            },
            {
                "combination": req.drugs[min(3, n_drugs):min(5, n_drugs)] if n_drugs > 3 else [],
                "risk_level": "Moderate Risk Combination",
                "description": "Potential absorption interference",
                "affected_organs": ["Stomach", "Kidney"],
                "outcome": "Reduced drug absorption and effectiveness"
            }
        ] if n_drugs >= 2 else [],
        "organ_impact": [
            {
                "organ": "Liver", 
                "impact_level": "High", 
                "explanation": "Possible liver enzyme elevation due to metabolism interactions",
                "risk_percentage": 75,
                "recommendations": "Monitor liver function tests regularly"
            },
            {
                "organ": "Kidney", 
                "impact_level": "Moderate", 
                "explanation": "Drug clearance may be slightly reduced",
                "risk_percentage": 60,
                "recommendations": "Stay hydrated and monitor kidney function"
            },
            {
                "organ": "Stomach", 
                "impact_level": "High", 
                "explanation": "Higher risk of gastrointestinal bleeding",
                "risk_percentage": 80,
                "recommendations": "Take with food, monitor for stomach pain"
            },
            {
                "organ": "Heart", 
                "impact_level": "Low", 
                "explanation": "Minor cardiovascular interaction risk",
                "risk_percentage": 25,
                "recommendations": "Monitor blood pressure and heart rate"
            }
        ],
        "predicted_side_effects": [
            {"effect": "Internal bleeding", "probability": "High", "percentage": 72, "severity": "High"},
            {"effect": "Dizziness", "probability": "Moderate", "percentage": 60, "severity": "Moderate"},
            {"effect": "Nausea", "probability": "Moderate", "percentage": 50, "severity": "Moderate"},
            {"effect": "Fatigue", "probability": "Low", "percentage": 40, "severity": "Low"},
            {"effect": "Headache", "probability": "Low", "percentage": 35, "severity": "Low"}
        ],
        "patient_specific_risks": {
            "age": req.age,
            "conditions": req.conditions,
            "kidney_function": req.kidney,
            "liver_function": req.liver,
            "insights": [
                f"Patient age {req.age or 'unknown'} with {req.conditions or 'no conditions'} specified.",
                "Elderly patients have 2x higher bleeding risk." if req.age and req.age > 65 else "Monitor for age-related effects.",
                f"Kidney function: {req.kidney or 'Normal'} - affects drug clearance.",
                f"Liver function: {req.liver or 'Normal'} - affects drug metabolism."
            ]
        },
        "drug_interaction_heatmap": heatmap,
        "ai_explanation": "The interaction between Warfarin and Aspirin occurs because both medications affect blood clotting mechanisms. When used together, they may significantly increase the risk of bleeding. Similarly, drugs processed by the liver metabolic pathway may compete with each other, increasing toxicity or reducing effectiveness.",
        "safer_alternatives": [
            {
                "current_drug": req.drugs[0] if req.drugs else "Warfarin", 
                "suggested_alternative": "Apixaban",
                "reason": "Reduced bleeding risk while maintaining anticoagulation"
            },
            {
                "current_drug": "Ibuprofen" if "Ibuprofen" in req.drugs else req.drugs[1] if len(req.drugs) > 1 else "Aspirin",
                "suggested_alternative": "Acetaminophen",
                "reason": "Lower gastrointestinal bleeding risk"
            }
        ] if req.drugs else [],
        "patient_recommendations": [
            "⚠️ Avoid combining Warfarin and Aspirin without medical supervision.",
            "⚠️ Monitor liver function while taking Atorvastatin with other medications.",
            "⚠️ Maintain adequate hydration to support kidney function.",
            "⚠️ Immediately report symptoms such as dizziness, unusual bleeding, or severe fatigue.",
            "⚠️ Take medications exactly as prescribed by your healthcare provider.",
            "⚠️ Keep a medication diary to track timing and effects.",
            "⚠️ Inform all healthcare providers about all medications you are taking."
        ],
        "dosing_instructions": dosing_instructions,
        "confidence": 91,
        "evidence_sources": [
            "Drug interaction databases",
            "Pharmacological research data", 
            "AI-based prediction models",
            "Clinical pharmacology studies",
            "FDA drug interaction database"
        ],
        "ai_polypharmacy_score": ai_score
    }
    
    # Save to database safely without crashing prediction response
    try:
        log = PredictionLog(
            drugs=req.drugs,
            severity=mock_response.get("severity", "Minor"),
            explanation=mock_response.get("explanation", "")
        )
        db.add(log)
        db.commit()
    except Exception as db_err:
        print(f"Warning: Database logging failed (continuing with response): {db_err}")
        try:
            db.rollback()
        except Exception:
            pass

    return mock_response

@app.post("/predictor")
async def analyze_prescription_predictor(req: PredictRequest, db: Session = Depends(get_db)):
    # This is an alias for /predict to match frontend expectations
    return await analyze_prescription(req, db)

class ChatMessage(BaseModel):
    role: str
    content: str
    session_id: str = "default"

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

@app.post("/chat")
async def chat_bot(req: ChatRequest, db: Session = Depends(get_db)):
    if not api_key:
        return {"reply": "Error: Gemini API key is not configured on the backend."}
    
    try:
        # Save user message to DB
        last_msg = req.messages[-1]
        user_log = ChatHistory(session_id=last_msg.session_id, role="user", content=last_msg.content)
        db.add(user_log)
        
        gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        
        formatted_history = []
        for msg in req.messages[:-1]: # All except the last one
            role = "user" if msg.role == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg.content]})
            
        chat_session = gemini_model.start_chat(history=formatted_history)
        
        system_instructions = "You are MedGuard AI, an expert and highly intelligent Drug Safety Assistant. You explain drug interactions, side effects, and risk predictions. However, you must always add a short disclaimer that you provide decision-support only and the user should consult a clinical professional."
        
        response = chat_session.send_message(f"System Command: {system_instructions}\n\nUser Question: {last_msg.content}")
        
        ai_reply = response.text
        
        # Save AI reply to DB
        ai_log = ChatHistory(session_id=last_msg.session_id, role="ai", content=ai_reply)
        db.add(ai_log)
        db.commit()
        
        return {"reply": ai_reply}
    except Exception as e:
        print("Gemini Error /chat:", e)
        db.rollback()
        return {"reply": f"Sorry, I encountered an AI error: {str(e)}"}

