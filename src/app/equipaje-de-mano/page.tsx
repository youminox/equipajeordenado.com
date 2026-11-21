import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import {
  getIndexablePosts,
  getPostBySlug,
  getCategoryBySlug,
  getPostUrl,
  SITE_NAME,
  SITE_URL,
  AUTHOR_NAME,
  AUTHOR_URL,
} from "@/lib/data";
import type { Post } from "@/lib/types";

const PAGE_URL = `${SITE_URL}/equipaje-de-mano/`;

export const metadata: Metadata = {
  title: {
    absolute: "Equipaje de mano: guía completa de medidas, peso y normas",
  },
  description:
    "Todo sobre el equipaje de mano en un solo lugar: medidas y peso por aerolínea, qué líquidos y objetos puedes llevar, artículo personal, seguros y antirrobo.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Equipaje de mano: la guía completa",
    url: PAGE_URL,
    type: "article",
    siteName: SITE_NAME,
    locale: "es_ES",
  },
};

interface Section {
  id: string;
  title: string;
  intro: string;
  /** Hand-picked cornerstone links (path + anchor text). */
  key: { href: string; label: string }[];
  /** Category whose top indexable posts are listed below the key links. */
  category?: string;
  /** Optional slug keywords to pick posts from any on-topic category. */
  match?: RegExp;
}

const SECTIONS: Section[] = [
  {
    id: "que-es",
    title: "1. Qué se considera equipaje de mano",
    intro:
      "El equipaje de mano se divide en dos piezas: la maleta de cabina (compartimento superior) y el artículo personal (bajo el asiento). Muchas tarifas básicas solo incluyen la segunda.",
    key: [
      { href: "/curiosidades/que-se-considera-como-equipaje-de-mano/", label: "Qué se considera equipaje de mano (guía completa)" },
    ],
    category: "curiosidades",
  },
  {
    id: "medidas",
    title: "2. Medidas y peso por aerolínea",
    intro:
      "La medida más aceptada es 55 x 40 x 20 cm y el peso habitual va de 8 a 12 kg, pero cada aerolínea tiene su propia norma y algunas pesan maleta y bolso juntos.",
    key: [
      { href: "/medidas-equipaje-de-mano/", label: "Tabla de medidas del equipaje de mano por aerolínea" },
      { href: "/regulaciones/cuales-son-las-restricciones-de-peso-para-el-equipaje-de-mano/", label: "Peso máximo del equipaje de mano" },
    ],
    category: "reglas-de-equipaje",
  },
  {
    id: "liquidos",
    title: "3. Líquidos y objetos permitidos",
    intro:
      "La regla general sigue siendo envases de 100 ml en una bolsa transparente de 1 litro, con excepciones para medicamentos y comida de bebé. Objetos punzantes, baterías y aerosoles tienen normas propias.",
    key: [
      { href: "/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/", label: "Qué líquidos puedes llevar en el equipaje de mano" },
      { href: "/que-se-puede-llevar-en-el-equipaje-de-mano/", label: "Qué se puede llevar en el equipaje de mano (objeto por objeto)" },
    ],
    category: "que-se-puede-llevar-en-el-equipaje-de-mano",
  },
  {
    id: "normativas",
    title: "4. Normativas y controles de seguridad",
    intro:
      "Vuelos nacionales, internacionales, chárter o con escalas: las reglas cambian según la ruta y el país del control de seguridad.",
    key: [],
    category: "regulaciones",
  },
  {
    id: "seguridad",
    title: "5. Seguridad, robos y seguro de equipaje",
    intro:
      "Un candado TSA, un rastreador y un buen seguro reducen el riesgo de perder dinero si tu maleta se pierde, se retrasa o te la roban.",
    key: [
      { href: "/seguridad/como-asegurar-tu-equipaje-de-mano-contra-robos/", label: "Cómo proteger tu equipaje de mano contra robos" },
      { href: "/seguridad/seguro-para-maletas-de-viaje/", label: "Seguro para maletas de viaje: qué cubre y cómo reclamar" },
    ],
    category: "seguridad",
  },
  {
    id: "elegir",
    title: "6. Cómo elegir tu maleta de cabina",
    intro:
      "Rígida o blanda, con dos o cuatro ruedas, expandible o no: estas guías comparan tipos, marcas y opciones económicas.",
    key: [],
    category: "tipos",
  },
  {
    id: "marcas",
    title: "7. Marcas de maletas",
    intro: "Comparativas de modelos de cabina de Samsonite, American Tourister, Victorinox, Travelpro y otras marcas.",
    key: [],
    category: "marcas",
  },
  {
    id: "empacar",
    title: "8. Cómo empacar solo con equipaje de mano",
    intro:
      "Técnicas para aprovechar el espacio, listas de equipaje y consejos de viajeros que vuelan solo con cabina.",
    key: [],
    category: "consejos",
  },
];

