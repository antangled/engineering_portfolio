import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "../../data/profile";
import { cn } from "../../lib/utils";

/**
 * Vertical text-link list (Julien pattern). Labels, not bare icons, so a
 * recruiter scanning fast knows exactly where each link goes.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {socialLinks.map((link) => (
        <li key={link.kind}>
          <a
            href={link.href}
            target={link.kind === "email" ? undefined : "_blank"}
            rel="noreferrer"
            data-cursor="link"
            className="group flex items-center justify-between border-b border-ink-900/10 py-3 text-ink-700 transition-colors duration-300 hover:text-ink-900"
          >
            <span className="relative text-[0.95rem]">
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all duration-300 ease-expo group-hover:w-full" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-ink-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
          </a>
        </li>
      ))}
    </ul>
  );
}
