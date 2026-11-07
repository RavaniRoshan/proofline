import {
  FileCheck2,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  History,
  Settings,
  HelpCircle,
  FileText,
  Layers,
  Scale,
  GitBranch,
} from "lucide-react";

export const stats = [
  {
    label: "Total Evaluated",
    value: "1,284",
    detail: "+18.4% this cycle",
    icon: FileCheck2,
    tone: "bg-[#8B1E27]/15 text-[#8B1E27] dark:text-[#D4847A]",
    compactChart: false,
  },
  {
    label: "Deterministic Ratio",
    value: "82%",
    detail: "0.4ms avg Stage 1 TS",
    icon: Zap,
    tone: "bg-[#D4847A]/20 text-[#D4847A]",
    compactChart: true,
  },
  {
    label: "Contradictions Blocked",
    value: "190",
    detail: "-14.8% error rate",
    icon: ShieldCheck,
    tone: "bg-[#8B1E27]/20 text-[#8B1E27]",
    compactChart: false,
  },
  {
    label: "Reviewer Consensus",
    value: "96.2%",
    detail: "182 of 189 approved",
    icon: Scale,
    tone: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    compactChart: false,
  },
];

export const apyData = [
  { month: "Jan", value: 68 },
  { month: "Feb", value: 74 },
  { month: "Mar", value: 71 },
  { month: "Apr", value: 79 },
  { month: "May", value: 82 },
  { month: "Jun", value: 85 },
];

export const portfolioDataRanges = {
  "1D": [
    { time: "00:00", value: 120000 },
    { time: "04:00", value: 135000 },
    { time: "08:00", value: 180000 },
    { time: "12:00", value: 240000 },
    { time: "16:00", value: 210000 },
    { time: "20:00", value: 260000 },
    { time: "24:00", value: 284000 },
  ],
  "7D": [
    { time: "Mon", value: 140000 },
    { time: "Tue", value: 165000 },
    { time: "Wed", value: 190000 },
    { time: "Thu", value: 220000 },
    { time: "Fri", value: 245000 },
    { time: "Sat", value: 260000 },
    { time: "Sun", value: 284000 },
  ],
  "1M": [
    { time: "Week 1", value: 110000 },
    { time: "Week 2", value: 170000 },
    { time: "Week 3", value: 230000 },
    { time: "Week 4", value: 284000 },
  ],
  All: [
    { time: "Jan", value: 85000 },
    { time: "Feb", value: 120000 },
    { time: "Mar", value: 175000 },
    { time: "Apr", value: 215000 },
    { time: "May", value: 250000 },
    { time: "Jun", value: 284000 },
  ],
};

export const markets = [
  {
    name: "Currency Exact Match",
    change: "+99.9% 0.38ms",
    color: "bg-[#8B1E27]",
  },
  {
    name: "Quota Bounds Check",
    change: "+100% 0.41ms",
    color: "bg-[#D4847A]",
  },
  {
    name: "SLA Uptime Validator",
    change: "+100% 0.35ms",
    color: "bg-emerald-600",
  },
  {
    name: "Evidence Gate Guard",
    change: "+98.4% 142ms",
    color: "bg-indigo-600",
  },
];

export const netWorthAssets = [
  {
    asset: "F-021 · Starter Monthly Price",
    balance: "84 evals",
    value: "₹6,499/mo (v4)",
    color: "bg-[#8B1E27]",
  },
  {
    asset: "F-031 · Starter Team Seats",
    balance: "48 evals",
    value: "10 included, max 50",
    color: "bg-[#D4847A]",
  },
  {
    asset: "F-001 · Enterprise SLA Uptime",
    balance: "32 evals",
    value: "99.9% uptime",
    color: "bg-emerald-600",
  },
  {
    asset: "F-014 · Cloud Storage Quota",
    balance: "16 evals",
    value: "250 GB standard",
    color: "bg-blue-600",
  },
];

export const borrowedAssets = [
  {
    asset: "₹4,999/mo (Draft Claim)",
    balance: "F-021 Superseded",
    value: "Blocker",
    color: "bg-[#8B1E27]",
  },
  {
    asset: "Unlimited Seats (Draft Claim)",
    balance: "F-031 Overstated",
    value: "Blocker",
    color: "bg-[#8B1E27]",
  },
  {
    asset: "99.99% Uptime (Draft Claim)",
    balance: "F-001 Stale Tier",
    value: "Warning",
    color: "bg-amber-600",
  },
  {
    asset: "500 GB Included (Draft Claim)",
    balance: "F-014 Exceeded",
    value: "Warning",
    color: "bg-amber-600",
  },
];

export const navSections = [
  {
    title: "OPERATIONS",
    items: [
      { label: "Dashboard Telemetry", icon: Activity, active: true },
      { label: "Preflight Checker", icon: FileCheck2, active: false },
      { label: "Fact Register (42)", icon: Database, active: false },
      { label: "Audit Journal", icon: History, active: false },
    ],
  },
  {
    title: "SPEC & RULES",
    items: [
      { label: "Stage 1 Deterministic", icon: Zap, active: false },
      { label: "Stage 4 Evidence Gate", icon: ShieldCheck, active: false },
      { label: "Architecture RFC", icon: Layers, active: false },
    ],
  },
];

export const utilityItems = [
  { label: "Documentation", icon: FileText },
  { label: "Settings", icon: Settings },
  { label: "Help & Feedback", icon: HelpCircle },
];
