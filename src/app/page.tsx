import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import AirlineChecker from "@/components/AirlineChecker";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import {
  getFeaturedPosts,
  getRecentPosts,
  getAllCategories,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
} from "@/lib/data";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Guías de Equipaje de Mano, Medidas por Aerolínea y Viajes`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const LUGGAGE_CATS = [
  "reglas-de-equipaje",
  "que-se-puede-llevar-en-el-equipaje-de-mano",
  "regulaciones",
  "marcas",
  "tipos",
  "barato",
  "guias",
  "consejos",
  "curiosidades",
  "seguridad",
  "aerolineas",
  "resenas",
];

const TRAVEL_CATS = [
  "escapadas-a-la-naturaleza",
  "hoteles-en-europa",
  "experiencias-y-tips-de-viajeros",
  "destinos",
  "viaje-en-ciudades",
  "restaurantes-de-america",
  "afrika",
  "asia",
  "hoteles-en-america",
];

export default function HomePage() {
  const featuredPosts = getFeaturedPosts(6);
  const explorerPosts = getRecentPosts(48);
  const categories = getAllCategories();
  const catMap = new Map(categories.map((c) => [c.slug, c]));

  const luggageCategories = LUGGAGE_CATS.map((s) => catMap.get(s)).filter(
    Boolean
  );
  const travelCategories = TRAVEL_CATS.map((s) => catMap.get(s)).filter(
    Boolean
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#022c61] via-primary-dark to-primary py-20 sm:py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-200 backdrop-blur-xs">
              ✈️ Centro Experto en Equipaje de Cabina y Viajes
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Equipaje de Mano:{" "}
              <span className="text-amber-300">Todo lo que Necesitas Saber</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-sky-100 leading-relaxed">
              Descubre las medidas exactas por aerolínea, qué artículos están
              permitidos en cabina, comparativas de las mejores maletas y guías
              prácticas para viajar sin pagar cargos extra.
            </p>

            <div className="mt-9">
              <HeroSearch />
            </div>

            {/* Quick Category Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/reglas-de-equipaje/"
                className="rounded-full bg-white/15 border border-white/25 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white hover:text-primary-dark"
              >
                📏 Medidas por Aerolínea
              </Link>
              <Link
                href="/que-se-puede-llevar-en-el-equipaje-de-mano/"
                className="rounded-full bg-white/15 border border-white/25 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white hover:text-primary-dark"
              >
                🧴 Qué Llevar en Cabina
              </Link>
              <Link
                href="/marcas/"
                className="rounded-full bg-white/15 border border-white/25 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white hover:text-primary-dark"
              >
                🧳 Mejores Marcas
              </Link>
              <Link
                href="/consejos/"
                className="rounded-full bg-white/15 border border-white/25 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white hover:text-primary-dark"
              >
                💡 Trucos para Empacar
              </Link>
              <Link
                href="/hoteles-en-europa/"
                className="rounded-full bg-white/15 border border-white/25 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white hover:text-primary-dark"
              >
                🌍 Destinos y Hoteles
              </Link>
            </div>

            {/* Key Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/15 pt-8">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">
                  2,720+
                </span>
                <span className="text-xs text-sky-100 uppercase tracking-wider font-semibold">
                  Guías Verificadas
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">
                  21
                </span>
                <span className="text-xs text-sky-100 uppercase tracking-wider font-semibold">
                  Categorías
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">
                  100%
                </span>
                <span className="text-xs text-sky-100 uppercase tracking-wider font-semibold">
                  Práctico
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Airline Luggage Size Checker */}
        <AirlineChecker />

        {/* AdSense Banner */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdBanner />
        </div>

        {/* Featured Guides — Dinamica.pe Card Style */}
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Lecturas Imprescindibles
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Guías Esenciales de{" "}
                <span className="text-primary">Equipaje de Mano</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
                Todo lo que necesitas dominar antes de ir al aeropuerto:
                dimensiones estándar, peso permitido, líquidos y cómo elegir tu
                maleta ideal.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                    <img
                      src={getImageUrl(post.featuredImageUrl)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow">
                      {post.categoryName}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <span>⏱️ {post.readTime} de lectura</span>
                      <span>·</span>
                      <span className="text-emerald-600 font-semibold">
                        ✓ Guía Verificada
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Leer guía completa
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Charlie Lingán Author & Opinion Section (From WP Homepage) */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-primary-dark to-gray-900 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-2xl border-2 border-white/15 shadow-2xl">
                  <img
                    src="/images/Charlie-Lingan.jpg"
                    alt="Charlie Lingán - Creador de Equipaje Ordenado"
                    className="w-full h-[360px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-block rounded-full bg-amber-400/20 border border-amber-300/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                  Experiencia Viajera Real
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  Todo según mi opinión,{" "}
                  <span className="text-amber-300">Charlie Lingán</span>
                </h2>
                <p className="text-base sm:text-lg text-sky-100 leading-relaxed">
                  Estás en una de las páginas más completas sobre viajes y
                  equipaje de cabina, creada por <strong>Charlie Lingán</strong>,
                  amante de los viajes y la innovación digital. A través de mi
                  experiencia viajando, he reunido aquí las mejores guías,
                  comparativas de marcas y normativas de aerolíneas para que
                  disfrutes de cada viaje de forma placentera, ligera y sin
                  contratiempos.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="rounded-xl bg-white/10 p-3.5 text-center">
                    <span className="block text-sm font-bold text-amber-300">
                      🧳 Equipaje Ligero
                    </span>
                    <span className="text-xs text-sky-100">Guías de Cabina</span>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5 text-center">
                    <span className="block text-sm font-bold text-amber-300">
                      ✈️ Aerolíneas
                    </span>
                    <span className="text-xs text-sky-100">Medidas Exactas</span>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5 text-center">
                    <span className="block text-sm font-bold text-amber-300">
                      ⭐ Mejores Marcas
                    </span>
                    <span className="text-xs text-sky-100">Reseñas Reales</span>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3.5 text-center">
                    <span className="block text-sm font-bold text-amber-300">
                      💡 Tips de Viaje
                    </span>
                    <span className="text-xs text-sky-100">Sin Contratiempos</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    href="/hola-hablamos/"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-gray-950 transition hover:bg-amber-300"
                  >
                    Conocer más sobre Charlie Lingán
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
          </div>
        </section>

        {/* Categories Hub */}
        <section className="py-16 bg-light-bg border-b border-gray-200/70">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Explora por Temática
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Todas las Categorías de{" "}
                <span className="text-primary">Equipaje y Destinos</span>
              </h2>
            </div>

            {/* Group 1: Equipaje de Mano y Normativas */}
            <div className="mb-12">
              <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                <span>🧳</span> Equipaje de Mano, Marcas y Reglas de Aerolíneas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {luggageCategories.map(
                  (cat) =>
                    cat && (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}/`}
                        className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-primary hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {cat.name}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                            {cat.count}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {cat.description}
                        </p>
                      </Link>
                    )
                )}
              </div>
            </div>

            {/* Group 2: Destinos, Hoteles y Restaurantes */}
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                <span>🌎</span> Destinos, Hoteles, Naturaleza y Gastronomía
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {travelCategories.map(
                  (cat) =>
                    cat && (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}/`}
                        className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-primary hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {cat.name}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                            {cat.count} guías
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {cat.description}
                        </p>
                      </Link>
                    )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Explorer Section — Dinamica.pe BlogListClient style */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Buscador de Guías por Categoría
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Explora Nuestras{" "}
                <span className="text-primary">Guías Actualizadas</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
                Filtra por categoría o escribe lo que necesitas saber para tu
                próximo viaje.
              </p>
            </div>

            <BlogExplorerClient
              initialPosts={explorerPosts}
              categories={categories}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
