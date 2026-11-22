"use client";

import { useEffect, useState } from "react";
import {
  AmazonProductRecommendation,
  AmazonStoreRegion,
  buildAmazonUrl,
  detectUserAmazonRegion,
} from "@/lib/amazon";

interface AmazonAffiliateBoxProps {
  variant: "inline" | "showcase" | "sidebar";
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
}

function CategoryIcon({
  type,
}: {
  type: AmazonProductRecommendation["categoryType"];
}) {
  if (type === "backpack") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0767db]/15 text-[#03428e] border border-[#0767db]/30">
        <span className="text-2xl" aria-hidden="true">
          🎒
        </span>
      </div>
    );
  }
  if (type === "liquids") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 border border-sky-300/60">
        <span className="text-2xl" aria-hidden="true">
          💧
        </span>
      </div>
    );
  }
  if (type === "scale") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 border border-amber-300/60">
        <span className="text-2xl" aria-hidden="true">
          ⚖️
        </span>
      </div>
    );
  }
  if (type === "security") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-800 border border-emerald-300/60">
        <span className="text-2xl" aria-hidden="true">
          🔒
        </span>
      </div>
    );
  }
  if (type === "electronics") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 border border-amber-300/60">
        <span className="text-2xl" aria-hidden="true">
          🔋
        </span>
      </div>
    );
  }
  if (type === "comfort") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-800 border border-indigo-300/60">
        <span className="text-2xl" aria-hidden="true">
          😴
        </span>
      </div>
    );
  }
  if (type === "cubes") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0767db]/15 text-[#03428e] border border-[#0767db]/30">
        <span className="text-2xl" aria-hidden="true">
          📦
        </span>
      </div>
    );
  }
  // Default: suitcase
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#03428e] text-amber-300 border border-amber-400/40 shadow-2xs">
      <span className="text-2xl" aria-hidden="true">
        🧳
      </span>
    </div>
  );
}

