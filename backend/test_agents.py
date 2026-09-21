import asyncio
from dotenv import load_dotenv
import os
import google.genai as genai
from agents import DiagnosticTeam
import json

async def test_multi_agent():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found in .env")
        return
    client = genai.Client(api_key=api_key)
    
    drugs = ["Aspirin", "Warfarin", "Ibuprofen"]
    patient_data = {
        "age": 65,
        "gender": "Male",
        "weight": 80,
        "conditions": "Hypertension",
        "kidney": "Normal",
        "liver": "Normal"
    }
    
    from gnn_inference import get_gnn_polypharmacy_risk
    gnn_score = get_gnn_polypharmacy_risk(drugs)
    print(f"Calculated GNN Score for {drugs}: {gnn_score}")
    
    print(f"Testing DiagnosticTeam with drugs: {drugs}")
    team = DiagnosticTeam(client=client)
    result = await team.analyze(drugs, patient_data, gnn_score)
    print("\nFinal Result from Explanation Agent:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_multi_agent())
