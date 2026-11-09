import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleEnhancer from "@/components/ArticleEnhancer";
import AdBanner from "@/components/AdBanner";
import {
  getAllPosts,
  getPostBySlug,
  getCategoryBySlug,
  getRelatedPosts,
  getContextualRelatedPosts,
  getFeaturedPosts,
  getPostUrl,
  getImageUrl,
  generateExcerpt,
  SITE_NAME,
  SITE_URL,
} from "@/lib/data";

type Params = Promise<{ category: string; slug: string }>;

const DATED_SLUG_REDIRECTS: Record<string, string> = {
  "guia-actualizada-del-equipaje-de-mano-en-jetblue-2025":
    "guia-actualizada-del-equipaje-de-mano-en-jetblue",
  "guia-completa-del-equipaje-de-mano-en-british-airways-2024":
    "guia-completa-del-equipaje-de-mano-en-british-airways",
  "guia-practica-sobre-el-equipaje-de-mano-de-spirit-airlines-en-2025":
    "guia-practica-sobre-el-equipaje-de-mano-de-spirit-airlines",
  "medidas-y-peso-del-equipaje-de-mano-en-delta-airlines-2025":
    "medidas-y-peso-del-equipaje-de-mano-en-delta-airlines",
  "politica-de-equipaje-de-mano-de-easyjet-en-2025-que-puedes-llevar-gratis":
    "politica-de-equipaje-de-mano-de-easyjet-que-puedes-llevar-gratis",
  "todo-sobre-el-equipaje-de-mano-en-air-france-para-2025":
    "todo-sobre-el-equipaje-de-mano-en-air-france",
};

function resolveCanonicalBasePost(slug: string) {
  if (DATED_SLUG_REDIRECTS[slug]) {
    const datedTarget = getPostBySlug(DATED_SLUG_REDIRECTS[slug]);
    if (datedTarget) return datedTarget;
  }

  const numberedMatch = slug.match(/^(.+)-(\d{1,2})$/);
  if (numberedMatch) {
    const candidateBase = numberedMatch[1];
    const resolvedBase = DATED_SLUG_REDIRECTS[candidateBase] || candidateBase;
    const basePost = getPostBySlug(resolvedBase);
    if (basePost) return basePost;
  }

  return undefined;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug) || resolveCanonicalBasePost(slug);
  if (!post) {
    return {
      title: `Artículo no encontrado | ${SITE_NAME}`,
      robots: { index: false, follow: true },
    };
  }

  const description = post.excerpt || generateExcerpt(post.content, 158);
  const absoluteImageUrl = `${SITE_URL}${getImageUrl(post.featuredImageUrl)}`;
  const canonicalUrl = `${SITE_URL}/${post.category}/${post.slug}/`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "es_ES",
      siteName: SITE_NAME,
      authors: ["Charlie Lingán"],
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

interface TocItem {
  id: string;
  text: string;
}

function addHeadingIdsAndExtractToc(html: string): {
  enhancedHtml: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  let index = 0;

  const enhancedHtml = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (fullMatch, attrs, inner) => {
      const plainText = inner
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!plainText) return fullMatch;
      index += 1;
      const id = `seccion-${index}`;
      toc.push({ id, text: plainText });
      if (/id=/i.test(attrs)) {
        return fullMatch;
      }
      return `<h2 id="${id}"${attrs}>${inner}</h2>`;
    }
  );

  return { enhancedHtml, toc };
}

function splitContentAtThirdH2(htmlContent: string): [string, string | null] {
  const h2Matches = [...htmlContent.matchAll(/<h2[^>]*>/gi)];
  if (h2Matches.length < 3) {
    return [htmlContent, null];
  }
  const splitIndex = h2Matches[2].index;
  if (splitIndex === undefined || splitIndex <= 0) {
    return [htmlContent, null];
  }
  return [htmlContent.slice(0, splitIndex), htmlContent.slice(splitIndex)];
}

