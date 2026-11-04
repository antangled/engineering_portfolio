import { useEffect } from "react";

const SITE = "Adam Tang";

/** Sets the browser-tab title for the current page, so several open tabs stay distinguishable. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Mechatronics & Embedded Systems Engineer`;
  }, [title]);
}
