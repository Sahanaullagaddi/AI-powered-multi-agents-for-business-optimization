import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { AlertTriangle } from "lucide-react";

export default function HighRiskAlertPanel({
  rows,
  onViewDetails,
}: {
  rows: PredictionRow[];
  onViewDetails?: (row: PredictionRow) => void;
}) {
  const critical = useMemo(() => rows.filter((r) => r.risk === "Critical").slice(0, 6), [rows]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">High‑Risk Alerts</CardTitle>
        <CardDescription>Critical patients requiring immediate review</CardDescription>
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
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-semibold">{r.patient}</p>
                      <Badge variant="destructive">Critical</Badge>
                      <Badge variant="outline">Toxicity {r.score}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.drugs.join(" + ")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Organ risk: {r.organs.length ? r.organs.join(", ") : "—"}</p>
                  </div>

                  <Button size="sm" variant="outline" onClick={() => onViewDetails?.(r)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
