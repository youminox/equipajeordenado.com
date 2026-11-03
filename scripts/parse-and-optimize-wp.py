import xml.etree.ElementTree as ET
import json
import os
import re
import html
from collections import Counter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XML_PATH = os.path.join(ROOT_DIR, "equipajeordenado.WordPress.2026-11-03.xml")
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

CATEGORY_DESCRIPTIONS = {
    "escapadas-a-la-naturaleza": "Descubre las mejores rutas de senderismo, parques nacionales, playas vírgenes y escapadas al aire libre con consejos de equipaje ligero.",
    "hoteles-en-europa": "Selección de los mejores hoteles y alojamientos en Europa: ubicación, servicios, relación calidad-precio y consejos para viajeros.",
    "experiencias-y-tips-de-viajeros": "Consejos prácticos de viajeros frecuentes, trucos de aeropuerto, organización de maletas y experiencias reales alrededor del mundo.",
    "destinos": "Guías completas sobre qué hacer en los mejores destinos de playa del mundo, actividades imperdibles y qué llevar en tu maleta.",
    "viaje-en-ciudades": "Guías urbanas para explorar las ciudades más fascinantes del mundo viajando cómodo y solo con equipaje de mano.",
    "restaurantes-de-america": "Rutas gastronómicas y los mejores restaurantes recomendados en Norteamérica, Centroamérica y Sudamérica para tu próximo viaje.",
    "afrika": "Guías de viaje por África: safaris, ciudades históricas, cultura, consejos de seguridad y qué empacar para cada destino.",
    "asia": "Todo para viajar a Asia: templos, metrópolis modernas, playas paradisíacas y recomendaciones de equipaje para vuelos largos.",
    "hoteles-en-america": "Guía de los mejores hoteles y resorts en Estados Unidos, México, el Caribe, Centroamérica y Sudamérica.",
    "que-se-puede-llevar-en-el-equipaje-de-mano": "Lista completa y actualizada de artículos permitidos y prohibidos en la cabina del avión: líquidos, comida, medicamentos y electrónicos.",
    "reglas-de-equipaje": "Medidas exactas, peso máximo y políticas de equipaje de mano y artículo personal de las principales aerolíneas del mundo.",
    "curiosidades": "Datos sorprendentes, preguntas frecuentes y todo lo que debes saber sobre el mundo de la aviación y el equipaje de cabina.",
    "regulaciones": "Normativas internacionales de seguridad aeroportuaria (TSA, UE, IATA) sobre dimensiones, líquidos, baterías y control de seguridad.",
    "tipos": "Comparativas de todos los tipos de equipaje de mano: maletas rígidas, blandas, mochilas de cabina, bolsas con ruedas y más.",
    "marcas": "Análisis y opiniones de las mejores marcas de maletas de cabina: Samsonite, American Tourister, Aerolite, Travelpro, Cabin Max y más.",
    "barato": "Las mejores opciones de maletas de mano económicas con excelente relación calidad-precio y trucos para viajar gastando menos.",
    "seguridad": "Cómo proteger tus pertenencias durante el viaje: candados TSA, maletas antirrobo, rastreadores GPS y seguridad en aeropuertos.",
    "guias": "Guías paso a paso para elegir, organizar y aprovechar cada centímetro de tu maleta de cabina en cualquier tipo de viaje.",
    "consejos": "Trucos expertos de empaque, organización inteligente para evitar arrugas y listas de verificación para viajar sin estrés.",
    "aerolineas": "Guías detalladas de aerolíneas comerciales y low cost: franquicias de equipaje, tarifas, embarque y consejos para no pagar recargos.",
    "resenas": "Reseñas a fondo y comparativas de los modelos de maletas y mochilas de viaje más vendidos y mejor valorados.",
}

