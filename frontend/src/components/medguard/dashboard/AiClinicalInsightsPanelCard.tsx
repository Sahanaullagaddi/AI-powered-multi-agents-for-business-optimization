import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function topPair(rows: PredictionRow[]) {
  const key = (a: string, b: string) => (a < b ? `${a}||${b}` : `${b}||${a}`);
  const counts = new Map<string, number>();

  for (const r of rows) {
    const present = [...new Set(r.drugs)];
    for (let i = 0; i < present.length; i++) {
      for (let j = i + 1; j < present.length; j++) {
        const k = key(present[i], present[j]);
        counts.set(k, (counts.get(k) ?? 0) + (r.risk === "Critical" ? 3 : r.risk === "High" ? 2 : 1));
      }
    }
  }

  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best) return null;
  return { pair: best[0].split("||"), score: best[1] };
}

function topOrgan(rows: PredictionRow[]) {
  const counts = new Map<string, number>();
  rows.forEach((r) => {
    r.organs.forEach((o) => counts.set(o, (counts.get(o) ?? 0) + (r.risk === "Critical" ? 3 : r.risk === "High" ? 2 : 1)));
  });
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return best ? { organ: best[0], score: best[1] } : null;
}

export default function AiClinicalInsightsPanelCard({ rows }: { rows: PredictionRow[] }) {
  const insights = useMemo(() => {
    const total = rows.length;
    const critical = rows.filter((r) => r.risk === "Critical").length;
    const highRisk = rows.filter((r) => r.risk === "High" || r.risk === "Critical").length;
    const pair = topPair(rows);
    const organ = topOrgan(rows);

    const lines: string[] = [];

    if (total) {
      lines.push(
        critical
          ? `${critical} critical cases detected in the current cohort; prioritize immediate medication reconciliation and monitoring.`
          : `No critical cases detected in the current cohort; continue routine surveillance and reconciliation.`,
      );

      if (pair) {
        lines.push(
          `Highest interaction signal: ${pair.pair.join(" + ")}; consider timing adjustments and enhanced adverse-event monitoring during peak windows.`,
        );
      }

      if (organ) {
        lines.push(
          `Organ impact concentrates on ${organ.organ}; increase targeted labs/vitals review for this organ in high-risk patients.`,
        );
      }

      if (!pair && !organ) {
        lines.push(`No dominant pair or organ hotspot emerged; expand the cohort or broaden filter criteria for research review.`);
      }

      if (highRisk) {
        lines.push(`High-risk load: ${highRisk} cases; ensure escalation thresholds align with unit-specific protocols.`);
      }
    }

    return { total, lines: lines.slice(0, 3) };
  }, [rows]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">AI Clinical Insights</CardTitle>
        <CardDescription>Concise decision-support statements derived from the current filter context</CardDescription>
      </CardHeader>
      <CardContent>
        {!insights.total ? (
          <p className="text-sm text-muted-foreground">No data available in the current filter.</p>
        ) : (
          <div className="grid gap-2">
            {insights.lines.map((t, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {t}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

