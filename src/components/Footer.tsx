import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m-8 0h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2zm2 4v6m6-6v6"
                  />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white">
                Equipaje<span className="text-sky-400">Ordenado</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Tu guía especializada en equipaje de mano, normativas de cabina
              por aerolínea, comparativas de maletas y recomendaciones de
              destinos alrededor del mundo. Creado por Charlie Lingán.
            </p>
          </div>

          {/* Equipaje y Aerolíneas */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Equipaje de Mano
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/reglas-de-equipaje/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Medidas y Reglas por Aerolínea
                </Link>
              </li>
              <li>
                <Link
                  href="/que-se-puede-llevar-en-el-equipaje-de-mano/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Qué se Puede Llevar en Cabina
                </Link>
              </li>
              <li>
                <Link
                  href="/marcas/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Mejores Marcas de Maletas
                </Link>
              </li>
              <li>
                <Link
                  href="/tipos/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Tipos de Equipaje de Mano
                </Link>
              </li>
              <li>
                <Link
                  href="/barato/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Equipaje de Mano Económico
                </Link>
              </li>
              <li>
                <Link
                  href="/regulaciones/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Regulaciones de Seguridad
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinos y Viajes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Destinos y Guías
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/escapadas-a-la-naturaleza/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Escapadas a la Naturaleza
                </Link>
              </li>
              <li>
                <Link
                  href="/hoteles-en-europa/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Hoteles en Europa
                </Link>
              </li>
              <li>
                <Link
                  href="/hoteles-en-america/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Hoteles en América
                </Link>
              </li>
              <li>
                <Link
                  href="/destinos/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Destinos de Playa
                </Link>
              </li>
              <li>
                <Link
                  href="/viaje-en-ciudades/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Viajes en Ciudades
                </Link>
              </li>
              <li>
                <Link
                  href="/experiencias-y-tips-de-viajeros/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Experiencias y Tips de Viajeros
                </Link>
              </li>
            </ul>
          </div>

          {/* Información Legal & Contacto */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Información y Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/hola-hablamos/"
                  className="hover:text-sky-400 transition-colors"
                >
                  ¡Hola! ¿Hablamos? (Sobre Charlie Lingán)
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidad/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/aviso-legal/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-cookies/"
                  className="hover:text-sky-400 transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800/80 pt-8 text-center text-xs text-gray-500">
          <p>
            &copy; Equipaje Ordenado — Todos los derechos reservados. Guías
            verificadas de viaje y equipaje de cabina.
          </p>
        </div>
      </div>
    </footer>
  );
}
