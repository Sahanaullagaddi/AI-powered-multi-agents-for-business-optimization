import { useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Download, RotateCcw, Save, ShieldAlert, Network, Activity, AlertTriangle, User, Grid3X3, Brain, Pill, Shield, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

function riskFromScore(score: number): RiskLevel {
  if (score >= 85) return "Critical";
  if (score >= 65) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

export default function Results() {


  const location = useLocation();
  let data = location.state as any;
  // Fallback: try to load from localStorage if state is missing
  if (!data) {
    try {
      const stored = localStorage.getItem('medguard_last_result');
      if (stored) data = JSON.parse(stored);
    } catch (e) { /* ignore */ }
  }

  if (!data) {
    return (
      <AppLayout>
        <main className="container py-10">
          <div className="text-red-600 font-bold text-lg">No results data found. Please run a prediction first.</div>
          <div className="mt-4 text-sm text-muted-foreground">If you just ran a prediction and see this, please try again or check the browser console for errors.</div>
        </main>
      </AppLayout>
    );
  }

  const {
    explanation = '',
    main_driver = '',
    organs = [],
    suggested_action = '',
    ai_risk_score = null,
    overall_risk_level = '',
    severity_level = '',
    multi_drug_interactions = [],
    organ_impact = [],
    predicted_side_effects = [],
    patient_specific_risks = {},
    drug_interaction_heatmap = [],
    ai_explanation = '',
    safer_alternatives = [],
    patient_recommendations = [],
    dosing_instructions = [],
    confidence = null,
    evidence_sources = [],
    ai_polypharmacy_score = null,
    drugs: activeDrugs = [],
    age = '',
    weight = '',
    gender = '',
    conditions = '',
    kidney = '',
    liver = '',
  } = data || {};

  const level = overall_risk_level || "Moderate";

  const [language, setLanguage] = useState('en');
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleSaveDashboard() {
    // Save current results to localStorage dashboard array
    const dashboards = JSON.parse(localStorage.getItem('medguard_dashboards') || '[]');
    dashboards.push(data);
    localStorage.setItem('medguard_dashboards', JSON.stringify(dashboards));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLanguage(e.target.value);
    setShowLangSelect(false);
  }

  function openPrintableReport() {
    try {
      if (!level) {
        console.error("Error: Risk level is missing.");
        return;
      }
      const safeText = (s: any) => {
        if (typeof s === "object") {
          return JSON.stringify(s, null, 2); // Convert objects to a readable JSON string
        }
        if (typeof s !== "string") s = String(s);
        return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      };

      console.log("Data used for report generation:", {
        multi_drug_interactions,
        organ_impact,
        drug_interaction_heatmap,
        activeDrugs,
        predicted_side_effects,
        patient_recommendations,
        evidence_sources
      });

      // Use correct data for each section
      const drugFindings = Array.isArray(multi_drug_interactions) ? multi_drug_interactions : [];
      const multiDrugInsights = Array.isArray(organ_impact) ? organ_impact : [];
      const organTable = Array.isArray(drug_interaction_heatmap) ? drug_interaction_heatmap : [];
      const detectedMeds = Array.isArray(activeDrugs) ? activeDrugs : [];
      const sideEffects = Array.isArray(predicted_side_effects) ? predicted_side_effects : [];
      const recommendations = Array.isArray(patient_recommendations) ? patient_recommendations : [];
      const sources = Array.isArray(evidence_sources) ? evidence_sources : [];

      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>AI Drug Interaction Analysis Report</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 40px; }
    h1 { font-size: 1.7em; font-weight: bold; text-align: center; margin-bottom: 0.5em; }
    h2 { font-size: 1.2em; font-weight: bold; margin-top: 2em; margin-bottom: 0.5em; }
    .summary { margin-bottom: 1.5em; }
    .summary strong { display: inline-block; min-width: 180px; }
    ol, ul { margin: 0 0 1em 1.5em; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1.5em; }
    th, td { border: 1px solid #888; padding: 8px 12px; text-align: left; }
    th { background: #f3f3f3; font-weight: bold; }
    .disclaimer { font-size: 0.95em; color: #444; margin-top: 2em; }
    .section { margin-bottom: 1.5em; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>AI Drug Interaction Analysis Report</h1>
  <div class="summary">
    <h2>AI Analysis Summary</h2>
    <div><strong>Total Drugs Analyzed:</strong> ${detectedMeds.length}</div>
    <div><strong>Interactions Detected:</strong> ${drugFindings.length}</div>
    <div><strong>Overall Interaction Risk:</strong> ${safeText(level)} Risk</div>
    <div><strong>AI Risk Score:</strong> ${ai_risk_score ? ai_risk_score.toFixed(1) : "—"} / 10</div>
    <div><strong>Risk Indicator:</strong> Low | Moderate | High | Critical</div>
  </div>

  <div class="section">
    <h2>Detected Medicines</h2>
    <ol>
      ${detectedMeds.map((d: any) => `<li>${safeText(d.name || d)}</li>`).join('')}
    </ol>
  </div>

  <div class="section">
    <h2>Drug Interaction Findings</h2>
    <ol>
      ${drugFindings.map((item: any) => `<li>${safeText(item.description || item)}</li>`).join('')}
    </ol>
  </div>

  <div class="section">
    <h2>Multi-Drug Combination Insight</h2>
    <ol>
      ${multiDrugInsights.map((item: any) => `<li>${safeText(item.description || item)}</li>`).join('')}
    </ol>
  </div>

  <div class="section">
    <h2>Organ Impact Analysis</h2>
    <table>
      <tr><th>Organ</th><th>Risk Level</th><th>Possible Effect</th></tr>
      ${organTable.map((row: any) =>
        `<tr><td>${safeText(row.organ || "")}</td><td>${safeText(row.risk_level || "")}</td><td>${safeText(row.effect || "")}</td></tr>`
      ).join('')}
    </table>
  </div>

  <div class="section">
    <h2>Predicted Side Effects</h2>
    <ol>
      ${sideEffects.map((item: any) => `<li>${safeText(item.effect || item)}</li>`).join('')}
    </ol>
  </div>

  <div class="section">
    <h2>AI Explanation</h2>
    <div>${safeText(ai_explanation)}</div>
  </div>

  <div class="section">
    <h2>Patient Safety Recommendations</h2>
    <ol>
      ${recommendations.map((item: any) => `<li>${safeText(item.recommendation || item)}</li>`).join('')}
    </ol>
  </div>

  <div class="section">
    <h2>AI Confidence & Data Sources</h2>
    <div><strong>AI Prediction Confidence:</strong> ${confidence ?? "—"}%</div>
    <div><strong>Evidence Sources:</strong> ${sources.map((source: any) => safeText(source)).join(', ')}</div>
  </div>

  <div class="disclaimer">
    <strong>Medical Disclaimer:</strong> This AI analysis is intended for educational and informational purposes only. Always consult a qualified healthcare professional before making medication decisions.
  </div>

  <script>window.print();</script>
</body>
</html>`;
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) {
        alert("Pop-up blocked! Please allow pop-ups for this site to download the report.");
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Drug_Interaction_Analysis_Report.html";
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (error) {
      console.error("An error occurred while generating the report:", error);
      alert("An error occurred while generating the report. Please check the console for details.");
    }
  }

  return (
    <AppLayout>
      <main className="container py-10 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">AI Drug-Drug Interaction Analysis Report</h1>
        </header>

        <div className="space-y-8">
          {/* 1. Overall AI Risk Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                1. Overall AI Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg border">
                  <p className="text-sm font-medium text-red-700">Overall Interaction Risk</p>
                  <p className="text-2xl font-bold text-red-800">{overall_risk_level || "High"}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border">
                  <p className="text-sm font-medium text-orange-700">AI Risk Score</p>
                  <p className="text-2xl font-bold text-orange-800">{ai_risk_score?.toFixed(1) || "8.4"} / 10</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border">
                  <p className="text-sm font-medium text-red-700">Severity Level</p>
                  <p className="text-lg font-bold text-red-800">{severity_level || "Critical Monitoring Required"}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">Risk Indicator</p>
                <div className="flex gap-6 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                    🟢 Low
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                    🟡 Moderate
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                    🟠 High
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                    🔴 Critical
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Organ Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5" />
                3. Organ Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                How the drug combination may affect different organs in your body.
              </p>
              <div className="grid gap-4">
                {organ_impact?.map((impact: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        impact.impact_level === "High" ? "bg-red-500" :
                        impact.impact_level === "Moderate" ? "bg-yellow-500" : "bg-green-500"
                      }`}>
                        {impact.organ[0]}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{impact.organ}</p>
                        <p className="text-sm text-muted-foreground">{impact.explanation}</p>
                        <p className="text-xs text-blue-600 mt-1">{impact.recommendations}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        impact.impact_level === "High" ? "destructive" :
                        impact.impact_level === "Moderate" ? "secondary" : "outline"
                      }>
                        {impact.impact_level} Risk
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{impact.risk_percentage}% risk</p>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
                        <div>
                          <p className="font-medium text-lg">Liver</p>
                          <p className="text-sm text-muted-foreground">Possible liver enzyme elevation</p>
                        </div>
                      </div>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 4. Predicted Side Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                4. Predicted Side Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Possible symptoms that may occur due to the drug combination.
              </p>
              <div className="grid gap-3">
                {predicted_side_effects?.map((effect: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        effect.probability === "High" ? "bg-red-500" :
                        effect.probability === "Moderate" ? "bg-yellow-500" : "bg-green-500"
                      }`}></div>
                      <span className="font-medium">{effect.effect}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        effect.probability === "High" ? "destructive" :
                        effect.probability === "Moderate" ? "secondary" : "outline"
                      }>
                        {effect.probability}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{effect.percentage || "—"}% risk</p>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Internal bleeding</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">High</Badge>
                        <p className="text-xs text-muted-foreground mt-1">72% risk</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 5. Patient-Specific Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                5. Patient-Specific Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm font-medium mb-2">Patient Profile</p>
                  <div className="space-y-1 text-sm">
                    <p>Age: {age || "Unknown"}</p>
                    <p>Weight: {weight || "Unknown"} kg</p>
                    <p>Gender: {gender || "Unknown"}</p>
                    <p>Conditions: {conditions || "None specified"}</p>
                    <p>Kidney Function: {kidney || "Normal"}</p>
                    <p>Liver Function: {liver || "Normal"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">AI Insights</p>
                  <div className="space-y-2">
                    {patient_specific_risks?.insights?.map((insight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">⚠️</span>
                        <p className="text-sm">{insight}</p>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">⚠️</span>
                          <p className="text-sm">Elderly patients using Warfarin + Aspirin have 2x higher bleeding risk.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Drug Interaction Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Grid3X3 className="h-5 w-5" />
                6. Drug Interaction Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visual grid showing interaction severity between medications.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Drug</th>
                      {activeDrugs.map((drug: string, idx: number) => (
                        <th key={idx} className="border border-gray-300 p-2 text-center font-medium">{drug}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drug_interaction_heatmap?.map((row: any[], rowIdx: number) => (
                      <tr key={rowIdx}>
                        <td className="border border-gray-300 p-2 font-medium">{activeDrugs[rowIdx]}</td>
                        {row.map((cell: any, colIdx: number) => (
                          <td key={colIdx} className={`border border-gray-300 p-2 text-center ${
                            cell === "High" ? "bg-red-100 text-red-800" :
                            cell === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                            cell === "Low" ? "bg-green-100 text-green-800" : "bg-gray-100"
                          }`}>
                            {cell === "None" ? "—" : cell}
                          </td>
                        ))}
                      </tr>
                    )) || (
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Metformin</td>
                        <td className="border border-gray-300 p-2 text-center bg-gray-100">—</td>
                        <td className="border border-gray-300 p-2 text-center bg-green-100">Low</td>
                        <td className="border border-gray-300 p-2 text-center bg-yellow-100">Moderate</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 border"></div> Low Risk
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-100 border"></div> Moderate Risk
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 border"></div> High Risk
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 7. AI Explanation of Interaction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Brain className="h-5 w-5" />
                7. AI Explanation of Interaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm whitespace-pre-wrap">
                  {ai_explanation || "The interaction between Warfarin and Aspirin occurs because both medications affect blood clotting mechanisms. When used together, they may significantly increase the risk of bleeding. Similarly, drugs processed by the liver metabolic pathway may compete with each other, increasing toxicity or reducing effectiveness."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Safer Alternative Drug Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Pill className="h-5 w-5" />
                8. Safer Alternative Drug Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI-recommended alternatives with potentially lower interaction risks.
              </p>
              <div className="space-y-3">
                {safer_alternatives?.length > 0 ? (
                  safer_alternatives.map((alt: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Current: {alt.current_drug}</span>
                        <span className="text-sm text-muted-foreground">→</span>
                        <span className="font-medium text-blue-700">{alt.suggested_alternative}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alt.reason}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Current: Warfarin</span>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="font-medium text-blue-700">Apixaban</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Reduced bleeding risk while maintaining anticoagulation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 9. Patient Safety Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                9. Patient Safety Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Important safety guidelines and monitoring recommendations.
              </p>
              <div className="space-y-3">
                {patient_recommendations?.length > 0 ? (
                  patient_recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-yellow-600 mt-1">⚠️</span>
                      <p className="text-sm">{rec.replace('⚠️ ', '')}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-yellow-600 mt-1">⚠️</span>
                    <p className="text-sm">Avoid combining Warfarin and Aspirin without medical supervision.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 10. AI Confidence & Clinical Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                10. AI Confidence & Clinical Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">Prediction Confidence</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-green-500 h-4 rounded-full" 
                        style={{width: `${confidence || 91}%`}}
                      ></div>
                    </div>
                    <span className="text-lg font-bold">{confidence || 91}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Evidence Sources</p>
                  <ul className="space-y-1">
                    {evidence_sources?.length > 0 ? (
                      evidence_sources.map((source: string, idx: number) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {source}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Drug interaction databases
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dosing Instructions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Dosing Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Specific timing and dosage recommendations for each medication.
              </p>
              <div className="space-y-4">
                  {dosing_instructions?.length > 0 ? (
                    dosing_instructions.map((instruction: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-lg">{instruction.drug}</h4>
                          <Badge variant="outline">Frequency</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Timing</p>
                            <p className="capitalize">{instruction.timing}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Meal Relation</p>
                            <p>{instruction.meal_relation}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Daily Dose</p>
                            <p>{instruction.daily_dose}</p>
                          </div>
                        </div>
                        {instruction.special_instructions && (
                          <p className="text-sm text-blue-600 mt-2">{instruction.special_instructions}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-lg">Warfarin</h4>
                        <Badge variant="outline">Once daily</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">Timing</p>
                          <p>Evening</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Meal Relation</p>
                          <p>After meals</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Daily Dose</p>
                          <p>1 tablet per day</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
          </Card>

          <div className="flex justify-center pt-6">
            <div className="flex gap-4">
              <Button onClick={openPrintableReport} variant="outline">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
              <Button onClick={handleSaveDashboard} variant="outline">
                <Save className="h-4 w-4 mr-2" /> Save Dashboard
              </Button>
              <Button onClick={() => setShowLangSelect(v => !v)} variant="outline">
                🌐 Language Translation
              </Button>
            </div>
            {saveSuccess && (
              <div className="text-green-600 text-center mt-2">Dashboard saved!</div>
            )}
            {showLangSelect && (
              <div className="flex justify-center mt-4">
                <select value={language} onChange={handleLanguageChange} className="border p-2 rounded">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="hi">Hindi</option>
                  <option value="ar">Arabic</option>
                  <option value="ru">Russian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}