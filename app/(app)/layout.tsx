import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import { ResetDemo } from "@/components/ResetDemo";
import { CommandPalette } from "@/components/CommandPalette";

function LogoMark() {
  return (
    <span aria-hidden="true" className="flex items-center gap-[3px] font-serif text-[19px] font-semibold leading-none text-accent">
      <span>[</span><span>]</span>
    </span>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-5">
          <Link href="/" className="flex items-center gap-2" aria-label="Proofline — home">
            <LogoMark />
            <span className="font-serif text-[17px] font-semibold tracking-tight">Proofline</span>
          </Link>
          <div className="hidden sm:block">
            <NavLinks />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CommandPalette />
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
    </>
  );
}
