"use client";

import { type ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';

export interface Footer15Link {
  label: string;
  href: string;
}

export interface Footer15Column {
  title: string;
  links: Footer15Link[];
}

export interface Footer15Props {
  /** Custom logo mark element */
  logoIcon?: ReactNode;
  brandName?: string;
  /** Short brand description / tagline */
  description?: string;
  /** CTA button label */
  ctaLabel?: string;
  ctaHref?: string;
  /** Navigation columns */
  columns?: Footer15Column[];
  /** Large brand text in the bottom hero section */
  heroBrandName?: string;
  /** Copyright year / text */
  copyrightYear?: string;
}

const defaultColumns: Footer15Column[] = [
  {
    title: 'Product',
    links: [
      { label: 'Preflight Checker', href: '/check' },
      { label: 'Fact Register (42 Facts)', href: '/facts' },
      { label: 'Audit Journal', href: '/audit' },
      { label: 'Operational Telemetry', href: '/dashboard' },
    ],
  },
  {
    title: 'Engine Specs',
    links: [
      { label: 'Deterministic TS Engine', href: '/docs/architecture' },
      { label: '6-Field Evidence Gate', href: '/docs/evidence-gate' },
      { label: 'Version Lineage Schema', href: '/docs/fact-register' },
      { label: 'REST API Specification', href: '/docs/api-reference' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'Documentation Hub', href: '/docs' },
      { label: 'TypeScript SDK', href: '/docs/typescript-sdk' },
      { label: 'Local-First Privacy', href: '/docs/security-compliance' },
      { label: 'Architecture & RFC', href: '/about' },
    ],
  },
  {
    title: 'Verification',
    links: [
      { label: '111 Vitest Unit Tests', href: 'https://github.com/RavaniRoshan/proofline' },
      { label: 'Zero Database Persistence', href: '/docs/security-compliance' },
      { label: 'SHA-256 Decision Signing', href: '/audit' },
      { label: 'Evaluation Benchmarks', href: '/dashboard' },
    ],
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const navStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.02,
    },
  },
};

const riseItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.6, bounce: 0 },
  },
};

const linkStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const linkItem: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.4, bounce: 0 },
  },
};

const heroBrandVariant: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 1.1, bounce: 0 },
  },
};

const ctaVariant: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.5, bounce: 0 },
  },
};

export function Footer15({
  logoIcon,
  brandName = 'Proofline',
  description = 'Deterministic claim governance for high-stakes marketing, pricing, and product copy.\nZero hallucination, 100% verifiable ground truth.',
  ctaLabel = 'Check a Draft',
  ctaHref = '/check',
  columns = defaultColumns,
  heroBrandName = 'PROOFLINE',
}: Footer15Props) {
  return (
    <footer className="w-full overflow-hidden rounded-t-3xl border-t border-ink/15 bg-[#F5F2EC] font-sans antialiased sm:rounded-t-[2.5rem] md:rounded-t-[3rem] dark:bg-[#0A0908] dark:border-white/12 transition-colors duration-200">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="px-6 pt-10 pb-0 sm:px-10 sm:pt-14 lg:px-14 lg:pt-16 xl:px-20"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 lg:flex-row lg:gap-16 xl:gap-20">
          <motion.div
            variants={riseItem}
            className="flex shrink-0 flex-col gap-5 lg:max-w-[280px] xl:max-w-[320px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="shrink-0">
                {logoIcon ?? (
                  <span className="font-mono text-2xl font-bold text-[#8B1E27] dark:text-[#E07A70] select-none">
                    [ ]
                  </span>
                )}
              </span>
              <span className="font-mono text-lg font-bold uppercase tracking-wider text-[#141211] dark:text-[#F3EFE6] select-none">
                {brandName}
              </span>
            </div>

            <p className="text-sm leading-[1.6] font-normal text-pretty whitespace-pre-line text-[#5C564E] dark:text-[#9A9489]">
              {description}
            </p>

            <motion.div variants={ctaVariant}>
              <Link
                href={ctaHref}
                className="group mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-[#8B1E27] py-1 pr-1.5 pl-5 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-200 hover:bg-[#8B1E27]/90 hover:shadow-[0_4px_16px_rgba(139,30,39,0.35)] active:scale-[0.98]"
              >
                <span className="font-mono text-xs font-semibold text-white tracking-wide">
                  {ctaLabel}
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-black/20 text-white">
                  <FaArrowRight className="size-3 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.nav
            variants={navStagger}
            aria-label="Footer navigation"
            className="grid w-full max-w-[620px] grid-cols-2 gap-y-8 sm:grid-cols-4"
          >
            {columns.map((col) => (
              <motion.div key={col.title} variants={riseItem}>
                <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-[#141211] dark:text-[#F3EFE6]">
                  {col.title}
                </h3>
                <motion.ul
                  variants={linkStagger}
                  className="mt-3.5 flex flex-col gap-2.5"
                >
                  {col.links.map((link) => (
                    <motion.li key={link.label} variants={linkItem}>
                      <Link
                        href={link.href}
                        className="inline-block text-xs font-medium text-[#5C564E] transition-colors duration-200 hover:text-[#141211] dark:text-[#9A9489] dark:hover:text-[#FAF7F2]"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.nav>
        </div>
      </motion.div>

      {/* Panoramic Bottom Brandmark */}
      <motion.div
        variants={heroBrandVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative flex items-end justify-center overflow-hidden px-4 pt-10 sm:px-6 sm:pt-14 md:pt-20"
      >
        <svg
          className="h-auto w-full translate-y-2 select-none md:translate-y-6"
          viewBox={`0 0 ${Math.max(heroBrandName.length * 90, 400)} 110`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={heroBrandName}
        >
          <text
            x="50%"
            y="100%"
            dominantBaseline="alphabetic"
            textAnchor="middle"
            textLength="96%"
            lengthAdjust="spacing"
            className="fill-[#141211] dark:fill-[#F3EFE6] font-mono font-bold tracking-tight select-none opacity-85 dark:opacity-90 transition-colors duration-200"
            fontSize="155"
          >
            {heroBrandName}
          </text>
        </svg>
      </motion.div>
    </footer>
  );
}

export default Footer15;
