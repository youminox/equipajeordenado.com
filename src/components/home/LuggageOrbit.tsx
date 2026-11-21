"use client";

import Link from "next/link";
import { useState } from "react";

export type OrbitItem = {
  k: string;
  name: string;
  img: string | null;
  icon: string;
  role: string;
  d: string;
  href: string;
};

/** Órbita interactiva de los 8 esenciales del equipaje de cabina alrededor de la maleta central. */
export default function LuggageOrbit({
  items,
  centerImg,
}: {
  items: OrbitItem[];
  centerImg: string;
}) {
  const [active, setActive] = useState(0);
  const a = items[active];

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
      <div className="orbit mx-auto w-full max-w-[520px]">
        <div className="orbit-ring" />
        <div className="orbit-ring r2" />
        <div className="absolute inset-[24%] grid place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#e0f2fe] via-white to-[#fef3c7] shadow-[inset_0_10px_40px_rgba(3,66,142,0.15)] border-4 border-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={centerImg}
            alt="Maleta de mano con sus 8 elementos esenciales de cabina"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="orbit-spin">
          {items.map((it, i) => {
            const ang = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(ang) * 44;
            const y = 50 + Math.sin(ang) * 44;
            const on = i === active;
            return (
              <div
                key={it.k}
                className="orbit-item absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={`Ver ${it.name}`}
                    className={`group grid h-14 w-14 place-items-center overflow-hidden rounded-full border-[3px] bg-white shadow-lg transition-all duration-300 sm:h-[74px] sm:w-[74px] cursor-pointer ${
                      on
                        ? "scale-110 border-[#0767db] shadow-[0_12px_30px_-10px_rgba(7,103,219,0.85)]"
                        : "border-white hover:border-[#0767db]/60"
                    }`}
                  >
                    {it.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.img}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl" aria-hidden="true">
                        {it.icon}
                      </span>
                    )}
                  </button>
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold sm:block ${
                      on
                        ? "bg-[#0767db] text-white"
                        : "bg-white/95 text-[#0f172a] shadow"
                    }`}
                  >
                    {it.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <span className="eyebrow">Esencial a esencial</span>
        <h2 className="section-title mt-3 text-[#0f172a]">
          Los 8 pilares dentro de{" "}
          <span className="text-[#0767db]">tu equipaje de mano</span>
        </h2>
        <p className="mt-3 text-[#4b5563]">
          Toca cualquier elemento de la órbita para ver su regla oficial de
          aeropuerto y acceder directo a la guía paso a paso.
        </p>

        <div
          key={active}
          className="card card-static spot mt-7 p-7"
          style={{ animation: "fadeup .45s ease both" }}
        >
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f0f7ff] border border-[#d6e4f2]">
              <span className="text-3xl" aria-hidden="true">
                {a.icon}
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-tight text-[#0f172a]">
                {a.name}
              </p>
              <p className="text-sm font-bold text-[#0767db]">{a.role}</p>
            </div>
          </div>
          <p className="mt-4 text-base sm:text-lg text-[#4b5563] leading-relaxed">
            {a.d}
          </p>
          <Link
            href={a.href}
            className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#03428e] hover:text-[#0767db] hover:underline"
          >
            Leer guía completa: {a.name} →
          </Link>
        </div>

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Elementos esenciales del equipaje de mano"
        >
          {items.map((it, i) => (
            <button
              key={it.k}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                i === active
                  ? "border-[#0767db] bg-[#0767db] text-white"
                  : "border-[var(--line)] bg-white text-[#0f172a] hover:border-[#0767db]"
              }`}
            >
              {it.icon} {it.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
