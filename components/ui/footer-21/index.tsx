"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { motion, type Variants } from "motion/react";
import Link from "next/link";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const riseItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.6, bounce: 0 },
  },
};

const giantTextVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.8, bounce: 0 },
  },
};

export interface Footer21Props {
  brandName?: string;
  socialLinks?: { label: string; href: string }[];
  leftLinks?: { label: string; href: string }[];
  rightLinks?: { label: string; href: string }[];
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  copyright?: string;
}

export default function Footer21({
  brandName = "Proofline",
  socialLinks = [
    { label: "GitHub", href: "https://github.com/RavaniRoshan/proofline" },
    { label: "Docs", href: "/docs" },
    { label: "Checker", href: "/check" },
    { label: "Audit", href: "/audit" },
  ],
  leftLinks = [
    { label: "Preflight Checker", href: "/check" },
    { label: "Fact Register", href: "/facts" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  rightLinks = [
    { label: "Architecture", href: "/docs/architecture" },
    { label: "Evidence Gate", href: "/docs/evidence-gate" },
    { label: "API Reference", href: "/docs/api-reference" },
  ],
  description = "Deterministic claim governance for high-stakes marketing, pricing, and product copy. Zero hallucination, 100% verifiable ground truth.",
  buttonText = "Check a Draft",
  buttonLink = "/check",
  copyright = "Proofline 2026 @ All rights reserved",
}: Footer21Props) {
  return (
    <motion.footer
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="relative w-full bg-paper text-ink font-sans overflow-hidden transition-colors duration-300 border-t border-ink/15 dark:border-white/12"
    >
      <div className="mx-auto max-w-[1440px] w-full flex">
        {/* Left Hash Band */}
        <div className="hidden md:block w-5 shrink-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(26,26,24,0.08)_6px,rgba(26,26,24,0.08)_7px)] dark:bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(255,255,255,0.09)_6px,rgba(255,255,255,0.09)_7px)]"></div>

        {/* Central Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Border */}
          <div className="w-full border-t border-ink/15 dark:border-white/12"></div>

          {/* Social Links */}
          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 border-b border-ink/15 dark:border-white/12">
            {socialLinks.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                variants={riseItem}
                className="flex items-center justify-center gap-2 py-8 border-b md:border-b-0 border-r border-ink/15 dark:border-white/12 last:border-r-0 max-md:nth-[2n]:border-r-0 max-md:nth-last-[-n+2]:border-b-0 text-[12px] md:text-[13px] tracking-widest uppercase text-ink-soft dark:text-zinc-400 hover:text-ink dark:hover:text-white transition-colors"
              >
                {link.label}
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
              </motion.a>
            ))}
          </motion.div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 py-16 md:py-24 border-b border-ink/15 dark:border-white/12 items-center px-4 md:px-8 lg:px-12">
            <motion.div variants={riseItem} className="md:col-span-3 flex justify-center md:justify-start">
              <div className="flex flex-col gap-6 text-center md:text-left">
                {leftLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-[12px] md:text-[13px] tracking-widest uppercase text-ink-soft dark:text-zinc-400 hover:text-ink dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={riseItem} className="md:col-span-6 flex flex-col items-center text-center gap-8">
              <p className="text-[17px] md:text-xl text-balance text-ink-soft dark:text-zinc-300 leading-relaxed max-w-md">
                {description}
              </p>
              <Link href={buttonLink} className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-white transition-colors text-[15px] font-medium tracking-wide shadow-sm">
                {buttonText}
              </Link>
            </motion.div>

            <motion.div variants={riseItem} className="md:col-span-3 flex justify-center md:justify-end">
              <div className="flex flex-col gap-6 text-center md:text-left">
                {rightLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-[12px] md:text-[13px] tracking-widest uppercase text-ink-soft dark:text-zinc-400 hover:text-ink dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-center pt-10 pb-8 gap-8 px-4 md:px-8 lg:px-12">
            <motion.div variants={giantTextVariant} className="w-full max-w-[800px] flex justify-center">
              <svg
                className="w-full h-auto select-none"
                viewBox={`0 0 ${Math.max(brandName.length * 80, 300)} 110`}
                preserveAspectRatio="xMinYMid meet"
                aria-label={brandName}
              >
                <defs>
                  <pattern id="proofline-box-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill="#8B1E27" />
                    <rect x="4" y="0" width="4" height="4" fill="#6E1F26" />
                    <rect x="8" y="0" width="4" height="4" fill="#A8261C" />
                    <rect x="12" y="0" width="4" height="4" fill="#571820" />
                    <rect x="0" y="4" width="4" height="4" fill="#6E1F26" />
                    <rect x="4" y="4" width="4" height="4" fill="#D4847A" />
                    <rect x="8" y="4" width="4" height="4" fill="#8B1E27" />
                    <rect x="12" y="4" width="4" height="4" fill="#A8261C" />
                    <rect x="0" y="8" width="4" height="4" fill="#571820" />
                    <rect x="4" y="8" width="4" height="4" fill="#8B1E27" />
                    <rect x="8" y="8" width="4" height="4" fill="#6E1F26" />
                    <rect x="12" y="8" width="4" height="4" fill="#D4847A" />
                    <rect x="0" y="12" width="4" height="4" fill="#A8261C" />
                    <rect x="4" y="12" width="4" height="4" fill="#571820" />
                    <rect x="8" y="12" width="4" height="4" fill="#8B1E27" />
                    <rect x="12" y="12" width="4" height="4" fill="#6E1F26" />
                  </pattern>
                </defs>
                <text
                  x="50%"
                  y="100"
                  dominantBaseline="alphabetic"
                  textAnchor="middle"
                  fill="url(#proofline-box-pattern)"
                  className="font-semibold tracking-tighter"
                  fontSize="125"
                >
                  {brandName}
                </text>
              </svg>
            </motion.div>

            <motion.div variants={riseItem} className="text-[12px] md:text-[13px] text-ink-faint dark:text-zinc-500 whitespace-nowrap">
              {copyright}
            </motion.div>
          </div>
        </div>

        {/* Right Hash Band */}
        <div className="hidden md:block w-5 shrink-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(26,26,24,0.08)_6px,rgba(26,26,24,0.08)_7px)] dark:bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(255,255,255,0.09)_6px,rgba(255,255,255,0.09)_7px)]"></div>
      </div>
    </motion.footer>
  );
}
