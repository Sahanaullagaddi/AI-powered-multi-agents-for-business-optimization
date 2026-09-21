import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import {
  Activity,
  BrainCircuit,
  LayoutDashboard,
  Pill,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";

export default function HowItWorks() {
  const cards = useMemo(
    () => [
      {
        n: "01",
        icon: <ScanSearch className="h-5 w-5" />,
        title: "Upload Medicines or Prescription",
        desc: "Upload tablet images, prescription PDFs, or manually enter drug names. The system detects and identifies each medication (demo).",
        highlights: [
          "Pill image recognition",
          "PDF prescription scanning",
          "Auto drug name detection",
          "Multi-drug support (5–10 drugs)",
        ],
      },
      {
        n: "02",
        icon: <SlidersHorizontal className="h-5 w-5" />,
        title: "Add Patient Health Parameters",
        desc: "Provide age, weight, kidney/liver function, and diseases so risk is personalized to patient context (demo).",
        highlights: [
          "Age & weight based analysis",
          "Kidney & liver condition impact",
          "Disease-based sensitivity",
          "Personalized risk calculation",
        ],
      },
      {
        n: "03",
        icon: <BrainCircuit className="h-5 w-5" />,
        title: "AI Analyzes All Drug Combinations",
        desc: "Unlike basic tools, the model evaluates multi-drug regimens (not just pairs) and simulates metabolism conflicts (demo).",
        highlights: [
          "Multi-drug interaction prediction",
          "Metabolism conflict detection",
          "Toxicity overlap analysis",
          "Organ impact detection",
        ],
      },
      {
        n: "04",
        icon: <Activity className="h-5 w-5" />,
        title: "Detect Risk Level & Affected Organs",
        desc: "AI generates a risk label and toxicity score (0–100) and flags organs that may be impacted (demo).",
        highlights: [
          "Risk level (Low / Moderate / High / Critical)",
          "Toxicity score (0–100)",
          "Liver, kidney, heart impact",
          "Color-coded risk meter",
        ],
      },
      {
        n: "05",
        icon: <Pill className="h-5 w-5" />,
        title: "Understand Why Risk Occurs",
        desc: "Explainable AI surfaces the likely mechanism (enzyme conflict, pathway overlap) and patient-specific reasoning (demo).",
        highlights: [
          "Enzyme conflict explanation",
          "Drug metabolism visualization",
          "Patient-specific reasoning",
          "AI confidence score",
        ],
      },
      {
        n: "06",
        icon: <LayoutDashboard className="h-5 w-5" />,
        title: "Get Safety Suggestions & Track History",
        desc: "Review cases in the dashboard, receive safer-combination suggestions, and track history across patients (demo).",
        highlights: [
          "AI safer alternative suggestions",
          "Save prediction history",
          "Download reports",
          "Clinical dashboard tracking",
        ],
      },
    ],
    [],
  );

  return (
    <AppLayout>
      <main className="container py-10">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">How MedGuard AI Works</h1>
          <p className="mt-2 text-muted-foreground">
            A clinical, explainable workflow for polypharmacy safety screening (demo UI; not medical advice).
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Card key={c.n} className="group shadow-card transition-transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-accent/15 p-2 text-accent transition-transform group-hover:scale-105">{c.icon}</div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">{c.n}</p>
                </div>
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span className="text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Data sources & limitations</CardTitle>
              <CardDescription>Clinical-grade UX; demo-only outputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-semibold">Inputs</p>
                  <p className="mt-1 text-sm text-muted-foreground">Drug names, patient parameters, and organ-risk flags (demo/mock).</p>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-semibold">Outputs</p>
                  <p className="mt-1 text-sm text-muted-foreground">Risk labels, scores, timelines, and explanations generated for demonstration.</p>
                </div>
                <div className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-semibold">Limitations</p>
                  <p className="mt-1 text-sm text-muted-foreground">Not validated for clinical use; always verify against authoritative references.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <Card className="shadow-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Roles in the workflow</CardTitle>
              <CardDescription>Designed for polypharmacy review without storing PHI in the demo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold">Clinical Pharmacist</p>
                <p className="mt-1 text-sm text-muted-foreground">Medication reconciliation, interaction screening, regimen rationalization.</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold">Prescribing Clinician</p>
                <p className="mt-1 text-sm text-muted-foreground">Final decisions; alternatives, dose adjustments, monitoring plan.</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold">Nursing / Care Team</p>
                <p className="mt-1 text-sm text-muted-foreground">Operational monitoring (vitals/symptoms), escalation, adherence support.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Safety checklist (recommended)</CardTitle>
              <CardDescription>Use alongside local protocols; the demo does not provide medical advice</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                <li>Confirm current medication list (including OTC/herbals) and indications.</li>
                <li>Review kidney/liver function and dose adjustments for each drug.</li>
                <li>Check high-risk combinations (anticoagulants, QT-risk agents, CNS depressants).</li>
                <li>Validate monitoring plan (labs, ECG, blood pressure, symptom checks) and timing.</li>
                <li>Document rationale and communicate changes across the care team.</li>
              </ol>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppLayout>
  );
}
