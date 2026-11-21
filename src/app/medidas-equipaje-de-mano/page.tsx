import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AirlineChecker from "@/components/AirlineChecker";
import AdBanner from "@/components/AdBanner";
import {
  getIndexablePosts,
  getPostUrl,
  SITE_NAME,
  SITE_URL,
  AUTHOR_NAME,
  AUTHOR_URL,
} from "@/lib/data";
import { AIRLINE_RULES, AIRLINE_RULES_VERIFIED_AT } from "@/lib/airlines";

const PAGE_URL = `${SITE_URL}/medidas-equipaje-de-mano/`;

export const metadata: Metadata = {
  title: {
    absolute: "Medidas del equipaje de mano por aerolínea (tabla actualizada)",
  },
  description: `Tabla con las medidas y el peso de la maleta de cabina y del artículo personal en ${AIRLINE_RULES.length} aerolíneas: Iberia, Ryanair, LATAM, Avianca, Aeroméxico, United y más.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Medidas del equipaje de mano por aerolínea (tabla actualizada)",
    url: PAGE_URL,
    type: "article",
    siteName: SITE_NAME,
    locale: "es_ES",
  },
};

/** Slug fragments used to find our detailed guide for each airline. */
const AIRLINE_SLUG_KEYS: Record<string, string[]> = {
  iberia: ["iberia"],
  "air-europa": ["air-europa"],
  vueling: ["vueling"],
  ryanair: ["ryanair"],
  easyjet: ["easyjet"],
  latam: ["latam"],
  avianca: ["avianca"],
  aeromexico: ["aeromexico"],
  "copa-airlines": ["copa"],
  jetsmart: ["jetsmart"],
  "sky-airline": ["sky-airline", "-sky-"],
  volaris: ["volaris"],
  "viva-aerobus": ["viva-aerobus", "vivaaerobus"],
  "aerolineas-argentinas": ["aerolineas-argentinas"],
  "american-airlines": ["american-airlines"],
  "united-airlines": ["united"],
  delta: ["delta"],
  klm: ["klm"],
  "air-france": ["air-france"],
  lufthansa: ["lufthansa"],
};

function findAirlineGuide(id: string) {
  const keys = AIRLINE_SLUG_KEYS[id] || [id];
  const candidates = getIndexablePosts().filter(
    (p) =>
      ["reglas-de-equipaje", "aerolineas", "regulaciones"].includes(p.category) &&
      keys.some((k) => p.slug.includes(k))
  );
  return candidates[0];
}

const FAQS = [
  {
    q: "¿Cuáles son las medidas estándar del equipaje de mano?",
    a: "No existe una medida universal, pero la más aceptada es 55 x 40 x 20 cm (o 55 x 35 x 25 cm), ruedas y asas incluidas. Una maleta de 55 x 35 x 20 cm cabe en prácticamente todas las aerolíneas de esta tabla.",
  },
  {
    q: "¿Qué diferencia hay entre maleta de cabina y artículo personal?",
    a: "La maleta de cabina va en el compartimento superior; el artículo personal (bolso, mochila pequeña o funda de portátil) va debajo del asiento delantero. Muchas tarifas básicas solo incluyen el artículo personal.",
  },
  {
    q: "¿Las medidas incluyen ruedas y asas?",
    a: "Sí. Todas las aerolíneas miden la maleta completa, con ruedas, asas y bolsillos exteriores llenos. Si tu maleta es expandible, llévala sin expandir.",
  },
  {
    q: "¿La maleta de mano está incluida en la tarifa más barata?",
    a: "Depende de la aerolínea. Las low cost (Ryanair, Vueling, easyJet, JetSMART, Sky, Volaris, Viva Aerobus) y las tarifas Basic de LATAM o Avianca solo incluyen el artículo personal; la columna «¿Incluida en tarifa básica?» de la tabla lo indica para cada aerolínea.",
  },
];

export default function MedidasEquipajePage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Equipaje de mano", href: "/equipaje-de-mano/" },
    { label: "Medidas por aerolínea" },
  ];

  const rows = AIRLINE_RULES.map((a) => ({ ...a, guide: findAirlineGuide(a.id) }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Medidas del equipaje de mano por aerolínea",
    dateModified: AIRLINE_RULES_VERIFIED_AT,
    inLanguage: "es",
    author: { "@type": "Person", name: AUTHOR_NAME, url: AUTHOR_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: PAGE_URL,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Medidas del equipaje de mano por aerolínea
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Datos verificados en la web oficial de cada aerolínea · Por{" "}
            <Link href="/hola-hablamos/" className="font-semibold hover:text-primary">
              {AUTHOR_NAME}
            </Link>
          </p>

          <div className="quick-answer mt-6 rounded-2xl border-l-4 border-primary bg-light-bg p-5 text-gray-800">
            <p>
              <strong>Respuesta rápida:</strong> la medida más aceptada para la
              maleta de cabina es <strong>55 x 40 x 20 cm</strong> (o 55 x 35 x
              25 cm) con un peso de <strong>8 a 12 kg</strong>, más un artículo
              personal de unos <strong>40 x 30 x 15 cm</strong> bajo el asiento.
              Las aerolíneas low cost y muchas tarifas básicas solo incluyen el
              artículo personal: revisa tu aerolínea en la tabla.
            </p>
          </div>

          <h2 className="mt-12 text-2xl font-extrabold text-gray-900">
            Tabla comparativa de {rows.length} aerolíneas
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3">Aerolínea</th>
                  <th className="px-4 py-3">Maleta de cabina</th>
                  <th className="px-4 py-3">Peso</th>
                  <th className="px-4 py-3">Artículo personal</th>
                  <th className="px-4 py-3">¿Incluida en tarifa básica?</th>
                  <th className="px-4 py-3">Fuente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((a) => (
                  <tr key={a.id} id={a.id} className="align-top scroll-mt-28">
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {a.name}
                      <span className="block text-xs font-normal text-gray-500">
                        {a.country}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.cabinSize}</td>
                    <td className="px-4 py-3">{a.cabinWeight}</td>
                    <td className="px-4 py-3">{a.personalItem}</td>
                    <td className="px-4 py-3">{a.includedInBasicFare}</td>
                    <td className="px-4 py-3">
                      <a
                        href={a.sourceUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className="text-primary hover:underline"
                      >
                        Web oficial
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Medidas en cm (alto x ancho x fondo) con ruedas y asas incluidas. Las
            aerolíneas cambian sus políticas con frecuencia: confirma siempre en
            tu reserva antes de volar.
          </p>
        </div>

        <div className="mt-12">
          <AirlineChecker />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdBanner className="my-10" />

          <h2 className="text-2xl font-extrabold text-gray-900">
            Detalles y letra pequeña por aerolínea
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {rows.map((a) => (
              <div key={a.id} className="rounded-2xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Equipaje de mano en {a.name}
                </h3>
                <p className="mt-2 text-sm text-gray-700">{a.notes}</p>
                {a.guide && (
                  <Link
                    href={getPostUrl(a.guide)}
                    className="mt-3 inline-block text-sm font-bold text-primary hover:underline"
                  >
                    Guía completa de {a.name} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <section className="article-content max-w-none mt-14">
            <h2>Cómo medir tu maleta para no pagar en la puerta de embarque</h2>
            <ol>
              <li>
                Mide la maleta <strong>llena</strong>, de pie, desde el suelo
                hasta la parte más alta del asa (sin extender).
              </li>
              <li>
                Incluye ruedas, bolsillos exteriores y cualquier correa que
                sobresalga.
              </li>
              <li>
                Pésala en casa con una báscula de equipaje: muchas aerolíneas
                pesan maleta y artículo personal juntos.
              </li>
              <li>
                Si vuelas con varias aerolíneas en un mismo viaje, aplica la
                medida <strong>más restrictiva</strong> de todas.
              </li>
            </ol>
            <p>
              ¿Dudas sobre qué cuenta como equipaje de mano? Lee{" "}
              <Link href="/curiosidades/que-se-considera-como-equipaje-de-mano/">
                qué se considera equipaje de mano
              </Link>
              , revisa los{" "}
              <Link href="/regulaciones/cuales-son-las-restricciones-de-peso-para-el-equipaje-de-mano/">
                límites de peso
              </Link>{" "}
              y las{" "}
              <Link href="/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/">
                normas de líquidos
              </Link>
              , o vuelve a la{" "}
              <Link href="/equipaje-de-mano/">guía completa de equipaje de mano</Link>.
            </p>

            <h2>Preguntas frecuentes</h2>
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
