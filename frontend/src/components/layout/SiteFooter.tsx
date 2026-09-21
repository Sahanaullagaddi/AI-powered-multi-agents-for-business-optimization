import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-card/40 backdrop-blur-xl">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-base font-extrabold">MedGuard AI</p>
          <p className="mt-2 text-sm text-muted-foreground">
            AI-driven decision support for multi-drug interaction (DDI) risk in multimorbidity and polypharmacy.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Disclaimer: This demo provides informational decision-support only and is not medical advice. Always consult a licensed clinician.
          </p>
        </div>

        <div className="grid gap-2 text-sm">
          <p className="text-sm font-semibold">Quick links</p>
          <Link className="text-muted-foreground hover:text-foreground" to="/predictor">
            Predictor
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/how-it-works">
            How It Works
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/about">
            About
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Support</p>
          <p className="text-sm text-muted-foreground">Use the AI assistant for interpretation and next-step guidance.</p>
          <Button asChild variant="soft" className="w-fit">
            <Link to="/chatbot">
              <MessageCircle className="h-4 w-4" />
              Open AI Chatbot
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-6 text-xs text-muted-foreground">© {new Date().getFullYear()} MedGuard AI</div>
      </div>
    </footer>
  );
}
