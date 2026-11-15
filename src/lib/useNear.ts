import { useEffect, useRef, useState } from "react";

/** True once the element comes within `margin` of the viewport (never flips back). For lazy chunks. */
export function useNear<T extends Element>(margin = "800px 0px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);
  return [ref, near] as const;
}
