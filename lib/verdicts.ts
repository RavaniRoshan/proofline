import type { Verdict } from "@/lib/types";
import {
  CheckCircle2,
  XOctagon,
  Clock,
  HelpCircle,
  GitCompareArrows,
  MinusCircle,
  type LucideIcon,
} from "lucide-react";

export interface VerdictConfig {
  label: string;
  icon: LucideIcon;
  badgeClasses: string;
  fgColor: string;
  bgColor: string;
}

export const VERDICT_MAP: Record<Verdict, VerdictConfig> = {
  SUPPORTED: {
    label: "Supported",
    icon: CheckCircle2,
    badgeClasses: "bg-v-supported-bg text-v-supported-fg border-v-supported-fg/30",
    fgColor: "var(--v-supported-fg)",
    bgColor: "var(--v-supported-bg)",
  },
  CONTRADICTED: {
    label: "Contradicted",
    icon: XOctagon,
    badgeClasses: "bg-v-contradicted-bg text-v-contradicted-fg border-v-contradicted-fg/30",
    fgColor: "var(--v-contradicted-fg)",
    bgColor: "var(--v-contradicted-bg)",
  },
  STALE: {
    label: "Stale",
    icon: Clock,
    badgeClasses: "bg-v-stale-bg text-v-stale-fg border-v-stale-fg/30",
    fgColor: "var(--v-stale-fg)",
    bgColor: "var(--v-stale-bg)",
  },
  UNVERIFIED: {
    label: "Unverified",
    icon: HelpCircle,
    badgeClasses: "bg-v-unverified-bg text-v-unverified-fg border-v-unverified-fg/30",
    fgColor: "var(--v-unverified-fg)",
    bgColor: "var(--v-unverified-bg)",
  },
  CONFLICTING: {
    label: "Conflicting",
    icon: GitCompareArrows,
    badgeClasses: "bg-v-conflicting-bg text-v-conflicting-fg border-v-conflicting-fg/30",
    fgColor: "var(--v-conflicting-fg)",
    bgColor: "var(--v-conflicting-bg)",
  },
  NOT_CHECKABLE: {
    label: "Not checkable",
    icon: MinusCircle,
    badgeClasses: "bg-v-notcheckable-bg text-v-notcheckable-fg border-v-notcheckable-fg/30",
    fgColor: "var(--v-notcheckable-fg)",
    bgColor: "var(--v-notcheckable-bg)",
  },
};
