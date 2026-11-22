import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import AmazonAffiliateBox from "@/components/AmazonAffiliateBox";
import { getContextualAmazonProducts } from "@/lib/amazon";
import {
  getPageBySlug,
  SITE_NAME,
  SITE_URL,
  AUTHOR_NAME,
  AUTHOR_URL,
} from "@/lib/data";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${AUTHOR_URL}#person`,
  name: AUTHOR_NAME,
  alternateName: ["Charlie Lingan", "Carlos Lingán"],
  url: AUTHOR_URL,
  image: `${SITE_URL}/images/charlie-lingan-4.jpg`,
  jobTitle: "Fundador y editor de Equipaje Ordenado",
  homeLocation: { "@type": "Place", name: "Lima, Perú" },
  sameAs: ["https://charlielingan.com/", "https://carloslingan.pe/"],
  worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  knowsAbout: [
    "Equipaje de mano",
    "Normativas de equipaje de aerolíneas",
    "Seguridad aeroportuaria",
    "Maletas de cabina",
  ],
};

export const metadata: Metadata = {
  title: "¡Hola! ¿Hablamos? Charlie Lingán — Experto en Ecommerce y Viajes",
  description:
    "Conoce a Charlie Lingán, creador de Equipaje Ordenado, especialista en comercio electrónico, innovación digital y viajero apasionado.",
  alternates: { canonical: `${SITE_URL}/hola-hablamos/` },
};

export default function HolaHablamosPage() {
  const page = getPageBySlug("hola-hablamos");
  const amazonContext = getContextualAmazonProducts(
    "hola-hablamos",
    "guias",
    "Maletas de cabina recomendadas por Charlie Lingán"
  );
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
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

            <section
              id="politica-editorial"
              className="article-content max-w-none mt-10 pt-8 border-t border-gray-100"
            >
              <h2>Cómo elaboramos y verificamos nuestras guías</h2>
              <ul>
                <li>
                  <strong>Fuentes oficiales primero:</strong> las medidas, pesos
                  y normas de cada aerolínea se contrastan con su web oficial y
                  con los organismos de seguridad (TSA, normativa UE, AESA). En
                  la{" "}
                  <Link href="/medidas-equipaje-de-mano/">
                    tabla de medidas por aerolínea
                  </Link>{" "}
                  enlazamos la fuente de cada dato y su fecha de verificación.
                </li>
                <li>
                  <strong>Fecha visible:</strong> cada artículo muestra cuándo se
                  actualizó por última vez. Las guías de normativas se revisan
                  periódicamente porque las aerolíneas cambian sus políticas.
                </li>
                <li>
                  <strong>Independencia:</strong> el sitio se financia con
                  publicidad (Google AdSense) y enlaces de afiliado de Amazon
                  Associates (<code>equipajeordenado-21</code> en Amazon.es y{" "}
                  <code>equipajeordenado-20</code> en Amazon.com) sin coste
                  adicional para el lector. Ninguna marca paga por alterar
                  nuestras comparativas.
                </li>
                <li>
                  <strong>Correcciones:</strong> si detectas un dato
                  desactualizado, escríbenos desde{" "}
                  <a href="https://charlielingan.com/" rel="noopener" target="_blank">
                    charlielingan.com
                  </a>{" "}
                  y lo revisaremos.
                </li>
              </ul>
            </section>

            <AmazonAffiliateBox
              variant="showcase"
              sectionTitle={amazonContext.sectionTitle}
              sectionSubtitle={amazonContext.sectionSubtitle}
              products={amazonContext.products}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