function extractFaqPairs(
  htmlContent: string
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const regex =
    /<h[23][^>]*>\s*(¿[^<]+\?)\s*<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(htmlContent)) !== null && faqs.length < 6) {
    const question = match[1]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const answer = match[2]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (question.length > 10 && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { category: categorySlug, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    const canonicalBase = resolveCanonicalBasePost(slug);
    if (canonicalBase) {
      permanentRedirect(`/${canonicalBase.category}/${canonicalBase.slug}/`);
    }
    notFound();
  }

  if (categorySlug !== post.category) {
    permanentRedirect(`/${post.category}/${post.slug}/`);
  }

  const category = getCategoryBySlug(post.category);
  const relatedPosts = getRelatedPosts(post, 4);
  const contextualPosts = getContextualRelatedPosts(post, 3);
  const featuredGuides = getFeaturedPosts(5).filter((p) => p.id !== post.id);

  const { enhancedHtml, toc } = addHeadingIdsAndExtractToc(post.content);
  const [firstHalfContent, secondHalfContent] =
    splitContentAtThirdH2(enhancedHtml);
  const faqPairs = extractFaqPairs(post.content);

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: category?.name || post.categoryName, href: `/${post.category}/` },
    { label: post.title },
  ];

  const absoluteImageUrl = `${SITE_URL}${getImageUrl(post.featuredImageUrl)}`;
  const canonicalUrl = `${SITE_URL}/${post.category}/${post.slug}/`;
  const freshIsoDate = new Date().toISOString().split("T")[0];

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || generateExcerpt(post.content, 160),
    image: absoluteImageUrl,
    dateModified: freshIsoDate,
    author: {
      "@type": "Person",
      name: "Charlie Lingán",
      url: `${SITE_URL}/hola-hablamos/`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const faqSchema =
    faqPairs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqPairs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* Exact Dinamica.pe Article Page Layout */}
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-12">
            {/* Main Article Column */}
            <article className="min-w-0 flex-1 lg:max-w-3xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <Link
                  href={`/${post.category}/`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
                >
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
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Volver a {category?.name || post.categoryName}
                </Link>
              </div>

              <Breadcrumbs items={breadcrumbItems} />

              {/* Category Pill & Evergreen Verification Meta (No dated year) */}
              <div className="mt-4 mb-5 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${post.category}/`}
                  className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
                >
                  {category?.name || post.categoryName}
                </Link>
                <span className="text-sm font-medium text-gray-500">
                  ⏱️ {post.readTime} de lectura
                </span>
                <span className="text-sm text-gray-300">·</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ✓ Guía Verificada y Actualizada
                </span>
              </div>

              {/* H1 Title */}
              <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                {post.title}
              </h1>

              {/* Featured Image — Dinamica.pe rounded-2xl shadow-md */}
              {post.featuredImageUrl && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 shadow-md">
                  <img
                    src={getImageUrl(post.featuredImageUrl)}
                    alt={post.title}
                    className="w-full max-h-[430px] object-cover"
                  />
                </div>
              )}

              {/* Above-the-fold AdSense Banner */}
              <AdBanner className="my-8" />

              {/* Automatic Table of Contents (TOC) */}
              {toc.length >= 2 && (
                <nav
                  aria-label="Tabla de contenidos"
                  className="my-8 rounded-2xl border border-gray-200 bg-light-bg/70 p-6"
                >
                  <p className="text-sm font-extrabold uppercase tracking-wider text-primary-dark mb-3 flex items-center gap-2">
                    <span>📋</span> Contenido de esta guía
                  </p>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {toc.map((item, idx) => (
                      <li key={item.id} className="truncate">
                        <a
                          href={`#${item.id}`}
                          className="text-gray-700 hover:text-primary font-medium transition-colors"
                        >
                          <span className="font-bold text-primary mr-1.5">
                            {idx + 1}.
                          </span>
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Content Part 1 */}
              <div
                className="article-content mt-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: firstHalfContent }}
              />

              {/* Contextual Internal Links Box + In-Article Ad */}
              {secondHalfContent && (
                <>
                  {contextualPosts.length > 0 && (
                    <aside className="my-10 rounded-2xl border-l-4 border-primary bg-light-bg p-6 shadow-xs">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-primary-dark mb-3">
                        ✈️ También te puede interesar en{" "}
                        {category?.name || post.categoryName}
                      </p>
                      <ul className="space-y-2.5">
                        {contextualPosts.map((cp) => (
                          <li key={cp.id} className="text-sm">
                            <Link
                              href={getPostUrl(cp)}
                              className="font-bold text-gray-900 hover:text-primary transition-colors flex items-start gap-2"
                            >
                              <span className="text-primary font-extrabold">
                                →
                              </span>
                              <span>{cp.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  )}

                  <AdBanner format="fluid" layout="in-article" className="my-8" />

                  {/* Content Part 2 */}
                  <div
                    className="article-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: secondHalfContent }}
                  />
                </>
              )}

              <ArticleEnhancer />

              {/* End of Article AdSense Banner */}
              <AdBanner className="my-10" />

              {/* CTA Banner inside article — Exact Dinamica.pe style */}
              <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-dark to-primary p-8 sm:p-10 text-center text-white shadow-lg">
                <h3 className="text-2xl font-extrabold">
                  ¿Listo para viajar sin pagar cargos extra por tu maleta?
                </h3>
                <p className="mt-2 text-sky-100 max-w-xl mx-auto text-sm sm:text-base">
                  Consulta nuestra tabla verificada con las medidas exactas de
                  equipaje de mano por aerolínea y las mejores maletas de cabina
                  recomendadas.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/reglas-de-equipaje/"
                    className="inline-block rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-gray-950 transition hover:bg-amber-300"
                  >
                    ✈️ Ver Medidas por Aerolínea
                  </Link>
                  <Link
                    href="/marcas/"
                    className="inline-block rounded-xl bg-white/15 border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-primary-dark"
                  >
                    🧳 Mejores Marcas de Maletas
                  </Link>
                </div>
              </div>

              {/* Author Box (Charlie Lingán — E-E-A-T SEO) */}
              <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src="/images/Charlie-Lingan.jpg"
                  alt="Charlie Lingán"
                  className="h-20 w-20 rounded-2xl object-cover shrink-0 shadow-sm"
                  loading="lazy"
                />
                <div className="text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Escrito y verificado por
                  </span>
                  <h4 className="text-lg font-extrabold text-gray-900">
                    <Link
                      href="/hola-hablamos/"
                      className="hover:text-primary transition-colors"
                    >
                      Charlie Lingán
                    </Link>
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Viajero frecuente y especialista en comercio electrónico e
                    innovación digital. Creador de Equipaje Ordenado para
                    ayudarte a elegir las mejores maletas de mano y disfrutar de
                    cada viaje con total comodidad y sin complicaciones.
                  </p>
                </div>
              </div>

              {/* Bottom Related Articles Grid */}
              {relatedPosts.length > 0 && (
                <section className="mt-14 pt-10 border-t border-gray-100">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                    Más Guías sobre {category?.name || post.categoryName}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.id}
                        href={getPostUrl(rp)}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-primary/40"
                      >
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(rp.featuredImageUrl)}
                            alt={rp.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-[11px] font-semibold text-gray-400">
                            ⏱️ {rp.readTime} de lectura · ✓ Verificada
                          </span>
                          <h3 className="mt-1 text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                            {rp.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Right Sticky Sidebar — Exact Dinamica.pe Style */}
            <aside className="mt-12 lg:mt-0 lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                {/* Artículos Relacionados Box */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6">
                    <h3 className="mb-4 text-base font-bold text-gray-900">
                      Artículos Relacionados
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((p) => (
                        <Link
                          key={p.id}
                          href={getPostUrl(p)}
                          className="group flex gap-3 rounded-xl p-2 transition hover:bg-white"
                        >
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                            <img
                              src={getImageUrl(p.featuredImageUrl)}
                              alt={p.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-primary">
                              {p.title}
                            </h4>
                            <span className="mt-1 block text-[11px] text-gray-400">
                              ⏱️ {p.readTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guías Destacadas Box */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-base font-bold text-gray-900">
                    Guías Destacadas
                  </h3>
                  <div className="space-y-3">
                    {featuredGuides.slice(0, 5).map((p) => (
                      <Link
                        key={p.id}
                        href={getPostUrl(p)}
                        className="block border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 group"
                      >
                        <p className="text-xs font-semibold text-primary mb-0.5">
                          {p.categoryName}
                        </p>
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sticky Sidebar AdSense Unit */}
                <AdBanner format="rectangle" className="my-0" />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
