import { cn } from "@/lib/utils";

export function Band({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative bg-paper text-ink scroll-mt-20", className)}>
      <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />
        {children}
      </div>
    </section>
  );
}
