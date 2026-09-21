import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Agent = {
  name: string;
  confidence: number;
  note: string;
  tone?: "neutral" | "warn";
};

export default function MultiAgentAiAnalysisPanelCard({
  agents,
}: {
  agents?: Agent[];
}) {
  const rows: Agent[] =
    agents ??
    [
      {
        name: "Drug interaction agent",
        confidence: 88,
        note: "Identified co‑medication patterns that elevate interaction likelihood.",
      },
      {
        name: "Patient risk agent",
        confidence: 82,
        note: "Risk stratification consistent with cohort baselines and comorbidity proxies.",
      },
      {
        name: "Toxicity agent",
        confidence: 79,
        note: "Organ-impact flags suggest increased monitoring for renal/hepatic stress.",
        tone: "warn",
      },
      {
        name: "Decision support agent",
        confidence: 86,
        note: "Generated escalation and monitoring recommendations for high‑risk windows.",
      },
    ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Multi‑Agent AI Analysis</CardTitle>
        <CardDescription>Specialized agents contributing to clinical decision support (demo)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {rows.map((a) => (
            <div key={a.name} className="rounded-2xl border bg-card/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{a.name}</p>
                <Badge variant={a.tone === "warn" ? "secondary" : "outline"}>{a.confidence}%</Badge>
              </div>
              <div className="mt-3">
                <Progress value={a.confidence} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{a.note}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
