import { ReactNode, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DemoVideoDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);

  const lines = useMemo(
    () => [
      "Model ingests drug list + patient parameters",
      "Enumerates multi-drug combinations",
      "Predicts organ-specific risk & confidence",
      "Generates explainable rationale",
    ],
    [],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>How MedGuard AI works (demo)</DialogTitle>
          <DialogDescription>
            This is a lightweight “video-style” preview UI. You can later replace it with a real MP4 or model visualization.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border bg-hero-reactive p-4 shadow-card">
            <div className="absolute inset-0 opacity-70" aria-hidden>
              <div className="absolute -left-20 -top-16 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
              <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-brand-2/25 blur-3xl" />
            </div>
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-xl border bg-card/70 backdrop-blur">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.18),transparent_55%),radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.18),transparent_50%)]" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="rounded-2xl border bg-background/70 px-4 py-2 text-sm shadow-soft">
                      Demo video placeholder
                    </div>
                  </div>
                  <div className="absolute inset-y-0 left-0 w-1/3 opacity-30 motion-safe:animate-sheen bg-gradient-to-r from-transparent via-background to-transparent" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: drop a real demo video into <code>public/</code> and embed it here.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-card">
            <p className="text-sm font-semibold">What happens under the hood</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {lines.map((l) => (
                <li key={l} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="hero" onClick={() => setOpen(false)}>
                Got it
              </Button>
              <Button variant="outline" asChild>
                <a href="/how-it-works">Open full page</a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
