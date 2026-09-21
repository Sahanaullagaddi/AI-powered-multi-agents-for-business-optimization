import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Pill, Sparkles, Sun, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";

const nav = [
  { label: "Home", to: "/" },
  { label: "Predictor", to: "/predictor" },
  { label: "Healthy", to: "/healthy" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "AI Chatbot", to: "/chatbot" },
];

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const resolved = theme === "system" ? systemTheme : theme;
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card/50 text-foreground shadow-soft backdrop-blur-md transition-colors hover:bg-accent hover:text-accent-foreground focus-ring"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform group-hover:-rotate-12" />
      ) : (
        <Moon className="h-4 w-4 transition-transform group-hover:rotate-12" />
      )}
    </button>
  );
}

// Audible Voice Narrator for Accessibility & Guidance
function AudibleToggle() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Stop speech if route changes
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [location.pathname]);

  const toggleAudible = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast({
        title: "Audible Not Supported",
        description: "Your browser does not support text-to-speech audio.",
        variant: "destructive"
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast({
        title: "Audible Paused",
        description: "Voice narration stopped."
      });
      return;
    }

    // Determine content to speak based on active route
    let textToSpeak = "MedGuard AI. Clinical multi-drug interaction safety engine.";
    const path = location.pathname;

    if (path === "/" || path === "") {
      textToSpeak = "Welcome to MedGuard AI. Predict multi-drug risks with precision clinical artificial intelligence. Designed to detect polypharmacy hazards, organ toxicity, and provide explainable safety insights.";
    } else if (path.startsWith("/predictor")) {
      textToSpeak = "AI Multi-Drug Interaction Predictor. Enter two or more medications, upload a prescription image, or capture tablet packaging to simulate drug-drug interactions and organ toxicity.";
    } else if (path.startsWith("/healthy")) {
      textToSpeak = "Healthy and Wellness Center. Access tailored home remedies, yoga recommendations, and safe non-pharmacological protocols for minor health conditions.";
    } else if (path.startsWith("/dashboard")) {
      textToSpeak = "Clinical Dashboard. Review your active medication list, dosage reminders, risk alerts, and emergency clinical contacts.";
    } else if (path.startsWith("/how-it-works")) {
      textToSpeak = "How MedGuard AI Works. Review our neural network architecture, biological pathway analysis, and clinical verification standards.";
    } else if (path.startsWith("/chatbot")) {
      textToSpeak = "MedGuard AI Clinical Copilot. Ask medical questions, check medication compatibility, and receive personalized safety precautions.";
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    toast({
      title: "Audible Active",
      description: "Playing spoken overview for this page."
    });
  };

  return (
    <button
      type="button"
      onClick={toggleAudible}
      className={cn(
        "group inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-soft backdrop-blur-md transition-all focus-ring cursor-pointer",
        isSpeaking
          ? "bg-cyan-500 text-slate-950 border-cyan-400 ring-2 ring-cyan-400/40 animate-pulse"
          : "bg-card/50 text-foreground border-border hover:bg-accent hover:text-accent-foreground"
      )}
      aria-label={isSpeaking ? "Stop Audible Narration" : "Listen to Page (Audible)"}
      title={isSpeaking ? "Stop Audible Narration" : "Listen to Page (Audible Guidance)"}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4 animate-bounce" />
      ) : (
        <Volume2 className="h-4 w-4 transition-transform group-hover:scale-110 text-cyan-600 dark:text-cyan-400" />
      )}
    </button>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTryPredictor = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/predictor") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const input = document.getElementById("drug-0") as HTMLInputElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      navigate("/predictor");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  const navLinks = useMemo(
    () =>
      nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={cn(
            "group relative rounded-full px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground focus-ring",
            "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-accent/0 after:via-accent after:to-accent/0 after:transition-transform after:duration-300 hover:after:scale-x-100",
          )}
          activeClassName="text-foreground after:scale-x-100"
        >
          {item.label}
        </NavLink>
      )),
    [],
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-card/75 text-foreground backdrop-blur-xl transition-shadow",
        scrolled ? "shadow-soft" : "shadow-none",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-95 transition-all group shrink-0"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-soft transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90 dark:bg-slate-950/80 backdrop-blur-xs">
                <Pill className="h-4 w-4 text-cyan-500 transition-transform group-hover:rotate-45" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold leading-none bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                MedGuard{" "}
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 ml-0.5">
                  AI
                </span>
              </span>
              <span className="text-[9px] font-medium text-muted-foreground tracking-wider uppercase">
                Clinical Safety
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Audible Voice Narrator Button */}
          <AudibleToggle />

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* Try Predictor Button with reliable navigation handler */}
          <Button
            onClick={handleTryPredictor}
            variant="hero"
            size="sm"
            className="group hidden md:inline-flex shadow-soft cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse mr-1.5" />
            <span>Try Predictor</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="border-t md:hidden">
        <div className="container flex items-center justify-between gap-2 overflow-x-auto py-2">
          <div className="flex items-center gap-1">{navLinks}</div>
          <Button
            onClick={handleTryPredictor}
            variant="hero"
            size="sm"
            className="h-8 text-xs shrink-0 cursor-pointer bg-blue-600 text-white font-medium shadow-xs"
          >
            <Sparkles className="h-3 w-3 mr-1 text-cyan-300" />
            Predictor
          </Button>
        </div>
      </div>
    </header>
  );
}
