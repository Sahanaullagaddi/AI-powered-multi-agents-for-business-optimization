import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  suggestions: string[];
  helperText?: string;
  invalid?: boolean;
  metaLabel?: string;
};

export default function DrugAutosuggestInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  suggestions,
  helperText,
  invalid,
  metaLabel,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 6);
    return suggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 6);
  }, [suggestions, value]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  const show = open && filtered.length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {metaLabel ? (
          <span className="text-xs text-muted-foreground">{metaLabel}</span>
        ) : null}
      </div>

      <Input
        id={id}
        value={value}
        className={cn(invalid && "border-destructive/60 focus-visible:ring-destructive/25")}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!show) return;
          if (e.key === "Escape") setOpen(false);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
          }
          if (e.key === "Enter") {
            const hit = filtered[activeIndex];
            if (hit) {
              e.preventDefault();
              onChange(hit);
              setOpen(false);
            }
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls={`${id}-listbox`}
      />

      {helperText && <p className={cn("mt-1 text-xs", invalid ? "text-destructive" : "text-muted-foreground")}>{helperText}</p>}

      {show && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-card"
        >
          {filtered.map((s, i) => (
            <button
              key={s}
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                "hover:bg-accent/10",
                i === activeIndex && "bg-accent/10",
              )}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
            >
              <span className="font-medium">{s}</span>
              <span className="text-xs text-muted-foreground">demo</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
