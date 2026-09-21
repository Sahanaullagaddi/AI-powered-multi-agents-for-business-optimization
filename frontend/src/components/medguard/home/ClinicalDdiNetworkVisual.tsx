import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Node = {
  id: string;
  label: string;
  kind: "drug" | "organ";
  x: number;
  y: number;
  risk: "Low" | "Moderate" | "High";
  note: string;
};

const baseNodes: Node[] = [
  { id: "d1", label: "Warfarin", kind: "drug", x: 18, y: 28, risk: "High", note: "Bleeding risk ↑ with interacting agents" },
  { id: "d2", label: "Amiodarone", kind: "drug", x: 34, y: 60, risk: "Moderate", note: "CYP inhibition may raise exposure" },
  { id: "d3", label: "Omeprazole", kind: "drug", x: 22, y: 78, risk: "Low", note: "Potential metabolic interaction" },
  { id: "o1", label: "Heart", kind: "organ", x: 74, y: 36, risk: "Moderate", note: "QT / rhythm monitoring suggested" },
  { id: "o2", label: "Liver", kind: "organ", x: 82, y: 62, risk: "Low", note: "Hepatic metabolism considerations" },
  { id: "o3", label: "Kidney", kind: "organ", x: 68, y: 78, risk: "Moderate", note: "Renal dosing considerations" },
];

function riskBadgeVariant(risk: Node["risk"]) {
  if (risk === "High") return "destructive" as const;
  if (risk === "Moderate") return "secondary" as const;
  return "outline" as const;
}

export default function ClinicalDdiNetworkVisual() {
  const [hovered, setHovered] = useState<Node | null>(null);

  const nodes = useMemo(() => baseNodes, []);
  const edges = useMemo(
    () => [
      ["d1", "o2"],
      ["d1", "o1"],
      ["d2", "o1"],
      ["d2", "o2"],
      ["d3", "o2"],
      ["d3", "o3"],
    ],
    [],
  );

  const find = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <Card className="relative overflow-hidden border bg-card/50 shadow-card backdrop-blur-xl">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Interaction network preview</p>
            <p className="mt-1 text-xs text-muted-foreground">Pills ↔ organs (illustrative)</p>
          </div>
          {hovered ? (
            <Badge variant={riskBadgeVariant(hovered.risk)}>{hovered.risk} risk</Badge>
          ) : (
            <Badge variant="outline">Hover nodes</Badge>
          )}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <svg viewBox="0 0 100 100" className="h-[260px] w-full" aria-label="Drug to organ interaction network">
              {edges.map(([a, b]) => {
                const A = find(a);
                const B = find(b);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                );
              })}

              {nodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.kind === "drug" ? 5.5 : 6.2}
                    fill={n.kind === "drug" ? "hsl(var(--primary) / 0.18)" : "hsl(var(--accent) / 0.14)"}
                    stroke={n.kind === "drug" ? "hsl(var(--primary) / 0.55)" : "hsl(var(--accent) / 0.55)"}
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.kind === "drug" ? 10 : 11}
                    fill="transparent"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "default" }}
                  />
                </g>
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border" />
          </div>

          <div className="rounded-2xl border bg-card/60 p-4 shadow-soft backdrop-blur-md">
            <p className="text-xs font-semibold text-muted-foreground">Risk tooltip</p>
            <p className="mt-2 text-sm font-semibold">
              {hovered ? hovered.label : "Hover a pill or organ"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hovered ? hovered.note : "Preview key drivers that clinicians can review."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className={cn(!hovered ? "opacity-60" : "")}
              >
                DDI
              </Badge>
              <Badge variant="outline" className={cn(!hovered ? "opacity-60" : "")}
              >
                Organ impact
              </Badge>
              <Badge variant="outline" className={cn(!hovered ? "opacity-60" : "")}
              >
                Explainability
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
