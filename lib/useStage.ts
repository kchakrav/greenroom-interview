"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StageConfig } from "./types";

const DEFAULT: StageConfig = {
  mode: "practice",
  disciplineId: "engineering",
  roleId: "swe",
  seniorityId: "senior",
  focusAreas: [],
  tone: "neutral",
  modalities: ["voice", "text"],
  durationMin: 30,
  language: "en",
};

interface StageState {
  config: StageConfig;
  set: (patch: Partial<StageConfig>) => void;
  reset: () => void;
}

export const useStage = create<StageState>()(
  persist(
    (set) => ({
      config: DEFAULT,
      set: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
      reset: () => set({ config: DEFAULT }),
    }),
    { name: "aiinterview-stage" }
  )
);
