import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

const STAGES = [
  { k: "Immediate", label: "Immediate" },
  { k: "FewHours", label: "After few hours" },
  { k: "LongTerm", label: "Long-term toxicity" },
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function baseFromRisk(risk: PredictionRow["risk"]) {
  return risk === "Critical" ? 92 : risk === "High" ? 76 : risk === "Moderate" ? 52 : 28;
}

function computeTimeline(row: PredictionRow) {
  const base = baseFromRisk(row.risk);
  const drugFactor = clamp(row.drugs.length * 6, 0, 22);
  const organFactor = clamp(row.organs.length * 8, 0, 24);

  // UI-only model: early effects skew higher with higher acute interaction likelihood;
  // long-term toxicity rises with organ flags.
  const immediate = clamp(base + drugFactor + (row.risk === "Critical" ? 6 : 0), 0, 100);
  const fewHours = clamp(base + drugFactor * 0.8 + organFactor * 0.6, 0, 100);
  const longTerm = clamp(base * 0.8 + organFactor + drugFactor * 0.35, 0, 100);

  return [
    { stage: STAGES[0].label, severity: Math.round(immediate) },
    { stage: STAGES[1].label, severity: Math.round(fewHours) },
    { stage: STAGES[2].label, severity: Math.round(longTerm) },
  ];
}

export default function PatientRiskTimelineCard({ row }: { row?: PredictionRow }) {
  const data = useMemo(() => (row ? computeTimeline(row) : []), [row]);
  const max = Math.max(0, ...data.map((d) => d.severity));

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">Patient Risk Timeline</CardTitle>
          <CardDescription>Estimated onset profile for interaction effects and toxicity windows (demo model)</CardDescription>
        </div>
        {row ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={row.risk === "Critical" ? "destructive" : row.risk === "High" ? "secondary" : "outline"}>
              {row.risk}
            </Badge>
            <Badge variant="outline">{row.patient}</Badge>
          </div>
        ) : (
          <Badge variant="outline">Select a patient below</Badge>
        )}
      </CardHeader>

      <CardContent className="h-64">
        {!row ? (
          <p className="text-sm text-muted-foreground">Click a row in “Recent Predictions” to render a patient-specific timeline.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} interval={0} />
              <YAxis
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                formatter={(v) => [`${v}/100`, "Severity"]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="severity"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 4, stroke: "hsl(var(--background))", strokeWidth: 2, fill: "hsl(var(--accent))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {row ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Peak window: {data.find((d) => d.severity === max)?.stage}</span>
            <span>Inputs: {row.drugs.length} drugs • {row.organs.length || 0} organ flags</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
