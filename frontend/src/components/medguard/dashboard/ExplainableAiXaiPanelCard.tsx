import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function hashToPick(s: string, options: string[]) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}

export default function ExplainableAiXaiPanelCard({ row }: { row?: PredictionRow }) {
  const xai = useMemo(() => {
    if (!row) return null;

    const a = row.drugs[0] ?? "Drug A";
    const b = row.drugs[1] ?? "Drug B";

    const enzyme = hashToPick(row.drugs.join("|"), ["CYP3A4", "CYP2C9", "CYP2D6", "P-gp"]);
    const organ = row.organs[0] ?? "Liver";

    const reasons = [
      `Metabolism conflict: ${a} and ${b} both rely on ${enzyme}.`,
      `Competition → higher exposure → toxicity risk increases (demo).`,
      `Organ overlap: toxicity signal maps to ${organ} flags in this case (demo).`,
    ];

    return { a, b, enzyme, organ, reasons };
  }, [row]);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">Explainable AI Dashboard (XAI)</CardTitle>
          <CardDescription>Why the model predicted this risk (transparent, demo explanation)</CardDescription>
        </div>
        {row ? <Badge variant="outline">XAI: On</Badge> : <Badge variant="outline">Select a patient</Badge>}
      </CardHeader>

      <CardContent>
        {!row || !xai ? (
          <p className="text-sm text-muted-foreground">Select a prediction row to generate an explainable rationale.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs text-muted-foreground">Mechanism visual (demo)</p>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div className="rounded-xl border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Drug</p>
                  <p className="mt-1 text-sm font-semibold">{xai.a}</p>
                </div>
                <div className="rounded-xl border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Shared pathway</p>
                  <p className="mt-1 text-sm font-semibold">{xai.enzyme}</p>
                </div>
                <div className="rounded-xl border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Drug</p>
                  <p className="mt-1 text-sm font-semibold">{xai.b}</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border bg-muted/30 p-3 text-sm">
                <span className="font-semibold">Overlap</span>: {xai.a} → {xai.enzyme} ← {xai.b} → competition → toxic buildup (demo)
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs text-muted-foreground">Why the risk increases</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {xai.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground">Note: Explanations are UI-generated and not clinically validated.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
