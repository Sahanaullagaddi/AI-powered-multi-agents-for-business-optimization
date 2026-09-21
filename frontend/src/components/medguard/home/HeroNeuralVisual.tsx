import { motion } from "framer-motion";
import { BrainCircuit, Pill } from "lucide-react";

export default function HeroNeuralVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/50 p-6 shadow-card backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-accent/18 blur-3xl" />
        <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-primary/14 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Neural pill network</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Hover nodes to preview risk signals</p>
          </div>
          <div className="rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground shadow-soft backdrop-blur-md">
            Live visual
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-background/40">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" aria-hidden>
              <defs>
                <linearGradient id="mg-line" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
                  <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              {[
                [60, 70, 170, 120],
                [170, 120, 270, 80],
                [170, 120, 240, 210],
                [240, 210, 320, 150],
                [270, 80, 320, 150],
              ].map((l, i) => (
                <motion.line
                  key={i}
                  x1={l[0]}
                  y1={l[1]}
                  x2={l[2]}
                  y2={l[3]}
                  stroke="url(#mg-line)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.08 }}
                />
              ))}
            </svg>

            {[
              { x: 60, y: 70, label: "Low" },
              { x: 170, y: 120, label: "Moderate" },
              { x: 270, y: 80, label: "High" },
              { x: 240, y: 210, label: "High" },
              { x: 320, y: 150, label: "Critical" },
            ].map((n, i) => (
              <motion.button
                key={i}
                type="button"
                className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-card/70 shadow-soft backdrop-blur-md focus-ring"
                style={{ left: `${(n.x / 400) * 100}%`, top: `${(n.y / 300) * 100}%` }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.25 + i * 0.06 }}
              >
                <Pill className="h-4 w-4 text-primary" />
                <span className="pointer-events-none absolute -bottom-10 left-1/2 w-max -translate-x-1/2 rounded-full border bg-card/80 px-3 py-1 text-xs text-muted-foreground opacity-0 shadow-soft backdrop-blur-md transition-opacity group-hover:opacity-100">
                  Risk: <span className="text-foreground">{n.label}</span>
                </span>
              </motion.button>
            ))}

            <motion.div
              aria-hidden
              className="absolute left-6 top-6 rounded-xl border bg-card/70 px-3 py-2 text-xs text-muted-foreground shadow-soft backdrop-blur-md"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-accent" />
                <span>AI sync: running</span>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-3">
            {["AI Accuracy 96%", "Real-time Risk Detection", "Multidrug AI Engine"].map((t, i) => (
              <motion.div
                key={t}
                className="rounded-2xl border bg-card/60 p-4 shadow-soft backdrop-blur-md"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="mt-1 text-xs text-muted-foreground">Demo badge — connect a model later for real telemetry.</p>
              </motion.div>
            ))}

            <motion.div
              className="rounded-2xl border bg-background/40 p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <p className="text-xs font-semibold">Floating pills</p>
              <div className="mt-3 flex gap-3">
                {[0, 1, 2].map((k) => (
                  <motion.div
                    key={k}
                    className="grid h-11 w-11 place-items-center rounded-2xl border bg-card/70 shadow-soft backdrop-blur-md"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.6 + k * 0.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Pill className="h-5 w-5 text-primary" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
