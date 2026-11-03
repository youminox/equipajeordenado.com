import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategorySlug,
  getFeaturedPosts,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
} from "@/lib/data";

type Params = Promise<{ category: string }>;

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  const title = `${category.name}: Guías, Consejos y Recomendaciones`;
  const description =
    category.description ||
    `Explora ${category.count} guías completas sobre ${category.name} en ${SITE_NAME}. Información verificada y consejos prácticos para viajeros.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${category.slug}/`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/${category.slug}/`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategorySlug(categorySlug);
  const allCategories = getAllCategories();
  const featuredGuides = getFeaturedPosts(5);

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: category.name },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Category Header Banner — Dinamica.pe style */}
          <div className="mt-4 mb-12 rounded-3xl bg-gradient-to-br from-[#022c61] via-primary-dark to-primary p-8 sm:p-12 text-white shadow-lg">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sky-200">
              {category.count} Guías Especializadas
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              {category.name}
            </h1>
            <p className="mt-3 max-w-3xl text-base sm:text-lg text-sky-100 leading-relaxed">
              {category.description}
            </p>
          </div>

          <AdBanner className="mb-10" />

          <div className="lg:flex lg:gap-12">
            {/* Main Grid — Dinamica.pe Card Style */}
            <div className="min-w-0 flex-1">
              <div className="grid gap-8 sm:grid-cols-2">
                {posts.map((post) => (
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
                      <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary line-clamp-2">
                        {post.title}
                      </h2>
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

            {/* Sticky Right Sidebar — Dinamica.pe style */}
            <aside className="mt-12 lg:mt-0 lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                {/* Featured Guides */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6">
                  <h3 className="mb-4 text-base font-bold text-gray-900">
                    Guías Imprescindibles
                  </h3>
                  <div className="space-y-4">
                    {featuredGuides.map((p) => (
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

                {/* All Categories */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-base font-bold text-gray-900">
                    Categorías de Viaje
                  </h3>
                  <div className="space-y-2.5">
                    {allCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}/`}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                          cat.slug === categorySlug
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            cat.slug === categorySlug
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sidebar AdSense */}
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
