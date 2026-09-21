import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeConfidence(row: PredictionRow) {
  // UI-only: heuristics that look realistic for a demo dashboard.
  const drugCount = row.drugs.length;
  const organPenalty = row.organs.length * 4;
  const complexityPenalty = Math.max(0, drugCount - 2) * 3;
  const riskPenalty = row.risk === "Critical" ? 8 : row.risk === "High" ? 5 : row.risk === "Moderate" ? 2 : 0;
  const base = 92;
  return clamp(base - organPenalty - complexityPenalty - riskPenalty, 55, 95);
}

export default function AiConfidencePanelCard({ rows }: { rows: PredictionRow[] }) {
  const confidences = rows.map(computeConfidence);
  const avg = confidences.length ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;

  const buckets = {
    high: confidences.filter((c) => c >= 85).length,
    medium: confidences.filter((c) => c >= 70 && c < 85).length,
    low: confidences.filter((c) => c < 70).length,
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">AI Confidence</CardTitle>
        <CardDescription>Reliability estimate across current filter (demo heuristic)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-extrabold tracking-tight">{avg}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Avg confidence</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Badge variant="outline">High {buckets.high}</Badge>
            <Badge variant="outline">Medium {buckets.medium}</Badge>
            <Badge variant="outline">Low {buckets.low}</Badge>
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
          <p>Signal drivers: drug count, organ flags, and overall risk category.</p>
        </div>
      </CardContent>
    </Card>
  );
}
