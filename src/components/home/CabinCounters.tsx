"use client";

import { useEffect, useRef, useState } from "react";

export type CabinStatItem = {
  v: number;
  dec: number;
  u: string;
  l: string;
  pct: number;
  note: string;
};

/** Contadores que suben con curva cubic-out al entrar en pantalla + barras de progreso de estándares IATA/TSA. */
export default function CabinCounters({ data }: { data: CabinStatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setT(1));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / 1600);
          setT(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {data.map((d) => (
        <div key={d.l} className="glass spot spot-dark p-4 sm:p-5">
          <p className="text-3xl font-extrabold text-white sm:text-4xl">
            {(d.v * t).toFixed(d.dec)}
            <span className="ml-1 text-base font-bold text-amber-300">
              {d.u}
            </span>
          </p>
          <p className="mt-1 text-sm font-semibold text-white/90">{d.l}</p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-400"
              style={{
                width: `${Math.max(4, Math.min(100, d.pct)) * t}%`,
              }}
            />
          </div>
          <p className="mt-1.5 text-[0.7rem] text-sky-100/65">{d.note}</p>
        </div>
      ))}
    </div>
  );
}
