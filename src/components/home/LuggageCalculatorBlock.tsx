"use client";

import Link from "next/link";
import { useState } from "react";
import { openEquipajeChat } from "@/lib/chat-constants";

export type LuggageModeOption = {
  key: string;
  label: string;
  dimensions: string;
  maxWeightKg: number;
  liters: number;
  feeSavedUsd: number;
  img: string;
  alt: string;
  desc: string;
  idealFor: string;
  href: string;
};

/**
 * Calculadora interactiva de equipaje y ahorro (inspirada en PriceBlock.tsx de prunex1.com):
 * Alterna entre Artículo Personal, Maleta Carry-On 10 kg y Viaje Largo, y calcula mudas recomendadas,
 * peso estimado y ahorro en cargos de facturación según los días de viaje.
 */
export default function LuggageCalculatorBlock({
  options,
}: {
  options: LuggageModeOption[];
}) {
  const [k, setK] = useState(options[0].key);
  const [days, setDays] = useState(5);
  const opt = options.find((o) => o.key === k) || options[0];

  const topsCount = Math.min(days, opt.key === "personal" ? 4 : 8);
  const bottomsCount = Math.max(1, Math.min(4, Math.ceil(days / 3)));
  const estWeightKg = Math.min(
    opt.maxWeightKg,
    Number((2.1 + topsCount * 0.45 + bottomsCount * 0.65).toFixed(1))
  );
  const roundtripSavingsUsd = opt.feeSavedUsd * 2;

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="card card-static spot relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0767db]/10 blur-3xl" />
        <div className="relative">
          <div
            className="inline-flex flex-wrap rounded-2xl bg-[#f0f7ff] p-1 gap-1"
            role="tablist"
            aria-label="Modalidad de equipaje"
          >
            {options.map((o) => (
              <button
                key={o.key}
                role="tab"
                type="button"
                aria-selected={o.key === k}
                onClick={() => setK(o.key)}
                className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                  o.key === k
                    ? "bg-white text-[#03428e] shadow"
                    : "text-[#4b5563] hover:text-[#0f172a]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_1.15fr]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[240px] overflow-hidden rounded-2xl border border-[#d6e4f2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={opt.img}
                src={opt.img}
                alt={opt.alt}
                className="h-full w-full object-cover"
                style={{ animation: "fadeup .45s ease both" }}
              />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0767db]">
                Medida estándar: {opt.dimensions}
              </p>
              <p
                className="mt-1 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0f172a]"
                aria-live="polite"
              >
                {opt.liters} L{" "}
                <span className="text-xl font-bold text-[#0767db]">
                  · {opt.maxWeightKg} kg
                </span>
              </p>
              <p className="mt-2 text-sm text-[#4b5563] leading-relaxed">
                {opt.desc}
              </p>
              <p className="mt-2 text-xs font-semibold text-[#03428e]">
                ✓ Ideal para: {opt.idealFor}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={opt.href}
              className="btn btn-buy shine flex-1 text-sm"
              data-magnetic
            >
              Ver guía de {opt.label.toLowerCase()} →
            </Link>
            <button
              type="button"
              onClick={() =>
                openEquipajeChat(
                  `¿Cómo empaco una ${opt.label} (${opt.dimensions}) para un viaje de ${days} días sin pagar equipaje extra?`
                )
              }
              className="btn btn-ghost text-sm cursor-pointer"
            >
              Armar lista con IA 💬
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#03428e] via-[#071326] to-[#022c61] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-300">
          Planificador inteligente de empaque
        </p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          ¿Cuántos días dura tu próximo viaje?
        </h3>
        <p className="mt-2 text-sm text-sky-100/75">
          Desliza la duración de tu viaje para calcular cuántas prendas
          enrolladas llevar en cubos, el peso estimado y cuánto ahorras evitando
          facturar en aeropuerto.
        </p>

        <label
          htmlFor="eo-days"
          className="mt-6 flex items-center justify-between text-sm font-bold"
        >
          <span>Duración del viaje</span>
          <span className="rounded-full bg-white/15 px-3.5 py-1 text-lg font-extrabold text-amber-300">
            {days} {days === 1 ? "día" : "días"}
          </span>
        </label>
        <input
          id="eo-days"
          type="range"
          min={1}
          max={14}
          step={1}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-3 w-full accent-[#f59e0b]"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-sky-100/50">
          {[1, 3, 5, 7, 10, 12, 14].map((n) => (
            <span key={n}>{n}d</span>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Mudas / cápsula", `${topsCount} + ${bottomsCount}`],
            ["Peso estimado", `${estWeightKg} kg`],
            ["Ahorro ida/vuelta", `~$${roundtripSavingsUsd}`],
          ].map(([l, val], i) => (
            <div
              key={l}
              className={`glass flex flex-col-reverse p-3 ${
                i === 2 ? "border-amber-300/50 bg-amber-400/15" : ""
              }`}
            >
              <dt className="mt-1 text-[0.7rem] leading-tight text-sky-100/70">
                {l}
              </dt>
              <dd
                className={`font-extrabold ${
                  i === 2
                    ? "text-xl text-amber-300 sm:text-2xl"
                    : "text-xl sm:text-2xl text-white"
                }`}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs text-sky-100/65">
          Fórmula cápsula para {days} días en{" "}
          <strong className="text-white">{opt.label}</strong>: {topsCount} polos
          o blusas enrolladas + {bottomsCount} pantalones/faldas + 1 casaca
          puesta en el avión + bolsa de líquidos de 100 ml.
        </p>
      </div>
    </div>
  );
}
