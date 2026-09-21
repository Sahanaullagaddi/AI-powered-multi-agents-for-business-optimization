import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeConfidence(row: PredictionRow) {
  // Same heuristic used elsewhere; kept local so this card is self-contained.
  const drugCount = row.drugs.length;
  const organPenalty = row.organs.length * 4;
  const complexityPenalty = Math.max(0, drugCount - 2) * 3;
  const riskPenalty = row.risk === "Critical" ? 8 : row.risk === "High" ? 5 : row.risk === "Moderate" ? 2 : 0;
  const base = 92;
  return clamp(base - organPenalty - complexityPenalty - riskPenalty, 55, 95);
}

export default function AiRiskOverviewCards({ rows }: { rows: PredictionRow[] }) {
  const metrics = useMemo(() => {
    const total = rows.length;
    const highRisk = rows.filter((r) => r.risk === "High" || r.risk === "Critical").length;
    const avgToxicity = total ? Math.round(rows.reduce((a, r) => a + (Number.isFinite(r.score) ? r.score : 0), 0) / total) : 0;
    const avgConfidence = total
      ? Math.round(rows.map(computeConfidence).reduce((a, b) => a + b, 0) / total)
      : 0;

    return { total, highRisk, avgToxicity, avgConfidence };
  }, [rows]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">AI Risk Overview</CardTitle>
        <CardDescription>High-impact clinical intelligence across the current filter set</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Total Predictions</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{metrics.total}</p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">High‑Risk Cases</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{metrics.highRisk}</p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Average Toxicity Score</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{metrics.avgToxicity}</p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">AI Confidence %</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{metrics.avgConfidence}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
