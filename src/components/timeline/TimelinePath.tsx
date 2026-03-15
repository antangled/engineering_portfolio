import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TimelinePathProps {
  segmentCount: number;
  segmentHeight: number;
}

export function TimelinePath({ segmentCount, segmentHeight }: TimelinePathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  const totalHeight = segmentCount * segmentHeight;
  const centerX = 30;
  const amplitude = 18;

  let d = `M ${centerX} 0`;
  for (let i = 0; i < segmentCount; i++) {
    const yStart = i * segmentHeight;
    const yEnd = (i + 1) * segmentHeight;
    const direction = i % 2 === 0 ? 1 : -1;
    const cp1Y = yStart + segmentHeight * 0.35;
    const cp2Y = yStart + segmentHeight * 0.65;
    const xOffset = direction * amplitude;

    d += ` C ${centerX + xOffset * 0.3} ${cp1Y}, ${centerX + xOffset} ${cp2Y}, ${centerX} ${yEnd}`;
  }

  const nodePositions = Array.from({ length: segmentCount + 1 }, (_, i) => i * segmentHeight);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex justify-center"
      style={{ height: totalHeight }}
    >
      <svg
        width="60"
        height={totalHeight}
        viewBox={`0 0 60 ${totalHeight}`}
        fill="none"
        className="overflow-visible"
      >
        {/* Background path (faint) */}
        <path
          d={d}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Animated draw path */}
        <motion.path
          d={d}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        {/* Node dots at each project position */}
        {nodePositions.map((y, i) => (
          <motion.circle
            key={i}
            cx={centerX}
            cy={y}
            r="5"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}