CATEGORY_NAMES_CLEAN = {
    "escapadas-a-la-naturaleza": "Escapadas a la Naturaleza",
    "hoteles-en-europa": "Hoteles en Europa",
    "experiencias-y-tips-de-viajeros": "Experiencias y Tips de Viajeros",
    "destinos": "Destinos de Playa",
    "viaje-en-ciudades": "Viajes en Ciudades",
    "restaurantes-de-america": "Restaurantes de América",
    "afrika": "Viajes por África",
    "asia": "Viajes por Asia",
    "hoteles-en-america": "Hoteles en América",
    "que-se-puede-llevar-en-el-equipaje-de-mano": "Qué Llevar en el Equipaje de Mano",
    "reglas-de-equipaje": "Medidas y Reglas por Aerolínea",
    "curiosidades": "Curiosidades de Viaje",
    "regulaciones": "Regulaciones y Normativas",
    "tipos": "Tipos de Equipaje",
    "marcas": "Marcas de Maletas",
    "barato": "Equipaje Económico",
    "seguridad": "Seguridad en Viajes",
    "guias": "Guías de Equipaje",
    "consejos": "Consejos de Empaque",
    "aerolineas": "Aerolíneas",
    "resenas": "Reseñas de Maletas",
}


def clean_evergreen_title(raw_title: str) -> str:
    if not raw_title:
        return ""
    t = html.unescape(raw_title).strip()
    t = t.strip("`\"' ")

    # Specific title replacements so removing years reads naturally
    t = re.sub(r"\[\s*Gu[ií]a\s+20[12]\d\s*\]", "Guía Completa", t, flags=re.I)
    t = re.sub(r"\[\s*20[12]\d\s+Gu[ií]a\s*\]", "Guía Completa", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+20[12]\d\s*:", "Guía Definitiva:", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+20[12]\d\s+(para|de|sobre|en)\b", r"Guía Completa \1", t, flags=re.I)
    t = re.sub(r"\|\s*20[12]\d\s+Gu[ií]a\b", "| Guía Completa", t, flags=re.I)
    t = re.sub(r"\|\s*Gu[ií]a\s+20[12]\d\b", "| Guía Completa", t, flags=re.I)
    t = re.sub(r"\bGu[ií]a\s+20[12]\d\b", "Guía Actualizada", t, flags=re.I)
    t = re.sub(r"\bComparativa\s+20[12]\d\s*:", "Comparativa Completa:", t, flags=re.I)
    t = re.sub(r"\bComparativa\s+20[12]\d\b", "Comparativa Actualizada", t, flags=re.I)

    # Remove prepositions + year
    t = re.sub(r"\s+(?:para|en)\s+este\s+20[12]\d\b", "", t, flags=re.I)
    t = re.sub(r"\s+(?:para|en)\s+el\s+(?:a[ñn]o\s+)?20[12]\d\b", "", t, flags=re.I)
    t = re.sub(r"\s+(?:para|en|del|de)\s+20[12]\d\b", "", t, flags=re.I)

    # Remove separators + year
    t = re.sub(r"\s*[\|\-–—:]\s*20[12]\d\b", "", t)
    t = re.sub(r"\s*[\(\[]\s*20[12]\d\s*[\)\]]", "", t)

    # Remove any remaining standalone 201x / 202x in title
    t = re.sub(r"\b20[12]\d\b", "", t)

    # Clean up trailing or double punctuation
    t = re.sub(r"\s+([:,\|\?\!])", r"\1", t)
    t = re.sub(r"[\|\-–—:]+\s*$", "", t)
    t = re.sub(r"\[\s*", "", t)
    t = re.sub(r"\s*\]", "", t)
    t = re.sub(r"\s{2,}", " ", t).strip()
    t = t.strip("`\"' -|:")
    return t


