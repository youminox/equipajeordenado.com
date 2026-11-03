import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "¡Hola! ¿Hablamos? Charlie Lingán — Experto en Ecommerce y Viajes",
  description:
    "Conoce a Charlie Lingán, creador de Equipaje Ordenado, especialista en comercio electrónico, innovación digital y viajero apasionado.",
  alternates: { canonical: `${SITE_URL}/hola-hablamos/` },
};

export default function HolaHablamosPage() {
  const page = getPageBySlug("hola-hablamos");
  const cleanHtml = page
    ? page.content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    : "";
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "¡Hola! ¿Hablamos?" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-100">
              <img
                src="/images/charlie-lingan-4.jpg"
                alt="Charlie Lingán"
                className="h-36 w-36 rounded-2xl object-cover shadow-md shrink-0"
              />
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-2">
                  Fundador de {SITE_NAME}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  ¡Hola! ¿Hablamos? Soy Charlie Lingán
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Experto en Ecommerce, Pionero en Innovación Digital y Viajero
                  Apasionado.
                </p>
              </div>
            </div>

            {page ? (
              <div
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            ) : (
              <div className="article-content">
                <p>
                  Bienvenido a <strong>{SITE_NAME}</strong>, tu portal de
                  referencia para encontrar las mejores maletas de cabina,
                  normativas de aerolíneas y guías de viaje.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