function topPosts(category: string | undefined, exclude: Set<string>, limit = 6): Post[] {
  if (!category) return [];
  return getIndexablePosts()
    .filter((p) => p.category === category && !exclude.has(getPostUrl(p)))
    .sort((a, b) => Number(Boolean(b.editorial)) - Number(Boolean(a.editorial)))
    .slice(0, limit);
}

export default function EquipajeDeManoPillar() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Equipaje de mano" },
  ];
  const keyHrefs = new Set(SECTIONS.flatMap((s) => s.key.map((k) => k.href)));
  const updated = getPostBySlug("que-se-considera-como-equipaje-de-mano")?.modified?.slice(0, 10);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Equipaje de mano: guía completa",
    url: PAGE_URL,
    inLanguage: "es",
    ...(updated ? { dateModified: updated } : {}),
    author: { "@type": "Person", name: AUTHOR_NAME, url: AUTHOR_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Equipaje de mano: la guía completa
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Por{" "}
            <Link href="/hola-hablamos/" className="font-semibold hover:text-primary">
              {AUTHOR_NAME}
            </Link>
          </p>

          <div className="quick-answer mt-6 rounded-2xl border-l-4 border-primary bg-light-bg p-5 text-gray-800">
            <p>
              <strong>En resumen:</strong> el equipaje de mano suele ser una
              maleta de cabina de hasta <strong>55 x 40 x 20 cm</strong> y{" "}
              <strong>8-12 kg</strong> más un artículo personal bajo el asiento.
              Los líquidos van en envases de <strong>100 ml</strong> dentro de una
              bolsa de 1 litro, y cada aerolínea fija sus propias medidas y
              tarifas. Esta página reúne todas nuestras guías por tema.
            </p>
          </div>

          <nav aria-label="Índice" className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-wider text-primary-dark">
              Contenido
            </p>
            <ol className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="font-medium text-gray-700 hover:text-primary">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {SECTIONS.map((s, idx) => {
            const posts = topPosts(s.category, keyHrefs);
            const cat = s.category ? getCategoryBySlug(s.category) : undefined;
            return (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-gray-100 py-8">
                <h2 className="text-2xl font-extrabold text-gray-900">{s.title}</h2>
                <p className="mt-2 text-gray-700">{s.intro}</p>
                {s.key.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {s.key.map((k) => (
                      <li key={k.href}>
                        <Link href={k.href} className="font-bold text-primary hover:underline">
                          ★ {k.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {posts.length > 0 && (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {posts.map((p) => (
                      <li key={p.id}>
                        <Link href={getPostUrl(p)} className="text-sm text-gray-800 hover:text-primary">
                          → {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {cat && (
                  <Link
                    href={`/${cat.slug}/`}
                    className="mt-4 inline-block text-sm font-semibold text-gray-500 hover:text-primary"
                  >
                    Ver todas las guías de {cat.name} →
                  </Link>
                )}
                {idx === 2 && <AdBanner className="mt-8" />}
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
