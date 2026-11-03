"use client";

import { useState } from "react";
import Link from "next/link";
import { AIRLINE_RULES, type AirlineRule } from "@/lib/data";

export default function AirlineChecker() {
  const [selected, setSelected] = useState<AirlineRule>(AIRLINE_RULES[0]);

  return (
    <section className="py-14 bg-light-bg border-y border-gray-200/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Herramienta Interactiva Gratuita
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Verificador Rápido de{" "}
            <span className="text-primary">Medidas por Aerolínea</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Selecciona tu aerolínea para consultar al instante las dimensiones
            exactas de maleta de cabina, peso permitido y bolso personal bajo el
            asiento.
          </p>
        </div>

        {/* Airline Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {AIRLINE_RULES.map((airline) => {
            const active = selected.id === airline.id;
            return (
              <button
                key={airline.id}
                type="button"
                onClick={() => setSelected(airline)}
                className={`rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-primary/40 hover:text-primary"
                }`}
              >
                ✈️ {airline.name}
              </button>
            );
          })}
        </div>

        {/* Result Card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-light-bg p-5 border border-primary/15">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                🧳 Maleta de Mano (Cabina)
              </span>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">
                {selected.cabinSize}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Compartimento superior (incluye ruedas y asas)
              </p>
            </div>

            <div className="rounded-xl bg-light-bg p-5 border border-primary/15">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                ⚖️ Peso Máximo Permitido
              </span>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">
                {selected.cabinWeight}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                En cabina estándar / turista
              </p>
            </div>

            <div className="rounded-xl bg-light-bg p-5 border border-primary/15">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                🎒 Artículo Personal (Bajo asiento)
              </span>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">
                {selected.personalItem}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Mochila pequeña, bolso o maletín de laptop
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">Nota para {selected.name}:</strong>{" "}
              {selected.notes}
            </p>
            <Link
              href={selected.guideUrl}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-primary-dark"
            >
              Ver todas las reglas de aerolíneas
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
