import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { primaryOrgan, riskWeight } from "@/components/medguard/dashboard/triage";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeFutureRisk(row: PredictionRow) {
  // Demo-only forward model: assumes risk drifts with complexity (drug count) and organ flags.
  const w = riskWeight(row.risk);
  const complexity = clamp(row.drugs.length * 3 + row.organs.length * 6, 0, 40);

  const current = clamp(row.score, 0, 100);
  const day7 = clamp(current + w * 2 + complexity * 0.15, 0, 100);
  const day30 = clamp(current + w * 5 + complexity * 0.35, 0, 100);

  return { current, day7: Math.round(day7), day30: Math.round(day30) };
}

export default function AiRiskPredictionTimelineCard({ row }: { row?: PredictionRow }) {
  const model = useMemo(() => (row ? computeFutureRisk(row) : null), [row]);

  const data = useMemo(() => {
    if (!row || !model) return [];
    return [
      { t: "Now", risk: model.current },
      { t: "7 days", risk: model.day7 },
      { t: "30 days", risk: model.day30 },
    ];
  }, [row, model]);

  const organ = row ? primaryOrgan(row) : undefined;
  const delta30 = row && model ? model.day30 - model.current : 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">AI Risk Prediction Timeline</CardTitle>
          <CardDescription>How interaction/toxicity risk may evolve if the regimen continues (demo forecast)</CardDescription>
        </div>
        {row ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={row.risk === "Critical" ? "destructive" : row.risk === "High" ? "secondary" : "outline"}>{row.risk}</Badge>
            <Badge variant="outline">{row.patient}</Badge>
          </div>
        ) : (
          <Badge variant="outline">Select a patient below</Badge>
        )}
      </CardHeader>

      <CardContent className="h-72">
        {!row || !model ? (
          <p className="text-sm text-muted-foreground">Select a row in “Recent Predictions” to generate a 7/30-day risk forecast.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} interval={0} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [`${v}/100`, "Predicted risk"]}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "hsl(var(--background))", strokeWidth: 2, fill: "hsl(var(--accent))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Example insight: If this regimen continues for 30 days → {organ ? `${organ} risk` : "organ risk"} {delta30 >= 0 ? "↑" : "↓"}
                {Math.abs(delta30)}%
              </span>
              <span>Horizon: 7d + 30d</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
