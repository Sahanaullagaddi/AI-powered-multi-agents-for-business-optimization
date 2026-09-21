import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { AlertOctagon, Send } from "lucide-react";

function organHotspot(row: PredictionRow) {
  // Simple heuristic: prefer the first organ flag; otherwise none.
  return row.organs[0] ?? null;
}

export default function HighRiskAlertCenterCard({ rows }: { rows: PredictionRow[] }) {
  const critical = useMemo(() => rows.filter((r) => r.risk === "Critical").slice(0, 6), [rows]);

  return (
    <Card className="shadow-card border-destructive/30">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">High‑Risk Alert Center</CardTitle>
          <CardDescription>Critical cases ready for escalation (demo actions)</CardDescription>
        </div>
        <Badge variant="destructive" className="gap-2">
          <AlertOctagon className="h-4 w-4" /> {critical.length} critical
        </Badge>
      </CardHeader>

      <CardContent>
        {!critical.length ? (
          <p className="text-sm text-muted-foreground">No critical patients in the current filter.</p>
        ) : (
          <div className="grid gap-2">
            {critical.map((r) => (
              <div key={r.patient + r.date} className="rounded-2xl border bg-destructive/10 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{r.patient}</p>
                      <Badge variant="destructive">Critical</Badge>
                      {organHotspot(r) ? <Badge variant="outline">Organ: {organHotspot(r)}</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.drugs.join(" + ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => window.alert(`Demo: Send alert to doctor for ${r.patient}`)}
                    >
                      <Send className="h-4 w-4" /> Send Alert to Doctor
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Alert routing, audit logs, and on‑call schedules are typically powered by a backend integration (not enabled in this demo).
        </p>
      </CardContent>
    </Card>
  );
}
