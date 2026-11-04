"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copies a prompt to the clipboard. Falls back to a hidden textarea where
 * the Clipboard API is missing or refused (an insecure origin, an old
 * browser), and says what happened in a live region.
 */
export function CopyPrompt({ text, label = "Copy prompt", className }: { text: string; label?: string; className?: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      area.remove();
    }
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button type="button" className={className ? `copy-prompt ${className}` : "copy-prompt"} onClick={copy} data-state={state}>
      {state === "copied" ? <Check aria-hidden size={14} strokeWidth={2} /> : <Copy aria-hidden size={14} strokeWidth={2} />}
      <span>{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}</span>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Prompt copied to the clipboard" : state === "failed" ? "Could not copy; select the prompt text instead" : ""}
      </span>
    </button>
  );
}
