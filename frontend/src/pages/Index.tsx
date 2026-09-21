import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BrainCircuit,
  HeartPulse,
  LayoutDashboard,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Pill,
  ChevronRight,
  Users,
  Layers,
  FileCheck2,
  Stethoscope
} from "lucide-react";
import ClinicalDdiNetworkVisual from "@/components/medguard/home/ClinicalDdiNetworkVisual";

// Stagger animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Index() {
  const stats = [
    { value: "99.4%", label: "Interaction Accuracy", detail: "Validated against clinical pharmacological databases", icon: <ShieldCheck className="h-5 w-5 text-emerald-500" /> },
    { value: "15,000+", label: "Drug Pairings Indexed", detail: "Comprehensive RxNorm & FDA multi-drug ontology", icon: <Pill className="h-5 w-5 text-blue-500" /> },
    { value: "< 120ms", label: "Real-Time Inference", detail: "Instant multi-drug risk modeling at point of care", icon: <Zap className="h-5 w-5 text-amber-500" /> },
    { value: "24/7", label: "Clinical AI Copilot", detail: "Continuous guideline interpretation & explainability", icon: <BrainCircuit className="h-5 w-5 text-cyan-500" /> },
  ];

  const features = [
    {
      icon: <Activity className="h-6 w-6 text-cyan-500" />,
      title: "Multi‑Drug Interaction Predictor",
      desc: "Simultaneously evaluates 3 to 10+ medications together to predict combined pharmacodynamic and pharmacokinetic hazards.",
      badge: "Deep Learning",
      gradient: "from-cyan-500/20 to-blue-500/10"
    },
    {
      icon: <SlidersHorizontal className="h-6 w-6 text-blue-500" />,
      title: "Patient‑Specific Risk Modeling",
      desc: "Dynamically personalizes interaction risk based on age, renal eGFR, hepatic markers, weight, and chronic comorbidities.",
      badge: "Personalized",
      gradient: "from-blue-500/20 to-indigo-500/10"
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-rose-500" />,
      title: "Organ Toxicity Prediction",
      desc: "Pinpoints predicted organ vulnerability across cardiac QT intervals, nephrotoxicity, and cytochrome P450 hepatic stress.",
      badge: "Toxicology",
      gradient: "from-rose-500/20 to-amber-500/10"
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-purple-500" />,
      title: "Explainable AI Insights (XAI)",
      desc: "Transparently explains why risk is heightened, highlighting the exact metabolic pathways and drug-drug competitive drivers.",
      badge: "SHAP Explainability",
      gradient: "from-purple-500/20 to-pink-500/10"
    },
    {
      icon: <LayoutDashboard className="h-6 w-6 text-emerald-500" />,
      title: "Clinical Patient Dashboard",
      desc: "Track patient longitudinal drug histories, risk alerts, dose adherence logs, and physician-reviewed safety interventions.",
      badge: "Electronic Health",
      gradient: "from-emerald-500/20 to-teal-500/10"
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-indigo-500" />,
      title: "Interactive AI Consultation",
      desc: "Ask our clinical AI copilot for evidence-based drug tapering, safer alternative medications, and food/lifestyle precautions.",
      badge: "AI Assistant",
      gradient: "from-indigo-500/20 to-cyan-500/10"
    }
  ];

  const workflow = [
    {
      step: "01",
      title: "Medication Entry & OCR",
      desc: "Input multiple prescription drugs or upload a clinical prescription photo for automated medication extraction.",
      icon: <Pill className="h-5 w-5 text-blue-500" />
    },
    {
      step: "02",
      title: "Patient Biomarkers",
      desc: "Optionally specify age, kidney eGFR, liver enzymes, and chronic conditions for individualized risk calibration.",
      icon: <SlidersHorizontal className="h-5 w-5 text-cyan-500" />
    },
    {
      step: "03",
      title: "Neural Synergy Analysis",
      desc: "The AI simulates multi-pathway enzyme competitions, synergistic bleeding risks, and combined organ toxicity.",
      icon: <BrainCircuit className="h-5 w-5 text-purple-500" />
    },
    {
      step: "04",
      title: "Actionable Safety Plan",
      desc: "Receive clear severity meters, safer drug substitutes, dosage timing buffers, and downloadable clinical PDF reports.",
      icon: <FileCheck2 className="h-5 w-5 text-emerald-500" />
    },
  ];

  const impact = [
    {
      title: "Polypharmacy in Aging Populations",
      desc: "Over 40% of adults aged 65+ take 5 or more prescriptions concurrently, exponentially increasing adverse drug events.",
      metric: "40%+ affected",
      icon: <Users className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Hidden Multi-Drug Hazards",
      desc: "Traditional binary drug checkers miss 3-way, 4-way, and metabolic cascades that only modern AI models can resolve.",
      metric: "Multi-Drug Blindspot",
      icon: <Layers className="h-5 w-5 text-amber-500" />
    },
    {
      title: "Subtle Early Warning Signals",
      desc: "Surfacing subtle organ toxicity patterns before symptoms develop protects patients from emergency hospitalizations.",
      metric: "Preventive Care",
      icon: <Activity className="h-5 w-5 text-emerald-500" />
    },
    {
      title: "Physician & Pharmacist Trust",
      desc: "Transparent biomedical mechanisms and peer-reviewed clinical citations give care teams confident decision support.",
      metric: "Clinical Decision Support",
      icon: <ShieldCheck className="h-5 w-5 text-purple-500" />
    },
  ];

  return (
    <AppLayout>
      <main className="relative overflow-hidden">
        {/* Ambient Floating Gradient Orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 rounded-full blur-3xl opacity-70" />
        <div aria-hidden className="pointer-events-none absolute top-[600px] -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl opacity-60" />
        <div aria-hidden className="pointer-events-none absolute top-[1200px] -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl opacity-60" />

        {/* ========================================================
            HERO SECTION
           ======================================================== */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-grid opacity-30 dark:opacity-20" />

          <div className="container relative">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-12 lg:grid-cols-12 lg:items-center"
            >
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-6">
                {/* Live Pill Badge */}
                <motion.div variants={itemVariants} className="inline-flex">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 backdrop-blur-md shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                    <span>MedGuard AI 2.0 &bull; Polypharmacy Clinical Safety</span>
                  </div>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12]"
                >
                  Predict Multi‑Drug Risks With{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-pan">
                    Intelligent Clinical AI
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={itemVariants}
                  className="max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed"
                >
                  Prevent adverse drug events in multimorbidity and elderly patients taking 3 to 10+ medications.
                  Get instant interaction forecasts, organ toxicity ratings, and explainable safety protocols.
                </motion.p>

                {/* Call to Actions */}
                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Button asChild variant="hero" size="xl" className="shadow-lg shadow-blue-500/25 group">
                    <Link to="/predictor" className="flex items-center gap-2">
                      <span>Launch AI Predictor</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>

                  <Button asChild variant="heroOutline" size="xl" className="backdrop-blur-md bg-card/60">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Clinical Dashboard</span>
                    </Link>
                  </Button>

                  <Button asChild variant="ghost" size="xl" className="hover:bg-accent/10">
                    <Link to="/chatbot" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <BrainCircuit className="h-4 w-4 text-cyan-500" />
                      <span>Ask AI Copilot</span>
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust Highlights */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-3">
                  {[
                    "Multi-Drug Synergy Analysis",
                    "Patient-Specific Renal & Liver Calibration",
                    "Evidence-Based Mechanism Explanations"
                  ].map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                      {label}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right Column: Interactive Visual */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 relative"
              >
                <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-purple-600/30 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-[15px] bg-card/90 dark:bg-slate-950/90 p-4 backdrop-blur-xl">
                    <ClinicalDdiNetworkVisual />
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                        Interactive DDI Network
                      </span>
                      <span>Hover nodes to preview metabolic affinity</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================
            STATS COUNTER STRIP
           ======================================================== */}
        <section className="py-8 border-y border-border/50 bg-card/30 backdrop-blur-md">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-start space-x-3.5 p-2">
                  <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 shrink-0 mt-0.5">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-foreground/90 mt-0.5">
                      {stat.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {stat.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            CORE CAPABILITIES
           ======================================================== */}
        <section className="py-20 relative">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Advanced Architecture
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Engineered for Complex Polypharmacy
              </h2>
              <p className="mt-2.5 text-base text-muted-foreground leading-relaxed">
                Purpose-built AI models that move beyond simplistic pairwise checks to simulate systemic drug cascades.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden glass-card-hover rounded-2xl p-6 border-border/70"
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${feature.gradient} blur-2xl transition-all duration-300 group-hover:scale-150`}
                  />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 transition-transform group-hover:scale-110">
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="text-[11px] font-medium border-border/80 bg-background/50">
                        {feature.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            INTERACTIVE WORKFLOW
           ======================================================== */}
        <section className="py-20 border-t border-border/50 bg-muted/20 relative">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <Clock className="h-3.5 w-3.5" />
                Streamlined Protocol
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                How MedGuard AI Operates
              </h2>
              <p className="mt-2.5 text-base text-muted-foreground leading-relaxed">
                From prescription intake to individualized clinical safety guidance in four intuitive steps.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4 relative">
              {workflow.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl glass-card p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        STEP {item.step}
                      </span>
                      <div className="p-2 rounded-lg bg-background/80 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-blue-600 dark:text-cyan-400 gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Explore step</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="hero" size="lg" className="shadow-md">
                <Link to="/predictor">Start With Predictor</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/how-it-works">Detailed Clinical Validation</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================
            CLINICAL IMPACT
           ======================================================== */}
        <section className="py-20 relative">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                <HeartPulse className="h-3.5 w-3.5" />
                Real-World Necessity
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Why Advanced DDI Detection Matters
              </h2>
              <p className="mt-2.5 text-base text-muted-foreground leading-relaxed">
                Adverse drug interactions cause over 1.3 million emergency department visits annually. MedGuard AI closes critical diagnostic gaps.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impact.map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl glass-card p-6 border-border/70 hover:-translate-y-1 transition-transform"
                >
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 w-fit mb-4">
                    {card.icon}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono mb-2">
                    {card.metric}
                  </Badge>
                  <h3 className="text-base font-bold text-foreground mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            HOLOGRAPHIC FINAL CALL TO ACTION
           ======================================================== */}
        <section className="py-16">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-950 p-8 md:p-12 shadow-2xl text-white">
              {/* Background ambient lighting */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl"
              />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Zero Setup Required &bull; Free Clinical Preview
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    Start Safe Prescription Analysis with MedGuard AI
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Test complex multi-drug regimens, review high-risk bleeding and organ alerts, and chat with our clinical AI assistant.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Button asChild size="xl" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/30">
                    <Link to="/predictor">
                      <span>Open Predictor</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="xl"
                    className="border border-white/40 bg-white/15 text-white hover:bg-white/25 backdrop-blur-md font-semibold transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                  >
                    <Link to="/dashboard">Clinical Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
