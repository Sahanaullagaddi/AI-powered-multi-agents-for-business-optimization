import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeConfidence(row: PredictionRow) {
  const drugCount = row.drugs.length;
  const organPenalty = row.organs.length * 4;
  const complexityPenalty = Math.max(0, drugCount - 2) * 3;
  const riskPenalty = row.risk === "Critical" ? 8 : row.risk === "High" ? 5 : row.risk === "Moderate" ? 2 : 0;
  const base = 92;
  return clamp(base - organPenalty - complexityPenalty - riskPenalty, 55, 95);
}

function isToday(iso: string) {
  // current dataset uses short dates; treat "today" as same string as local date.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  return iso === todayStr;
}

export default function AiModelAnalyticsPanel({ rows }: { rows: PredictionRow[] }) {
  const totalToday = rows.filter((r) => isToday(r.date)).length;
  const criticalDetected = rows.filter((r) => r.risk === "Critical").length;
  const avgConfidence = rows.length
    ? Math.round(rows.map(computeConfidence).reduce((a, b) => a + b, 0) / rows.length)
    : 0;

  // Demo “accuracy”: stable but responsive to filter (penalize higher complexity).
  const complexity = rows.length ? rows.reduce((a, r) => a + Math.max(0, r.drugs.length - 2), 0) / rows.length : 0;
  const accuracy = clamp(94.2 - complexity * 1.15 - criticalDetected * 0.12, 86, 96);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">AI Model Analytics</CardTitle>
          <CardDescription>Operational metrics for the deployed interaction-risk model (demo)</CardDescription>
        </div>
        <Badge variant="outline">Live dashboard</Badge>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">AI accuracy</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{accuracy.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Calibration: last 30 days</p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Predictions today</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{totalToday}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across current filters</p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Critical cases detected</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{criticalDetected}</p>
            <p className="mt-1 text-xs text-muted-foreground">Escalation threshold met</p>
          </div>

          <div className="rounded-2xl border bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Avg confidence</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{avgConfidence}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Per-case explainability</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
