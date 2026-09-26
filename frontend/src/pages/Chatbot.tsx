import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileUp, Mic, Send, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type Role = "user" | "ai";

type Msg = {
  id: string;
  role: Role;
  content: string;
  ts: number;
  risk?: "Low" | "Moderate" | "High" | "Critical";
};

function uuid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function aiReply(text: string): Msg {
  const lower = text.toLowerCase();

  const risk = lower.includes("warfarin") && lower.includes("amiodarone") ? "High" :
    lower.includes("ibuprofen") && (lower.includes("kidney") || lower.includes("ckd")) ? "High" :
      lower.includes("tox") || lower.includes("toxicity") ? "Moderate" :
        lower.includes("organ") ? "Moderate" :
          "Low";

  const base =
    risk === "High"
      ? "This looks potentially high-risk (demo). Consider monitoring closely and consulting a clinician before changes."
      : risk === "Moderate"
        ? "This may carry moderate interaction risk (demo). Review dosing and patient factors; consult a clinician."
        : "No major red flags detected in this demo response. Still confirm with a clinician.";

  const details =
    lower.includes("confidence")
      ? "Confidence here is a UI indicator; connect your real model to compute it."
      : lower.includes("explain")
        ? "Explainability (demo): metabolism overlap + additive toxicity + patient renal/hepatic function can increase risk."
        : lower.includes("organ")
          ? "Organ impact (demo): kidney/liver/cardiac risk can increase with polypharmacy and impaired function."
          : "";

  return {
    id: uuid(),
    role: "ai",
    content: `${base}${details ? "\n\n" + details : ""}`,
    ts: Date.now(),
    risk,
  };
}

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: uuid(),
      role: "ai",
      content:
        "I’m your AI Drug Safety Assistant (demo). Ask about interactions, side effects (general), or how to interpret a predictor result.\n\nDisclaimer: decision-support only—consult a licensed healthcare professional.",
      ts: Date.now(),
      risk: "Low",
    },
  ]);

  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const quick = useMemo(
    () => [
      "What are the risks of Warfarin and Amiodarone?",
      "Explain high toxicity score.",
      "Which organ is most affected?",
      "How to reduce interaction risk?",
    ],
    [],
  );

  async function send(text: string) {
    const t = text.trim();
    if (!t) return;

    const user: Msg = { id: uuid(), role: "user", content: t, ts: Date.now() };
    setMessages((prev) => [...prev, user]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 0);

    try {
      // Send the entire chat history up to now, plus the user's new message
      const historyToSend = messages.map(m => ({ role: m.role, content: m.content })).concat([{ role: "user", content: t }]);

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyToSend })
      });

      const data = await res.json();

      const reply: Msg = {
        id: uuid(),
        role: "ai",
        content: data.reply || "Sorry, no response.",
        ts: Date.now()
      };

      setMessages((prev) => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 0);

    } catch (err) {
      console.error("Chat API error", err);
      const errorReply: Msg = {
        id: uuid(),
        role: "ai",
        content: "Error: I couldn't reach the AI backend.",
        ts: Date.now()
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  }

  return (
    <AppLayout>
      <main className="container py-10">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">AI Drug Safety Assistant</h1>
          <p className="mt-2 text-muted-foreground">Ask questions about interactions, risks, and safety guidance instantly.</p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-5">
          <Card className="shadow-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Chat</CardTitle>
              <CardDescription>Clean chat UI with risk badges + attachments preview (demo)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div ref={scrollRef} className="h-[420px] overflow-y-auto rounded-2xl border bg-background p-4">
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl border px-3 py-2 text-sm shadow-soft",
                          m.role === "user" ? "bg-muted" : "bg-accent/10",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">
                            {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {m.role === "ai" && m.risk && (
                            <Badge
                              variant={m.risk === "Critical" ? "destructive" : m.risk === "High" ? "secondary" : "outline"}
                              className={m.risk === "High" ? "bg-accent/18 text-foreground border-transparent" : undefined}
                            >
                              {m.risk}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 whitespace-pre-wrap text-foreground">{m.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {quick.map((q) => (
                  <Button key={q} variant="soft" size="sm" onClick={() => send(q)}>
                    {q}
                  </Button>
                ))}
              </div>

              <div className="rounded-2xl border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-muted-foreground">Attachments (demo)</p>
                  {!!attachments.length && (
                    <Button variant="outline" size="sm" onClick={() => setAttachments([])}>
                      <X className="h-4 w-4" /> Clear
                    </Button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachments.length ? (
                    attachments.map((f) => (
                      <Badge key={f.name + f.size} variant="outline">
                        {f.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Attach a pill image or a prescription PDF to discuss.</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a drug or interaction…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send(input);
                  }}
                />
                <Button variant="hero" size="icon" onClick={() => send(input)} aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>

                <label className="inline-flex">
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => {
                      const list = Array.from(e.target.files ?? []);
                      setAttachments(list.slice(0, 5));
                    }}
                  />
                  <Button variant="outline" size="icon" asChild>
                    <span aria-label="Upload" role="button" tabIndex={0}>
                      <FileUp className="h-4 w-4" />
                      <span className="sr-only">Upload</span>
                    </span>
                  </Button>
                </label>

                <Button variant="outline" size="icon" onClick={() => window.alert("Demo: microphone")}>
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Mic</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => setMessages((m) => m.slice(0, 1))}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                This AI assistant provides decision-support information. Always consult a licensed healthcare professional for
                medical decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Capabilities (demo)</CardTitle>
              <CardDescription>What the assistant can do in this UI version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" /> Explain drug uses and general side effects.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" /> Discuss basic interaction risk patterns.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" /> Interpret Predictor outputs.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" /> Provide patient-friendly vs clinician-friendly explanations.
                </li>
              </ul>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">Next iteration</p>
                <p className="mt-1 text-sm">
                  Connect to a real AI model + database and let “Explain this prediction” pull data from Predictor/Dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppLayout>
  );
}
