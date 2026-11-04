import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { contact } from "../data/profile";
import { cn } from "../lib/utils";

/**
 * Copies the email address to the clipboard. A mailto: link does nothing for people
 * who read mail in a browser without a default mail app, so this sits beside it.
 */
export function CopyEmail({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = contact.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="link"
      aria-label={copied ? "Email address copied" : `Copy email address ${contact.email}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
        tone === "dark"
          ? "border-mist/20 text-mist-dim hover:border-signal hover:text-signal"
          : "border-ink-900/15 text-ink-500 hover:border-signal hover:text-signal-ink",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
