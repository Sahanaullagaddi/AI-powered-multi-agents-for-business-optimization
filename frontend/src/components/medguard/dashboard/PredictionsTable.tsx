import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { Download, Send } from "lucide-react";

export default function PredictionsTable({
  rows,
  selectedKey,
  onSelectRow,
}: {
  rows: PredictionRow[];
  selectedKey?: string;
  onSelectRow?: (row: PredictionRow) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="grid grid-cols-12 bg-muted px-4 py-3 text-xs font-semibold text-muted-foreground">
        <div className="col-span-2">Patient</div>
        <div className="col-span-3">Drugs</div>
        <div className="col-span-2">Risk</div>
        <div className="col-span-2">Organs</div>
        <div className="col-span-1">Score</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {rows.map((r) => {
        const key = r.patient + r.date;
        const isSelected = !!selectedKey && key === selectedKey;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectRow?.(r)}
            className={cn(
              "grid w-full grid-cols-12 items-center gap-2 border-t px-4 py-3 text-left transition-colors hover:bg-accent/6",
              isSelected && "bg-accent/10",
            )}
          >
            <div className="col-span-2 text-sm font-semibold">{r.patient}</div>
            <div className="col-span-3 flex flex-wrap gap-1">
              {r.drugs.map((d) => (
                <Badge key={d} variant="outline">
                  {d}
                </Badge>
              ))}
            </div>
            <div className="col-span-2">
              <Badge
                variant={r.risk === "Critical" ? "destructive" : r.risk === "High" ? "secondary" : "outline"}
                className={r.risk === "High" ? "bg-accent/18 text-foreground border-transparent" : undefined}
              >
                {r.risk}
              </Badge>
            </div>
            <div className="col-span-2 flex flex-wrap gap-1">
              {r.organs.length ? (
                r.organs.map((o) => (
                  <Badge key={o} variant="outline" className="bg-card/40">
                    {o}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            <div className="col-span-1 text-sm font-semibold">{r.score}</div>
            <div className="col-span-1 text-sm text-muted-foreground">{r.date}</div>
            <div className="col-span-1 flex items-center justify-end gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.alert("Demo: Download report");
                }}
              >
                <span className="sr-only">Download</span>
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.alert("Demo: Send to doctor");
                }}
              >
                <span className="sr-only">Send</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </button>
        );
      })}

      {!rows.length && <div className="border-t px-4 py-10 text-center text-sm text-muted-foreground">No results.</div>}
    </div>
  );
}
