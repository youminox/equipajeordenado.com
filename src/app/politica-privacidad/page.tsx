import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Política de Privacidad y protección de datos personales de ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/politica-privacidad/` },
};

export default function PoliticaPrivacidadPage() {
  const page = getPageBySlug("politica-privacidad");
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Política de Privacidad" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Política de Privacidad
            </h1>
            {page ? (
              <div
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="article-content">
                <p>Política de privacidad de {SITE_NAME}.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
