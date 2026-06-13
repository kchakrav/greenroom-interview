"use client";
import { motion } from "framer-motion";

// Animated competency radar (1..5 scale).
export default function SkillRadar({ data }: { data: { competency: string; score: number }[] }) {
  const size = 320;
  const c = size / 2;
  const r = size / 2 - 60;
  const n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, val: number) => {
    const rad = (val / 5) * r;
    return [c + rad * Math.cos(angle(i)), c + rad * Math.sin(angle(i))];
  };
  const poly = data.map((d, i) => point(i, d.score).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-80 w-80">
      {[1, 2, 3, 4, 5].map((ring) => (
        <polygon
          key={ring}
          points={data.map((_, i) => point(i, ring).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = point(i, 5);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
      })}
      <motion.polygon
        points={poly}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center" }}
        fill="color-mix(in srgb, var(--accent) 30%, transparent)"
        stroke="var(--accent)"
        strokeWidth={2}
      />
      {data.map((d, i) => {
        const [x, y] = point(i, 5.55);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-[#A6AFC2]" style={{ fontSize: 9 }}>
            {d.competency.length > 16 ? d.competency.slice(0, 15) + "…" : d.competency}
          </text>
        );
      })}
    </svg>
  );
}
