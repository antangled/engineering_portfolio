import { motion, useScroll, useTransform } from "framer-motion";

const shapes = [
  { top: "8%", left: "5%", size: 28, rate: 0.08, rotation: 45, type: "circle" as const, opacity: 0.06 },
  { top: "15%", left: "92%", size: 20, rate: 0.14, rotation: 0, type: "square" as const, opacity: 0.05 },
  { top: "35%", left: "3%", size: 16, rate: 0.05, rotation: 30, type: "square" as const, opacity: 0.04 },
  { top: "55%", left: "95%", size: 24, rate: 0.18, rotation: -15, type: "circle" as const, opacity: 0.07 },
  { top: "70%", left: "8%", size: 36, rate: 0.12, rotation: 60, type: "circle" as const, opacity: 0.05 },
  { top: "25%", left: "88%", size: 14, rate: 0.06, rotation: -45, type: "square" as const, opacity: 0.04 },
  { top: "80%", left: "90%", size: 22, rate: 0.1, rotation: 20, type: "circle" as const, opacity: 0.06 },
  { top: "45%", left: "2%", size: 18, rate: 0.15, rotation: -30, type: "square" as const, opacity: 0.05 },
];

function Shape({
  shape,
}: {
  shape: (typeof shapes)[number];
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * shape.rate);
  const rotate = useTransform(scrollY, (v) => shape.rotation + v * 0.02);

  const borderRadius = shape.type === "circle" ? "9999px" : `${shape.size * 0.25}px`;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: shape.top,
        left: shape.left,
        width: shape.size,
        height: shape.size,
        borderRadius,
        border: "1px solid rgba(255,255,255,0.1)",
        background: `rgba(255,255,255,${shape.opacity})`,
        y,
        rotate,
      }}
    />
  );
}

export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape, i) => (
        <Shape key={i} shape={shape} />
      ))}
    </div>
  );
}
