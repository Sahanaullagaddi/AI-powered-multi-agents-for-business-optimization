import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function About() {
  return (
    <AppLayout>
      <main className="container py-10">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">About MedGuard AI</h1>
          <p className="mt-2 text-muted-foreground">
            Elderly patients often take 5–10 medications. Most tools flag only known pairs—MedGuard AI is designed to scale to
            multi-drug combinations and patient-specific parameters.
          </p>
        </header>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Mission</CardTitle>
              <CardDescription>Safer prescribing via explainable, multimorbidity-aware decision support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                The goal is to help clinicians and patients understand risk earlier, especially when combinations of 4–5+
                medications interact through metabolism, organ burden, and patient factors.
              </p>
              <p>
                This website is a polished front-end prototype with mock prediction logic, ready to connect to an AI model and
                a database.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Team</CardTitle>
              <CardDescription>Replace with real profiles later</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">Clinical Advisor</p>
                <p className="text-xs">Geriatric pharmacotherapy</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">ML Engineer</p>
                <p className="text-xs">Graph + multi-agent explainability</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">Product</p>
                <p className="text-xs">Clinical workflow design</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
              <CardDescription>Demo form (no backend)</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Your name" />
              <Input placeholder="Email" />
              <div className="md:col-span-2">
                <Textarea placeholder="Message" />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button variant="hero" onClick={() => window.alert("Demo: message sent")}
                >
                  Send
                </Button>
                <Button variant="outline" asChild>
                  <a href="/predictor">Try Predictor</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppLayout>
  );
}
