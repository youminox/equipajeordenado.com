import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: `Aviso Legal y condiciones de uso del sitio web ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/aviso-legal/` },
  robots: { index: false, follow: true },
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

            <section className="article-content max-w-none mt-10 pt-8 border-t border-gray-100">
              <h2>Programa de Afiliados de Amazon</h2>
              <p>
                <strong>{SITE_NAME}</strong> (<code>equipajeordenado.com</code>)
                participa en el Programa de Afiliados de Amazon EU y en el
                Programa de Afiliados de Amazon.com (Amazon Services LLC
                Associates Program), programas de publicidad para afiliados
                diseñados para ofrecer a sitios web un modo de obtener
                comisiones por publicidad, publicitando e incluyendo enlaces a{" "}
                <code>Amazon.es</code> (ID de seguimiento:{" "}
                <strong>equipajeordenado-21</strong>) y <code>Amazon.com</code>{" "}
                (ID de seguimiento: <strong>equipajeordenado-20</strong>).
              </p>
              <p>
                En calidad de Afiliado de Amazon, <strong>{SITE_NAME}</strong>{" "}
                obtiene ingresos por las compras adscritas que cumplen los
                requisitos aplicables, sin que ello suponga ningún sobrecoste ni
                variación de precio para el usuario.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
