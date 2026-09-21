import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Risk = "Low" | "Moderate" | "High" | "Critical";

function riskForIndex(i: number): { risk: Risk; score: number } {
  const map: Array<{ risk: Risk; score: number }> = [
    { risk: "Low", score: 18 },
    { risk: "Moderate", score: 42 },
    { risk: "High", score: 71 },
    { risk: "Critical", score: 92 },
  ];
  return map[i % map.length];
}

export default function PillRiskPreview() {
  const pills = useMemo(() => new Array(9).fill(null).map((_, i) => i), []);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-3">
        {pills.map((i) => {
          const { risk, score } = riskForIndex(i);
          const active = hovered === i;
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-background/70 p-3 text-left shadow-card transition-transform focus-ring",
                "hover:-translate-y-0.5",
              )}
              aria-label={`Pill ${i + 1} risk preview ${risk}`}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-secondary" />
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
              </div>

              <div className="relative mt-3">
                <p className="text-xs font-semibold">Risk Preview</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <Badge
                    variant={risk === "Critical" ? "destructive" : risk === "High" ? "secondary" : "outline"}
                    className={cn(risk === "High" && "bg-accent/18 text-foreground border-transparent")}
                  >
                    {risk}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{score}/100</span>
                </div>
              </div>

              <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    risk === "Low" && "bg-primary/55",
                    risk === "Moderate" && "bg-primary/75",
                    risk === "High" && "bg-accent",
                    risk === "Critical" && "bg-destructive",
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute bottom-3 left-3 right-3 rounded-xl border bg-card/80 px-3 py-2 text-xs text-muted-foreground opacity-0 shadow-soft backdrop-blur-sm transition-opacity",
                  active && "opacity-100",
                )}
              >
                Hover hint: higher score → monitor/adjust/avoid.
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Hover effect is for UI demonstration—replace with real model outputs when connected.
      </p>
    </div>
  );
}