def remove_years_from_text_segment(text: str) -> str:
    # Replace dated sentences/phrases in Spanish with natural evergreen equivalents
    replacements = [
        (r"\b[Ee]n\s+vistas\s+del\s+a[ñn]o\s+202\d\b", "En la actualidad"),
        (r"\b[Aa]\s+medida\s+que\s+(?:el\s+a[ñn]o\s+)?202\d\s+avanza\b", "Hoy en día"),
        (r"\b[Ee]l\s+a[ñn]o\s+202\d\s+trae\s+consigo\b", "La temporada actual trae consigo"),
        (r"\b[Ee]n\s+esta\s+gu[ií]a\s+del?\s+202\d\b", "En esta guía completa"),
        (r"\b[Pp]ara\s+el\s+a[ñn]o\s+202\d\s*,", "Actualmente,"),
        (r"\b[Ee]n\s+el\s+a[ñn]o\s+202\d\s*,", "Hoy en día,"),
        (r"\b[Ee]n\s+este\s+202\d\s*,", "Actualmente,"),
        (r"\b[Ee]n\s+202\d\s*,", "Actualmente,"),
        (r"\b[Aa]\s+partir\s+de\s+202\d\s*,", "Según la normativa vigente,"),
        (r"\b[Aa]\s+partir\s+de\s+202\d\b", "actualmente"),
        (r"\b[Pp]ara\s+el\s+a[ñn]o\s+202\d\b", "en la actualidad"),
        (r"\b[Ee]n\s+el\s+a[ñn]o\s+202\d\b", "en la actualidad"),
        (r"\b(?:para|en)\s+este\s+202\d\b", "hoy en día"),
        (r"\bGu[ií]a\s+(?:Actualizada\s+|Completa\s+|Definitiva\s+)?202\d\b", "Guía Actualizada"),
        (r"\bComparativa\s+202\d\b", "Comparativa Actualizada"),
        (r"\s+(?:para|en|del|de)\s+202\d\b", ""),
        (r"\s*[\(\[]202\d[\)\]]", ""),
        (r"\b202\d\b", ""),
    ]
    out = text
    for pattern, repl in replacements:
        out = re.sub(pattern, repl, out)
    # Clean stray spaces before punctuation
    out = re.sub(r"\s+([,\.;:\?\!])", r"\1", out)
    out = re.sub(r"\(\s*\)", "", out)
    out = re.sub(r" {2,}", " ", out)
    return out


def clean_content(raw_html: str) -> str:
    if not raw_html:
        return ""

    h = raw_html

    # 1. Remove WordPress block comments (including wp:orbital/cluster)
    h = re.sub(r"<!--\s*/?wp:[^>]*-->", "", h)

    # 2. Remove [aib_post_related ...] and other shortcodes
    h = re.sub(r"\[aib_post_related[^\]]*\]", "", h)
    h = re.sub(r"\[insertar[^\]]*\]", "", h)
    h = re.sub(r"\[caption[^\]]*\](.*?)\[/caption\]", r"\1", h, flags=re.S)
    h = re.sub(r"\[gallery[^\]]*\]", "", h)
    h = re.sub(r"\[embed\](.*?)\[/embed\]", r"\1", h, flags=re.S)

    # 3. Convert leftover **bold** markdown to <strong>
    h = re.sub(r"\*\*([^*<>]+)\*\*", r"<strong>\1</strong>", h)

    # 4. Protect URLs before removing 2021-2026 years from text
    urls = []
    def save_url(m):
        urls.append(m.group(0))
        return f"__URL_PLACEHOLDER_{len(urls)-1}__"

    h = re.sub(r"https?://[^\s\"'<>]+", save_url, h)
    h = remove_years_from_text_segment(h)
    for idx, u in enumerate(urls):
        h = h.replace(f"__URL_PLACEHOLDER_{idx}__", u)

    # 5. Remove empty paragraphs
    h = re.sub(r"<p>\s*(?:&nbsp;|\s)*\s*</p>", "", h, flags=re.I)
    h = re.sub(r"\n{3,}", "\n\n", h)

    return h.strip()


def generate_clean_excerpt(content_html: str, max_length: int = 158) -> str:
    if not content_html:
        return ""
    cleaned = re.sub(r"<noscript>.*?</noscript>", " ", content_html, flags=re.I | re.S)
    cleaned = re.sub(r"<div id=['\"]video-container['\"].*?</div>\s*</div>", " ", cleaned, flags=re.I | re.S)
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", cleaned, flags=re.I | re.S)
    text_source = " ".join(paragraphs[:3]) if paragraphs else cleaned
    text = re.sub(r"<[^>]*>", " ", text_source)
    text = html.unescape(text).replace("Play on YouTube", " ")
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_length:
        return text
    truncated = text[:max_length]
    last_space = truncated.rfind(" ")
    if last_space > max_length * 0.6:
        truncated = truncated[:last_space]
    return truncated.rstrip(".,;: ") + "..."


