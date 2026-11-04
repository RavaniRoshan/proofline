import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { NavLinks } from "@/components/NavLinks";
import { ResetDemo } from "@/components/ResetDemo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Proofline — check marketing claims against approved facts",
    template: "%s · Proofline",
  },
  description:
    "Paste a draft; get every claim checked against the owner-approved, versioned fact register — with the source document, span, version and validity dates behind each finding.",
};

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="23" height="23" rx="6" fill="#0f5e57" />
      <path
        d="M7 13.2l4.2 4.2L19.5 9"
        stroke="#faf9f7"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-5">
            <Link href="/" className="flex items-center gap-2" aria-label="Proofline — home">
              <LogoMark />
              <span className="text-[17px] font-bold tracking-tight">Proofline</span>
            </Link>
            <div className="hidden sm:block">
              <NavLinks />
            </div>
            <div className="ml-auto">
              <ResetDemo />
            </div>
          </div>
          <div className="border-t border-line sm:hidden">
            <div className="mx-auto max-w-6xl overflow-x-auto px-2 py-1.5">
              <NavLinks />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 text-[11px] text-muted">
            <span>Proofline · Round 2 build</span>
            <span aria-hidden="true">·</span>
            <span>All facts are fictional demo data</span>
            <span aria-hidden="true">·</span>
            <span>Nothing you type is stored on a server</span>
            <span className="ml-auto">
              <Link href="/about" className="font-medium text-accent hover:underline underline-offset-2">
                What this is
              </Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
