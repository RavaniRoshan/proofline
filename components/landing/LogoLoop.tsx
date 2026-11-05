"use client";

import { useEffect, useRef } from "react";

export function LogoLoop({ children, speed = 40 }: { children: React.ReactNode; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      x -= ((now - last) / 1000) * speed;
      last = now;
      const half = track.scrollWidth / 2;
      if (half > 0 && -x >= half) {
        x += half;
      }
      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <div className="logoloop overflow-hidden w-full select-none" aria-hidden="true">
      <div className="logoloop__track flex items-center will-change-transform" ref={trackRef}>
        <div className="flex items-center gap-8 sm:gap-12 shrink-0">{children}</div>
        <div className="flex items-center gap-8 sm:gap-12 shrink-0">{children}</div>
        <div className="flex items-center gap-8 sm:gap-12 shrink-0">{children}</div>
        <div className="flex items-center gap-8 sm:gap-12 shrink-0">{children}</div>
      </div>
    </div>
  );
}
