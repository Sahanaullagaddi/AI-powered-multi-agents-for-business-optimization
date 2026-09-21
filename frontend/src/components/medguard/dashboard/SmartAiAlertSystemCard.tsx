import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function isTodayLabel(date: string) {
  return date.toLowerCase().startsWith("today");
}

export default function SmartAiAlertSystemCard({ rows }: { rows: PredictionRow[] }) {
  const model = useMemo(() => {
    const criticalToday = rows.filter((r) => r.risk === "Critical" && isTodayLabel(r.date)).length;
    const criticalAll = rows.filter((r) => r.risk === "Critical").length;

    const patientCounts = new Map<string, number>();
    for (const r of rows) {
      if (r.risk === "High" || r.risk === "Critical") patientCounts.set(r.patient, (patientCounts.get(r.patient) ?? 0) + 1);
    }
    const repeat = Array.from(patientCounts.entries())
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([p, c]) => ({ patient: p, count: c }));

    return { criticalToday, criticalAll, repeat };
  }, [rows]);

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">Smart AI Alert System</CardTitle>
          <CardDescription>Auto-flags critical prescriptions, dangerous combos, and repeat high-risk patients (demo)</CardDescription>
        </div>
        <Badge variant={model.criticalAll ? "destructive" : "outline"} className={model.criticalAll ? "animate-pulse" : ""}>
          Active alerts: {model.criticalAll}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-2xl border bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 border-red-200 dark:border-red-800">
          <p className="text-xs text-muted-foreground">Notification</p>
          <p className="mt-1 text-sm font-semibold">AI Alert: {model.criticalToday} critical prescriptions detected today.</p>
          <p className="mt-1 text-sm text-muted-foreground">Use triage + XAI to prioritize review (demo guidance).</p>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Repeat high-risk patients</p>
          {model.repeat.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {model.repeat.map((r) => (
                <li key={r.patient} className="flex items-center justify-between">
                  <span className="font-semibold">{r.patient}</span>
                  <span className="text-muted-foreground">{r.count} high-risk hits</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No repeat high-risk patients in the current list.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