def calculate_read_time(content_html: str) -> str:
    text = re.sub(r"<[^>]*>", " ", content_html)
    words = len(text.split())
    minutes = max(4, round(words / 210))
    return f"{minutes} min"


def main():
    print("📖 Parsing WordPress XML:", XML_PATH)
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    channel = root.find("channel")

    ns = {
        "wp": "http://wordpress.org/export/1.2/",
        "content": "http://purl.org/rss/1.0/modules/content/",
        "excerpt": "http://purl.org/rss/1.0/modules/excerpt/",
        "dc": "http://purl.org/dc/elements/1.1/",
    }

    # 1. Extract categories
    categories = []
    cat_by_slug = {}
    for cat_el in channel.findall("wp:category", namespaces=ns):
        cid = int(cat_el.findtext("wp:term_id", default="0", namespaces=ns))
        slug = (cat_el.findtext("wp:category_nicename", default="", namespaces=ns) or "").strip()
        raw_name = (cat_el.findtext("wp:cat_name", default="", namespaces=ns) or "").strip()
        parent = (cat_el.findtext("wp:category_parent", default="", namespaces=ns) or "").strip()
        desc = CATEGORY_DESCRIPTIONS.get(slug) or (cat_el.findtext("wp:category_description", default="", namespaces=ns) or "").strip()
        clean_name = CATEGORY_NAMES_CLEAN.get(slug, raw_name)
        cat_obj = {
            "id": cid,
            "slug": slug,
            "name": clean_name,
            "parent": parent,
            "description": desc,
            "count": 0,
        }
        categories.append(cat_obj)
        cat_by_slug[slug] = cat_obj

    # 2. First pass: collect attachments
    attachments = {}
    image_urls = set()
    for item in channel.findall("item"):
        pt = item.findtext("wp:post_type", default="", namespaces=ns)
        if pt == "attachment":
            pid = int(item.findtext("wp:post_id", default="0", namespaces=ns))
            url = (item.findtext("wp:attachment_url", default="", namespaces=ns) or "").strip()
            if url:
                attachments[pid] = url

    # Add Charlie Lingan author photos explicitly
    image_urls.add("https://equipajeordenado.com/wp-content/uploads/2025/04/Charlie-Lingan.jpg")
    image_urls.add("https://equipajeordenado.com/wp-content/uploads/2024/08/charlie-lingan-4.jpg")

    # 3. Second pass: collect posts and pages
    posts = []
    pages = []
    seen_titles = Counter()
    slug_redirects = []

    for item in channel.findall("item"):
        pt = item.findtext("wp:post_type", default="", namespaces=ns)
        st = item.findtext("wp:status", default="", namespaces=ns)
        if pt not in ("post", "page") or st != "publish":
            continue

        pid = int(item.findtext("wp:post_id", default="0", namespaces=ns))
        raw_title = item.findtext("title", default="") or ""
        slug = (item.findtext("wp:post_name", default="", namespaces=ns) or "").strip()
        date_str = (item.findtext("wp:post_date", default="", namespaces=ns) or "").strip()
        mod_str = (item.findtext("wp:post_modified", default="", namespaces=ns) or "").strip()
        raw_content = item.findtext("content:encoded", default="", namespaces=ns) or ""

        # Extract categories
        post_cats = []
        for c in item.findall("category"):
            if c.attrib.get("domain") == "category":
                c_slug = c.attrib.get("nicename", "").strip()
                c_name = CATEGORY_NAMES_CLEAN.get(c_slug, (c.text or "").strip())
                if c_slug:
                    post_cats.append({"slug": c_slug, "name": c_name})

        primary_cat = post_cats[0] if post_cats else {"slug": "guias", "name": "Guías de Equipaje"}

        # Featured image ID
        thumb_id = None
        for meta in item.findall("wp:postmeta", namespaces=ns):
            if meta.findtext("wp:meta_key", default="", namespaces=ns) == "_thumbnail_id":
                val = meta.findtext("wp:meta_value", default="", namespaces=ns)
                if val and val.isdigit():
                    thumb_id = int(val)
                break

        featured_url = attachments.get(thumb_id, "") if thumb_id else ""
        if featured_url:
            image_urls.add(featured_url)

        # Also extract inline wp-content image URLs
        for m in re.finditer(r"https?://equipajeordenado\.com/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)", raw_content, flags=re.I):
            image_urls.add(m.group(0))

        cleaned_html = clean_content(raw_content)
        cleaned_title = clean_evergreen_title(raw_title)

        if pt == "post":
            # Ensure unique title if a -2 post had identical title
            seen_titles[cleaned_title.lower()] += 1
            if seen_titles[cleaned_title.lower()] > 1:
                if "Guía Completa" in cleaned_title:
                    cleaned_title = cleaned_title.replace("Guía Completa", "Guía Práctica y Consejos")
                elif "Guía Definitiva" in cleaned_title:
                    cleaned_title = cleaned_title.replace("Guía Definitiva", "Recomendaciones y Consejos")
                else:
                    cleaned_title = f"{cleaned_title} — Guía Práctica"

        excerpt = generate_clean_excerpt(cleaned_html)
        read_time = calculate_read_time(cleaned_html)

        record = {
            "id": pid,
            "title": cleaned_title,
            "slug": slug,
            "category": primary_cat["slug"],
            "categoryName": primary_cat["name"],
            "categories": post_cats,
            "date": date_str,
            "modified": mod_str or date_str,
            "readTime": read_time,
            "content": cleaned_html,
            "excerpt": excerpt,
            "featuredImageId": thumb_id,
            "featuredImageUrl": featured_url,
            "type": pt,
            "status": st,
        }

        if pt == "page":
            pages.append(record)
        else:
            posts.append(record)

    # Fallback featured image for any post missing one
    category_sample_image = {}
    for p in posts:
        if p["featuredImageUrl"] and p["category"] not in category_sample_image:
            category_sample_image[p["category"]] = p["featuredImageUrl"]
    for p in posts:
        if not p["featuredImageUrl"]:
            p["featuredImageUrl"] = category_sample_image.get(p["category"], next(iter(category_sample_image.values()), ""))

    # Sort posts newest first
    posts.sort(key=lambda x: x["date"], reverse=True)

    # Count categories
    for c in categories:
        c["count"] = 0
    for p in posts:
        matched_slugs = {p["category"]} | {c["slug"] for c in p["categories"]}
        for s in matched_slugs:
            if s in cat_by_slug:
                cat_by_slug[s]["count"] += 1

    active_categories = [c for c in categories if c["count"] > 0]
    active_categories.sort(key=lambda x: x["count"], reverse=True)

    # Save JSON files
    with open(os.path.join(DATA_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(active_categories, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "image-urls.json"), "w", encoding="utf-8") as f:
        json.dump(sorted(image_urls), f, ensure_ascii=False, indent=2)

    # Save lightweight search-index.json in public/
    search_index = [
        {
            "t": p["title"],
            "s": p["slug"],
            "c": p["category"],
            "n": p["categoryName"],
            "r": p["readTime"],
        }
        for p in posts
    ]
    with open(os.path.join(PUBLIC_DIR, "search-index.json"), "w", encoding="utf-8") as f:
        json.dump(search_index, f, ensure_ascii=False)

    # Verify 0 years in titles and body text
    remaining_title_years = [p["title"] for p in posts if re.search(r"\b20[12]\d\b", p["title"])]
    remaining_body_years = 0
    for p in posts:
        no_urls = re.sub(r"https?://[^\s\"'<>]+", "", p["content"])
        if re.search(r"\b202[1-6]\b", no_urls):
            remaining_body_years += 1

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Published posts processed:      {len(posts)}")
    print(f"✅ Published pages processed:      {len(pages)}")
    print(f"✅ Active categories:              {len(active_categories)}")
    print(f"✅ Unique image URLs extracted:    {len(image_urls)}")
    print(f"✅ Search index items generated:   {len(search_index)}")
    print(f"✅ Titles with 201x/202x left:     {len(remaining_title_years)}")
    print(f"✅ Posts with 2021-2026 in body:   {remaining_body_years}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


if __name__ == "__main__":
    main()
