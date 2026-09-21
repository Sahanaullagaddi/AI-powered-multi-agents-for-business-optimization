import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquareText, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function FloatingChatLauncher() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Close on route change to avoid covering page navigation.
    setOpen(false);
  }, [location.pathname]);

  const tips = useMemo(
    () => [
      "“What are the risks of warfarin + amiodarone?”",
      "“Explain high toxicity score.”",
      "“Which organ is most affected?”",
    ],
    [],
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Quick Chat</p>
            <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Open the AI Chatbot page for the full assistant.</p>
            <div className="mt-3 space-y-2">
              {tips.map((t) => (
                <div key={t} className="rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground">
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button asChild variant="hero" size="sm" className="flex-1">
                <Link to="/chatbot">Open Chatbot</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="hero"
        className={cn("h-12 w-12 rounded-full p-0 shadow-glow", open && "bg-accent text-accent-foreground hover:bg-accent/90")}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close quick chat" : "Open quick chat"}
      >
        <MessageSquareText className="h-5 w-5" />
      </Button>
    </div>
  );
}