export default function AmazonAffiliateBox({
  variant,
  sectionTitle,
  sectionSubtitle,
  products,
}: AmazonAffiliateBoxProps) {
  const [region, setRegion] = useState<AmazonStoreRegion>("ES");

  useEffect(() => {
    setRegion(detectUserAmazonRegion());
  }, []);

  const primaryProduct = products[0];
  const storeName = region === "ES" ? "Amazon.es" : "Amazon.com";
  const activeTag =
    region === "ES" ? "equipajeordenado-21" : "equipajeordenado-20";

  // 1. INLINE VARIANT (Appears mid-article for high mobile CTR)
  if (variant === "inline") {
    const url = buildAmazonUrl(primaryProduct, region);

    return (
      <aside
        aria-label="Recomendación de equipaje en Amazon"
        className="my-9 rounded-2xl border-2 border-[#0767db]/40 bg-gradient-to-br from-[#f8fbff] via-[#f0f7ff] to-[#fef9ec] p-5 sm:p-6 shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/25 px-3 py-1 text-xs font-extrabold text-gray-900 border border-amber-400/60">
            {primaryProduct.badge}
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/95 border border-gray-200 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">
            <span>Tienda:</span>
            <button
              type="button"
              onClick={() => setRegion("ES")}
              className={`px-1.5 py-0.5 rounded-full transition cursor-pointer ${
                region === "ES"
                  ? "bg-[#0767db] text-white font-extrabold"
                  : "hover:text-gray-900"
              }`}
              title="Ver en Amazon España (equipajeordenado-21)"
            >
              🇪🇸 ES
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`px-1.5 py-0.5 rounded-full transition cursor-pointer ${
                region === "US"
                  ? "bg-[#0767db] text-white font-extrabold"
                  : "hover:text-gray-900"
              }`}
              title="Ver en Amazon USA / Global (equipajeordenado-20)"
            >
              🇺🇸 US
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <CategoryIcon type={primaryProduct.categoryType} />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                {primaryProduct.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
                {primaryProduct.subtitle}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-amber-600">
                  ★★★★★ {primaryProduct.rating}/5
                </span>
                <span className="text-gray-500 font-medium">
                  ({primaryProduct.reviewsCount} valoraciones)
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  ✓ Envío Prime en {storeName}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:shrink-0">
            <a
              href={url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3.5 text-sm font-extrabold text-gray-950 shadow-sm transition hover:from-amber-300 hover:to-amber-400 hover:shadow-md"
            >
              <span>{primaryProduct.ctaLabel}</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    );
  }

  // 2. SIDEBAR VARIANT (Sticky right column on desktop)
  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border-2 border-[#0767db]/35 bg-gradient-to-b from-[#f8fbff] to-[#eef6ff] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#03428e]">
            🛒 Recomendado en {storeName}
          </span>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-white/90 px-2 py-0.5 rounded-full border border-gray-200">
            <button
              type="button"
              onClick={() => setRegion("ES")}
              className={`cursor-pointer ${
                region === "ES" ? "text-[#0767db] font-extrabold underline" : ""
              }`}
            >
              🇪🇸 ES
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`cursor-pointer ${
                region === "US" ? "text-[#0767db] font-extrabold underline" : ""
              }`}
            >
              🇺🇸 US
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {products.slice(0, 2).map((prod) => {
            const url = buildAmazonUrl(prod, region);
            return (
              <div
                key={prod.id}
                className="rounded-xl border border-blue-200/80 bg-white p-3.5 shadow-2xs"
              >
                <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                  {prod.badge}
                </span>
                <h4 className="mt-1.5 text-xs font-extrabold text-gray-900 leading-snug">
                  {prod.title}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-amber-600">
                    ★★★★★ {prod.rating}
                  </span>
                  <span className="text-gray-400">({prod.reviewsCount})</span>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-extrabold text-gray-950 transition hover:bg-amber-300"
                >
                  <span>Ver en {storeName}</span>
                  <span>→</span>
                </a>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-gray-500 leading-tight text-center">
          Enlaces de afiliado oficial de Amazon ({activeTag}).
        </p>
      </div>
    );
  }

  // 3. SHOWCASE VARIANT (Full 3-product comparison grid)
  return (
    <section
      aria-label="Selección de equipaje y accesorios recomendados en Amazon"
      className="my-12 rounded-3xl border-2 border-[#0767db]/50 bg-gradient-to-br from-[#022047] via-[#071326] to-[#03336e] p-6 sm:p-8 text-white shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-extrabold text-amber-300">
            🛒 Selección Oficial Equipaje Ordenado · Disponible en {storeName}
          </span>
          <h2 className="mt-2.5 text-xl sm:text-2xl font-extrabold text-white">
            {sectionTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-sky-100/85">
            {sectionSubtitle}
          </p>
        </div>

        {/* Store Switcher (Auto-detected + Manual Override) */}
        <div className="shrink-0 self-start sm:self-center rounded-xl bg-white/10 p-1.5 border border-white/15 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRegion("ES")}
              className={`rounded-lg px-2.5 py-1.5 font-bold transition cursor-pointer ${
                region === "ES"
                  ? "bg-amber-400 text-gray-950 shadow-2xs"
                  : "text-sky-100 hover:text-white"
              }`}
            >
              🇪🇸 Amazon.es
            </button>
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`rounded-lg px-2.5 py-1.5 font-bold transition cursor-pointer ${
                region === "US"
                  ? "bg-amber-400 text-gray-950 shadow-2xs"
                  : "text-sky-100 hover:text-white"
              }`}
            >
              🇺🇸 Amazon.com
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {products.map((product, index) => {
          const url = buildAmazonUrl(product, region);
          const isFeatured = index === 0;

          return (
            <div
              key={`${product.id}-${index}`}
              className={`flex flex-col justify-between rounded-2xl p-5 transition ${
                isFeatured
                  ? "bg-gradient-to-b from-amber-50 to-white text-gray-900 border-2 border-amber-400 shadow-lg"
                  : "bg-white/95 text-gray-900 border border-gray-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                      isFeatured
                        ? "bg-amber-400 text-gray-950"
                        : "bg-blue-50 text-[#03428e]"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <CategoryIcon type={product.categoryType} />
                  <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                    {product.title}
                  </h3>
                </div>

                <p className="mt-2.5 text-xs text-gray-600 leading-relaxed">
                  {product.subtitle}
                </p>

                <ul className="mt-3.5 space-y-1.5 border-t border-gray-200/80 pt-3 text-xs text-gray-700">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-1.5">
                      <span className="text-[#0767db] font-extrabold">✓</span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100">
                <div className="mb-2.5 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-600">
                    ★★★★★ {product.rating}/5
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    ✓ Disponible en {storeName}
                  </span>
                </div>

                <a
                  href={url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-extrabold transition shadow-xs ${
                    isFeatured
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 hover:from-amber-300 hover:to-amber-400"
                      : "bg-[#0767db] text-white hover:bg-[#03428e]"
                  }`}
                >
                  <span>{product.ctaLabel}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[11px] text-sky-200/70">
        * En calidad de Afiliado de Amazon, EquipajeOrdenado.com obtiene
        ingresos por las compras adscritas que cumplen los requisitos aplicables
        sin coste adicional para ti. Tienda activa: {storeName} ({activeTag}).
      </p>
    </section>
  );
}
