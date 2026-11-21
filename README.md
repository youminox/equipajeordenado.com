# Equipaje Ordenado — Next.js SEO & AdSense Platform

Portal especializado en **equipaje de mano, normativas y medidas por aerolínea, comparativas de maletas de cabina y guías de viaje**, migrado desde WordPress a Next.js App Router para máximo rendimiento SEO y monetización con Google AdSense.

## Características Principales

- **2,722 Guías Verificadas** distribuidas en **21 Categorías** con URLs canónicas preservadas (`/{categoria}/{slug}/`).
- **Contenido 100% Evergreen (Atemporal)**: Títulos, encabezados y textos optimizados sin años pasados para mantener vigencia permanente.
- **Diseño Editorial Estilo `dinamica.pe`**:
  - Layout de lectura limpia con barra lateral fija (*Sticky Sidebar*).
  - Tabla de Contenidos (TOC) automática.
  - Caja de enlaces internos contextuales a mitad del artículo.
  - Ficha de autor (**Charlie Lingán**) para autoridad E-E-A-T en Google.
- **Verificador Interactivo de Medidas por Aerolínea** en portada.
- **Google AdSense (`ca-pub-1070738569472471`) + `ads.txt` + GA4 (`G-BVHPKNW89H`)** integrados.
- **2,723 Imágenes Optimizadas Localmente** en `/public/images/`.

## SEO: poda, consolidación y contenido editorial (nov 2026)

- **`scripts/seo-audit.py`**: genera `data/seo-index.json` a partir de `data/posts.json` y del último export de Search Console (`data/gsc/paginas-*.csv`).
  - `noindex`: los posts fuera del tema (hoteles, restaurantes, ciudades, África, Asia, playas, escapadas) sin impresiones en GSC siguen online, pero con `noindex,follow`. Además salen del sitemap, de los listados y del buscador.
  - `merges`: los artículos que se canibalizan se redirigen con 301 a una URL ganadora.
  - El script también genera `public/search-index.json`, `data/gsc/seo-audit-report.md` y `data/gsc/duplicate-candidates.csv` (esta lista se revisa a mano).
  - Vuelve a ejecutarlo con cada export nuevo de GSC: `python3 scripts/seo-audit.py`.
- **`data/editorial/<slug>.json`**: artículos reescritos o nuevos. Si el slug ya existe en `posts.json`, el editorial lo reemplaza; si no, se crea un post nuevo. Campos: `title`, `seoTitle`, `description`, `excerpt`, `content`, `date`, `modified`, `category` y `featuredImageUrl`.
- **`data/airline-rules.json`**: medidas y peso por aerolínea, con `sourceUrl` y `verifiedAt`. Alimenta el `AirlineChecker` y la página `/medidas-equipaje-de-mano/`. Conviene revisarlo cada trimestre.
- **Páginas pilar**: `/equipaje-de-mano/` (hub) y `/medidas-equipaje-de-mano/` (tabla).
- **Rendimiento**: los componentes cliente solo importan `@/lib/utils` o `@/lib/airlines`. **Nunca** `@/lib/data`, que arrastra los 20 MB de `posts.json` al bundle del navegador.
- **`data/manual-merges.json`**: fusiones 301 revisadas a mano a partir de `duplicate-candidates.csv`. `seo-audit.py` las aplica y colapsa las cadenas de redirección.
- **Evergreen**: `python3 scripts/remove-years.py` elimina los años de títulos y textos, y falla si queda alguno. Las referencias legales de las páginas de privacidad, aviso legal y cookies se mantienen. Las fechas reales solo aparecen en el schema (`dateModified`) y en el `lastmod` del sitemap, no en el texto visible.
