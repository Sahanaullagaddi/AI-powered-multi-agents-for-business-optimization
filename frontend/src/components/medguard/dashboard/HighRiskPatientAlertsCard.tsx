import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { AlertTriangle } from "lucide-react";

export default function HighRiskPatientAlertsCard({ rows }: { rows: PredictionRow[] }) {
  const critical = rows.filter((r) => r.risk === "Critical");
  const high = rows.filter((r) => r.risk === "High");
  const top = [...critical, ...high].slice(0, 4);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">High‑Risk Patient Alerts</CardTitle>
        <CardDescription>Critical predictions are highlighted for rapid review</CardDescription>
      </CardHeader>
      <CardContent>
        {!top.length ? (
          <p className="text-sm text-muted-foreground">No high‑risk results in the current filter.</p>
        ) : (
          <div className="grid gap-2">
            {top.map((r) => (
              <div
                key={r.patient + r.date}
                className={
                  "flex items-start justify-between gap-3 rounded-2xl border p-3 " +
                  (r.risk === "Critical" ? "bg-destructive/10" : "bg-card/40")
                }
              >
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={"h-4 w-4 " + (r.risk === "Critical" ? "text-destructive" : "text-accent")} />
                    <p className="text-sm font-semibold">{r.patient}</p>
                    <Badge variant={r.risk === "Critical" ? "destructive" : "secondary"}>{r.risk}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.drugs.join(" + ")}</p>
                  {!!r.organs.length && (
                    <p className="mt-1 text-xs text-muted-foreground">Organs: {r.organs.join(", ")}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
