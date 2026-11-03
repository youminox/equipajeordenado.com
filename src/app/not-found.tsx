import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-20">
        <div className="text-center max-w-lg">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Error 404
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900">
            Página no encontrada
          </h1>
          <p className="mt-3 text-base text-gray-600">
            La guía o página que buscas fue movida o no existe. Explora nuestras
            categorías principales de equipaje de mano y viajes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
            >
              Ir al Inicio
            </Link>
            <Link
              href="/reglas-de-equipaje/"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-800 transition hover:border-primary hover:text-primary"
            >
              Ver Medidas por Aerolínea
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
