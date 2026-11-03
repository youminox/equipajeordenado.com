"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  {
    label: "Equipaje de Mano",
    href: "#",
    children: [
      { label: "Marcas de Maletas", href: "/marcas/" },
      { label: "Tipos de Equipaje", href: "/tipos/" },
      { label: "Equipaje Económico", href: "/barato/" },
      { label: "Reseñas de Maletas", href: "/resenas/" },
      { label: "Guías de Equipaje", href: "/guias/" },
    ],
  },
  {
    label: "Aerolíneas y Normas",
    href: "#",
    children: [
      { label: "Medidas por Aerolínea", href: "/reglas-de-equipaje/" },
      { label: "Qué Llevar en Cabina", href: "/que-se-puede-llevar-en-el-equipaje-de-mano/" },
      { label: "Regulaciones de Vuelo", href: "/regulaciones/" },
      { label: "Aerolíneas", href: "/aerolineas/" },
      { label: "Seguridad en Viajes", href: "/seguridad/" },
    ],
  },
  {
    label: "Destinos y Hoteles",
    href: "#",
    children: [
      { label: "Escapadas a la Naturaleza", href: "/escapadas-a-la-naturaleza/" },
      { label: "Destinos de Playa", href: "/destinos/" },
      { label: "Viajes en Ciudades", href: "/viaje-en-ciudades/" },
      { label: "Hoteles en Europa", href: "/hoteles-en-europa/" },
      { label: "Hoteles en América", href: "/hoteles-en-america/" },
      { label: "Restaurantes de América", href: "/restaurantes-de-america/" },
      { label: "Viajes por Asia", href: "/asia/" },
      { label: "Viajes por África", href: "/afrika/" },
    ],
  },
  {
    label: "Consejos y Tips",
    href: "#",
    children: [
      { label: "Experiencias de Viajeros", href: "/experiencias-y-tips-de-viajeros/" },
      { label: "Consejos de Empaque", href: "/consejos/" },
      { label: "Curiosidades de Viaje", href: "/curiosidades/" },
    ],
  },
  { label: "Sobre Charlie", href: "/hola-hablamos/" },
];

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Equipaje Ordenado - Inicio"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m-8 0h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2zm2 4v6m6-6v6"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">
                Equipaje<span className="text-primary">Ordenado</span>
              </span>
              <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Guías de Viaje y Cabina
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-primary cursor-pointer"
                  >
                    {item.label}
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-1 w-64 z-50">
                    <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-light-bg hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/reglas-de-equipaje/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark"
            >
              <span>✈️</span>
              <span>Medidas por Aerolínea</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 transition"
            aria-label="Abrir menú de navegación"
          >
            {isMobileOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-lg">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        )
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50"
                    >
                      {item.label}
                      <svg
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-3 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block rounded-lg py-2 px-3 text-sm font-medium text-gray-600 hover:bg-light-bg hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3">
              <Link
                href="/reglas-de-equipaje/"
                onClick={() => setIsMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm"
              >
                <span>✈️</span>
                <span>Ver Medidas por Aerolínea</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
