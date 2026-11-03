import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: `Información sobre el uso de cookies en ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/politica-de-cookies/` },
};

export default function PoliticaCookiesPage() {
  const page = getPageBySlug("politica-de-cookies");
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Política de Cookies" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Política de Cookies
            </h1>
            {page ? (
              <div
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="article-content">
                <p>Política de Cookies de {SITE_NAME}.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
