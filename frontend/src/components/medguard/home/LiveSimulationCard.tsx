import { motion } from "framer-motion";
import { Activity, BrainCircuit, HeartPulse, Pill, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const demoPills = [
  { id: "p1", label: "Metformin", icon: Pill },
  { id: "p2", label: "Warfarin", icon: ShieldAlert },
  { id: "p3", label: "Amiodarone", icon: HeartPulse },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function LiveSimulationCard() {
  const [picked, setPicked] = useState<string[]>([]);

  const risk = useMemo(() => {
    const base = 18 + picked.length * 22;
    const bump = picked.includes("p2") && picked.includes("p3") ? 18 : 0;
    return clamp(base + bump, 0, 100);
  }, [picked]);

  const label = risk >= 80 ? "Critical" : risk >= 60 ? "High" : risk >= 35 ? "Moderate" : "Low";

  return (
    <section className="py-14">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Interactive AI demo (UI simulation)</h2>
            <p className="mt-2 max-w-prose text-muted-foreground">
              Drag demo pills into the tray to see a live risk meter and organ warning lights — built for a future real model.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" onClick={() => setPicked(["p1", "p2", "p3"]) }>
                Try Live Simulation
              </Button>
              <Button variant="heroOutline" onClick={() => setPicked([])}>
                Reset
              </Button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Real-time Organ Damage Prediction", "AI Confidence Score Meter", "Prescription Comparison AI", "Doctor Alert System demo"].map(
                (t) => (
                  <div key={t} className="rounded-2xl border bg-card/50 p-4 shadow-soft backdrop-blur-md">
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Hover-ready demo cards with glow interactions.</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-card/50 p-6 shadow-card backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Live risk meter</p>
                <p className="mt-1 text-xs text-muted-foreground">Drop pills → AI score rises</p>
              </div>
              <div className="rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-soft backdrop-blur-md">
                Risk: <span className="text-foreground">{label}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {demoPills.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.button
                    key={p.id}
                    type="button"
                    drag
                    dragMomentum={false}
                    whileDrag={{ scale: 1.04 }}
                    className="group rounded-2xl border bg-card/70 p-3 text-left shadow-soft backdrop-blur-md focus-ring"
                    onClick={() => setPicked((cur) => (cur.includes(p.id) ? cur : [...cur, p.id]))}
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{p.label}</p>
                        <p className="text-xs text-muted-foreground">Drag / click to add</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: picked.includes(p.id) ? "100%" : "0%" }}
                        transition={{ duration: 0.35 }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      See demo
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-dashed bg-background/40 p-5">
              <p className="text-xs font-semibold">Drop tray</p>
              <p className="mt-1 text-xs text-muted-foreground">(Demo) Clicking pills simulates a successful drop.</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {picked.length === 0 ? (
                  <span className="text-xs text-muted-foreground">No pills selected yet</span>
                ) : (
                  picked.map((id) => {
                    const pill = demoPills.find((p) => p.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs shadow-soft backdrop-blur-md"
                      >
                        <Pill className="h-3.5 w-3.5 text-primary" />
                        {pill?.label}
                      </span>
                    );
                  })
                )}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Risk score</span>
                  <span className="font-semibold text-foreground">{risk}/100</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className={cn("h-full rounded-full", risk >= 80 ? "bg-destructive" : risk >= 60 ? "bg-primary" : "bg-accent")}
                    initial={{ width: 0 }}
                    animate={{ width: `${risk}%` }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: "Heart", icon: HeartPulse, on: risk >= 55 },
                  { label: "Kidney", icon: Activity, on: risk >= 40 },
                  { label: "Liver", icon: BrainCircuit, on: risk >= 70 },
                ].map((o) => {
                  const Icon = o.icon;
                  return (
                    <div
                      key={o.label}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-2xl border bg-card/60 px-3 py-2 text-xs shadow-soft backdrop-blur-md",
                        o.on ? "ring-1 ring-accent/40" : "opacity-70",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", o.on ? "text-accent" : "text-muted-foreground")} />
                      <span className={o.on ? "text-foreground" : "text-muted-foreground"}>{o.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
