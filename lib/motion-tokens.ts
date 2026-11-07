/**
 * Proofline Master Motion Tokens & Physics Profiles
 *
 * System Architecture:
 * - Philosophy: Mechanical Precision & Editorial Restraint
 * - Weights: Emil Kowalski (60% - speed, tactile micro-feedback),
 *            Jakub Krehel (35% - production polish, blur-rise, bounce: 0),
 *            Satori Graphics & Jhey Tompkins (5% - Temporal Flow, Moving Logo Systems)
 *
 * Standards:
 * - High-frequency interactions: 0ms - 120ms
 * - State transitions: 180ms - 240ms
 * - Complex layout / dialogs: 320ms
 * - Hero stage entrance: 420ms
 * - Springs: Strictly critically damped (bounce: 0)
 */

export const MOTION_DURATIONS = {
  instant: 0,
  press: 80,
  micro: 120,
  fast: 180,
  standard: 240,
  deliberate: 320,
  hero: 420,
} as const;

export type MotionDurationKey = keyof typeof MOTION_DURATIONS;

export const MOTION_DURATIONS_CSS = {
  instant: "0ms",
  press: "80ms",
  micro: "120ms",
  fast: "180ms",
  standard: "240ms",
  deliberate: "320ms",
  hero: "420ms",
} as const;

export const MOTION_EASINGS = {
  arrival: "cubic-bezier(0.16, 1, 0.3, 1)",
  departure: "cubic-bezier(0.4, 0, 1, 1)",
  mechanical: "cubic-bezier(0.2, 0, 0, 1)",
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
} as const;

export type MotionEasingKey = keyof typeof MOTION_EASINGS;

export const MOTION_BEZIERS = {
  arrival: [0.16, 1, 0.3, 1] as const,
  departure: [0.4, 0, 1, 1] as const,
  mechanical: [0.2, 0, 0, 1] as const,
  drawer: [0.32, 0.72, 0, 1] as const,
} as const;

/**
 * Spring configurations for Framer Motion / Motion.
 * Strictly critically damped or slightly under-damped with bounce: 0.
 */
export const SPRINGS = {
  /**
   * Standard / Layout Spring: Dialogs, drawers, layout shifts, finding cards.
   * stiffness: 380, damping: 30, mass: 1, bounce: 0.
   * Settles in ~320ms with zero ringing.
   */
  standard: {
    type: "spring" as const,
    stiffness: 380,
    damping: 30,
    mass: 1,
    bounce: 0,
  },
  /** Precision spring alias for standard layout physics */
  precision: {
    type: "spring" as const,
    stiffness: 380,
    damping: 30,
    mass: 1,
    bounce: 0,
  },
  /**
   * Micro / Tactile Spring: Buttons, tab pills, badges, switches.
   * stiffness: 500, damping: 32, mass: 0.8, bounce: 0.
   * Instantaneous tactile response settling in ~180-220ms.
   */
  micro: {
    type: "spring" as const,
    stiffness: 500,
    damping: 32,
    mass: 0.8,
    bounce: 0,
  },
} as const;

/**
 * Spring configurations for Anime.js v4.
 * Usage: import { spring } from "animejs"; spring(ANIME_SPRINGS.precision)
 */
export const ANIME_SPRINGS = {
  standard: {
    mass: 1,
    stiffness: 380,
    damping: 30,
  },
  precision: {
    mass: 1,
    stiffness: 380,
    damping: 30,
  },
  micro: {
    mass: 0.8,
    stiffness: 500,
    damping: 32,
  },
} as const;

/**
 * Combined token registry matching authoritative PROJECT.md contracts
 */
export const MOTION_TOKENS = {
  durations: {
    instant: "0ms",
    micro: "120ms",
    fast: "180ms",
    standard: "240ms",
    deliberate: "320ms",
    hero: "420ms",
  },
  durationMs: {
    instant: 0,
    micro: 120,
    fast: 180,
    standard: 240,
    deliberate: 320,
    hero: 420,
  },
  easings: MOTION_EASINGS,
  bezierControlPoints: MOTION_BEZIERS,
  springs: {
    standard: SPRINGS.standard,
    precision: SPRINGS.precision,
    micro: SPRINGS.micro,
  },
} as const;
