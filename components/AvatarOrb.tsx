"use client";
import { motion } from "framer-motion";

// Reactive AI presence. `level` (0..1) drives the glow/scale (mic or TTS amplitude).
// `state` controls the breathing idle vs active speaking behavior.
export default function AvatarOrb({
  level = 0,
  state = "idle",
  size = 220,
}: {
  level?: number;
  state?: "idle" | "speaking" | "listening" | "thinking";
  size?: number;
}) {
  const scale = 1 + Math.min(level, 1) * 0.18 + (state === "speaking" ? 0.04 : 0);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {/* outer halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
          filter: "blur(28px)",
        }}
        animate={{ opacity: state === "thinking" ? [0.3, 0.6, 0.3] : 0.55 + level * 0.4 }}
        transition={{ duration: 1.6, repeat: state === "thinking" ? Infinity : 0 }}
      />
      {/* amplitude ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: size * 0.82, height: size * 0.82, borderColor: "var(--accent2)" }}
        animate={{ scale, opacity: 0.4 + level * 0.5 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      />
      {/* core */}
      <motion.div
        className={state === "idle" ? "rounded-full animate-breathe" : "rounded-full"}
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background:
            "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 80%, white), var(--accent2))",
          boxShadow: "0 0 60px color-mix(in srgb, var(--accent) 60%, transparent)",
        }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      />
    </div>
  );
}
