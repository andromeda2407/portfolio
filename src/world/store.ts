import { create } from "zustand";
import type { SectionId } from "./sections";

export type Phase = "idle" | "walking" | "docking" | "viewing" | "exiting";

type WorldState = {
  phase: Phase;
  activeSection: SectionId | null;
  selectBeacon: (id: SectionId) => void;
  arrived: () => void;
  dockComplete: () => void;
  exitBay: () => void;
  returnComplete: () => void;
};

export const useWorldStore = create<WorldState>((set, get) => ({
  phase: "idle",
  activeSection: null,
  selectBeacon: (id) => {
    if (get().phase !== "idle") return;
    set({ phase: "walking", activeSection: id });
  },
  arrived: () => {
    if (get().phase !== "walking") return;
    set({ phase: "docking" });
  },
  dockComplete: () => {
    if (get().phase !== "docking") return;
    set({ phase: "viewing" });
  },
  exitBay: () => {
    if (get().phase !== "viewing") return;
    set({ phase: "exiting" });
  },
  returnComplete: () => {
    if (get().phase !== "exiting") return;
    set({ phase: "idle", activeSection: null });
  },
}));
