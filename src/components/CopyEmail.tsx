import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { contact } from "../data/profile";
import { cn } from "../lib/utils";

/**
 * Copies the email address to the clipboard. A mailto: link does nothing for people
 * who read mail in a browser without a default mail app, so this sits beside it.
 */
export function CopyEmail({
  className,
  tone = "dark",
  iconOnly = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  /** Bare icon button, for sitting inside another pill. */
  iconOnly?: boolean;
}) {
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
  const icon = copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />;
  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={copy}
        data-cursor="link"
        title={copied ? "Copied" : "Copy email"}
        aria-label={copied ? "Email address copied" : `Copy email address ${contact.email}`}
        className={cn(
          "flex h-full items-center px-3 transition-colors",
          copied ? "text-emerald-400" : "text-mist-dim hover:text-signal",
          className
        )}
      >
        {icon}
      </button>
    );
  }
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
      {icon}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
