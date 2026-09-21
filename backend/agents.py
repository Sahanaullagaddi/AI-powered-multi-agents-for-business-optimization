import asyncio
import google.genai as genai
import json
from typing import List, Dict, Any, Optional

class MedicalAgent:
    """Base class for specialized medical AI agents."""
    def __init__(self, role: str, model_name: str = 'gemini-2.0-flash', client=None):
        self.role = role
        self.model_name = model_name
        self.client = client
    
    async def analyze(self, prompt: str) -> str:
        """Executes the agent's analysis based on its specific prompt."""
        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model_name,
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Error in {self.role} analysis: {e}")
            return f"Error from {self.role}: {str(e)}"

class DrugInteractionAgent(MedicalAgent):
    """Specializes in identifying pharmacological interactions between drugs."""
    def __init__(self, client=None):
        super().__init__(role="Pharmacokinetic Expert", client=client)

    async def run(self, drugs: List[str], gnn_score: Optional[float] = None) -> str:
        drugs_list = ', '.join(drugs)
        prompt = f"Act as a pharmacokinetic expert. Analyze the pharmacological interactions between these drugs: {drugs_list}. Detail any synergistic or antagonistic effects."
        if gnn_score is not None:
            prompt += f"\n\nAdditionally, a Graph Neural Network (GNN) model computed a continuous statistical polypharmacy risk score of {gnn_score:.4f} (higher is riskier). Factor this statistical risk into your qualitative analysis."
        return await self.analyze(prompt)

class PatientRiskAgent(MedicalAgent):
    """Specializes in assessing clinical risks for specific patient profiles."""
    def __init__(self, client=None):
        super().__init__(role="Clinical Physician", client=client)

    async def run(self, drugs: List[str], patient_data: Dict[str, Any]) -> str:
        drugs_list = ', '.join(drugs)
        patient_profile = f"Age: {patient_data.get('age')}, Gender: {patient_data.get('gender')}, Weight: {patient_data.get('weight')}kg, Conditions: {patient_data.get('conditions')}, Kidney status: {patient_data.get('kidney')}, Liver status: {patient_data.get('liver')}."
        prompt = f"Act as a clinical physician. Analyze the risks of taking {drugs_list} specifically for this patient profile: {patient_profile}. Are there contraindications?"
        return await self.analyze(prompt)

class ToxicityAgent(MedicalAgent):
    """Specializes in identifying specific organ toxicities."""
    def __init__(self, client=None):
        super().__init__(role="Toxicologist", client=client)

    async def run(self, drugs: List[str]) -> str:
        drugs_list = ', '.join(drugs)
        prompt = f"Act as a toxicologist. Identify which specific organs (e.g. Liver, Kidney, Heart, Brain) are most vulnerable to toxicity or accumulation from this combination: {drugs_list}."
        return await self.analyze(prompt)

class ExplanationAgent(MedicalAgent):
    """Synthesizes insights from other specialists into a final structured JSON report."""
    def __init__(self, client=None):
        super().__init__(role="Primary Care Lead", client=client)

    async def synthesize(self, reports: Dict[str, str], gnn_score: Optional[float] = None) -> Dict[str, Any]:
        prompt = f"""
        Act as a primary care lead physician synthesizing consultant reports into a final patient-facing summary.
        
        Report 1 (Interactions): {reports['interactions']}
        Report 2 (Patient Risk): {reports['patient_risk']}
        Report 3 (Toxicity): {reports['toxicity']}
        """
        if gnn_score is not None:
            prompt += f"\nGNN Risk Score (statistical multi-drug interaction risk): {gnn_score:.4f}\n"

        prompt += """
        Based on the above reports, respond STRICTLY in JSON format with these exact keys:
        - "severity": "Major", "Moderate", or "Minor" (Use Major if serious risk, Moderate if monitoring needed, Minor if okay)
        - "explanation": concise synthesis (under 100 words) of why it's risky for this specific patient.
        - "main_driver": The specific drug(s) or patient condition causing the primary risk.
        - "organs": A JSON array of vulnerable organs exactly matching these strings if applicable: ["Liver", "Kidney", "Heart", "Brain"].
        - "suggested_action": e.g. "Monitor kidney function", "Avoid combination entirely".
        - "ai_risk_score": A numerical score from 0-10 indicating overall risk (higher is riskier).
        - "multi_drug_interactions": Array of objects, each with "drugs" (array of drug names), "risk" ("High", "Moderate", "Low"), "description" (brief explanation).
        - "organ_impact": Array of objects, each with "organ" (from ["Liver", "Kidney", "Heart", "Brain", "Stomach"]), "impact_level" ("High", "Moderate", "Low"), "explanation" (brief).
        - "predicted_side_effects": Array of objects, each with "effect" (symptom name), "probability" (percentage 0-100).
        - "patient_specific_risks": String describing risks specific to patient profile.
        - "drug_interaction_heatmap": 2D array representing interaction matrix (rows and columns as drug names, values as "High", "Moderate", "Low", or "Safe").
        - "ai_explanation": Detailed biological explanation of why interactions happen.
        - "safer_alternatives": Array of objects, each with "current" (drug name), "alternative" (safer drug name).
        - "patient_recommendations": Array of strings with safety guidance and dosing advice (when to take tablets, how many per day, morning/afternoon/evening, affected organs, risks, side effects).
        - "confidence": Percentage (0-100) indicating prediction confidence.
        - "evidence_sources": Array of strings listing sources like "Drug interaction database", "Clinical studies".
        """
        try:
            response = await asyncio.to_thread(self.client.generate_content, prompt)
            return json.loads(response.text)
        except Exception as e:
            print(f"Error in {self.role} synthesis: {e}")
            return {
                "severity": "Minor",
                "explanation": f"Failed to synthesize reports: {str(e)}",
                "main_driver": "Unknown",
                "organs": [],
                "suggested_action": "Consult physician directly",
                "ai_risk_score": 2.0,
                "multi_drug_interactions": [],
                "organ_impact": [],
                "predicted_side_effects": [],
                "patient_specific_risks": "",
                "drug_interaction_heatmap": [],
                "ai_explanation": "",
                "safer_alternatives": [],
                "patient_recommendations": [],
                "confidence": 50,
                "evidence_sources": []
            }

class DiagnosticTeam:
    """Orchestrates the multi-agent diagnostic process."""
    def __init__(self, client):
        self.drug_agent = DrugInteractionAgent(client=client)
        self.risk_agent = PatientRiskAgent(client=client)
        self.toxicity_agent = ToxicityAgent(client=client)
        self.lead_agent = ExplanationAgent(client=client)

    async def analyze(self, drugs: List[str], patient_data: Dict[str, Any], gnn_score: Optional[float] = None) -> Dict[str, Any]:
        """Runs the specialist agents concurrently, then synthesizes their findings."""
        # 1. Concurrent specialist analysis
        a1_task = self.drug_agent.run(drugs, gnn_score)
        a2_task = self.risk_agent.run(drugs, patient_data)
        a3_task = self.toxicity_agent.run(drugs)
        
        a1_res, a2_res, a3_res = await asyncio.gather(a1_task, a2_task, a3_task)
        
        reports = {
            "interactions": a1_res,
            "patient_risk": a2_res,
            "toxicity": a3_res
        }
        
        # 2. Final synthesis by lead agent
        final_assessment = await self.lead_agent.synthesize(reports, gnn_score)
        return final_assessment
