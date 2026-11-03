import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: `Aviso Legal y condiciones de uso del sitio web ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/aviso-legal/` },
};

export default function AvisoLegalPage() {
  const page = getPageBySlug("aviso-legal");
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Aviso Legal" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Aviso Legal
            </h1>
            {page ? (
              <div
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="article-content">
                <p>Aviso Legal de {SITE_NAME}.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
