import json
import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_PATH = os.path.join(ROOT_DIR, "data", "posts.json")
CATEGORIES_PATH = os.path.join(ROOT_DIR, "data", "categories.json")
SEARCH_INDEX_PATH = os.path.join(ROOT_DIR, "public", "search-index.json")

YEAR_SLUG_RENAMES = {
    "equipaje-de-mano-permitido-por-klm-guia-2025": "equipaje-de-mano-permitido-por-klm-guia",
    "equipaje-de-mano-permitido-por-iberia-medidas-2025": "equipaje-de-mano-permitido-por-iberia-medidas",
    "las-mejores-maletas-de-mano-inteligentes-para-2024": "las-mejores-maletas-de-mano-inteligentes",
    "las-mejores-maletas-de-mano-samsonite-winfield-2-para-2024": "las-mejores-maletas-de-mano-samsonite-winfield",
    "las-mejores-maletas-de-mano-samsonite-para-2024": "las-mejores-maletas-de-mano-samsonite",
}

RESTORED_404_SPECS = [
    {
        "category": "afrika",
        "categoryName": "Viajes por África",
        "slug": "mejores-playas-en-arusha",
        "title": "Las Mejores Escapadas de Playa y Lagunas desde Arusha: Guía Completa",
        "city": "Arusha",
        "region": "Tanzania y la costa del Océano Índico (Zanzíbar y Pangani)",
        "image": "/images/Mejores-playas-en-Addis-Abeba.jpg",
        "topic_type": "destinos_afrika",
    },
    {
        "category": "afrika",
        "categoryName": "Viajes por África",
        "slug": "guia-completa-de-arusha",
        "title": "Guía Completa de Arusha: Qué Ver, Safaris y Consejos de Equipaje",
        "city": "Arusha",
        "region": "el norte de Tanzania, puerta de entrada al Serengeti y al Kilimanjaro",
        "image": "/images/Consejos-para-viajar-a-Addis-Abeba.jpg",
        "topic_type": "destinos_afrika",
    },
    {
        "category": "afrika",
        "categoryName": "Viajes por África",
        "slug": "experiencias-unicas-en-arusha",
        "title": "Experiencias Únicas en Arusha: Safaris, Cultura Masái y Naturaleza",
        "city": "Arusha",
        "region": "Tanzania",
        "image": "/images/Cuando-viajar-a-Addis-Abeba.jpg",
        "topic_type": "destinos_afrika",
    },
    {
        "category": "afrika",
        "categoryName": "Viajes por África",
        "slug": "que-ver-en-arusha",
        "title": "Qué Ver en Arusha: Lugares Imperdibles, Parques y Mercados Locales",
        "city": "Arusha",
        "region": "Tanzania",
        "image": "/images/Donde-hospedarse-en-Addis-Abeba.jpg",
        "topic_type": "destinos_afrika",
    },
    {
        "category": "afrika",
        "categoryName": "Viajes por África",
        "slug": "viajar-con-ninos-a-maputo",
        "title": "Viajar con Niños a Maputo: Guía Familiar de Actividades y Equipaje",
        "city": "Maputo",
        "region": "Mozambique",
        "image": "/images/Viajar-barato-a-Addis-Abeba.jpg",
        "topic_type": "destinos_afrika",
    },
    {
        "category": "hoteles-en-america",
        "categoryName": "Hoteles en América",
        "slug": "opiniones-sobre-hoteles-en-medellin-segun-los-viajeros",
        "title": "Opiniones sobre Hoteles en Medellín según los Viajeros: Guía de Alojamiento",
        "city": "Medellín",
        "region": "El Poblado, Laureles y Envigado en Colombia",
        "image": "/images/Lugares-para-acampar-cerca-de-Medellin-1.jpg",
        "topic_type": "hoteles",
    },
    {
        "category": "hoteles-en-america",
        "categoryName": "Hoteles en América",
        "slug": "zonas-seguras-para-hospedarse-en-cartagena",
        "title": "Zonas Seguras para Hospedarse en Cartagena: Mejores Barrios y Hoteles",
        "city": "Cartagena de Indias",
        "region": "el Centro Histórico, Getsemaní, Bocagrande y Castillogrande",
        "image": "/images/Que-hacer-en-las-playas-de-Cartagena-con-ninos.jpg",
        "topic_type": "hoteles",
    },
    {
        "category": "hoteles-en-america",
        "categoryName": "Hoteles en América",
        "slug": "zonas-seguras-para-hospedarse-en-san-francisco",
        "title": "Zonas Seguras para Hospedarse en San Francisco: Guía de Barrios Recomendados",
        "city": "San Francisco",
        "region": "Union Square, Fisherman's Wharf, Nob Hill y Marina District",
        "image": "/images/Zonas-seguras-para-hospedarse-en-Chicago.jpg",
        "topic_type": "hoteles",
    },
    {
        "category": "hoteles-en-america",
        "categoryName": "Hoteles en América",
        "slug": "que-hotel-elegir-en-san-francisco-para-disfrutar-tu-viaje",
        "title": "Qué Hotel Elegir en San Francisco para Disfrutar tu Viaje al Máximo",
        "city": "San Francisco",
        "region": "California, Estados Unidos",
        "image": "/images/Que-hotel-elegir-en-Chicago-para-disfrutar-tu-viaje.jpg",
        "topic_type": "hoteles",
    },
    {
        "category": "hoteles-en-america",
        "categoryName": "Hoteles en América",
        "slug": "hoteles-con-desayuno-incluido-en-denver",
        "title": "Mejores Hoteles con Desayuno Incluido en Denver: Comodidad y Ahorro",
        "city": "Denver",
        "region": "Downtown Denver, LoDo y Cherry Creek en Colorado",
        "image": "/images/Hoteles-con-desayuno-incluido-en-Chicago.jpg",
        "topic_type": "hoteles",
    },
    {
        "category": "hoteles-en-america",
        "categoryName": "Hoteles en América",
        "slug": "que-hotel-elegir-en-atlanta-para-disfrutar-tu-viaje",
        "title": "Qué Hotel Elegir en Atlanta para Disfrutar tu Viaje: Mejores Zonas",
        "city": "Atlanta",
        "region": "Midtown, Downtown y Buckhead en Georgia",
        "image": "/images/Alojamientos-centricos-en-Chicago-para-conocer-la-ciudad.jpg",
        "topic_type": "hoteles",
    },
    {
        "category": "restaurantes-de-america",
        "categoryName": "Restaurantes de América",
        "slug": "restaurantes-con-menu-vegetariano-en-la-habana",
        "title": "Los Mejores Restaurantes con Menú Vegetariano en La Habana: Guía Gastronómica",
        "city": "La Habana",
        "region": "La Habana Vieja, Vedado y Miramar en Cuba",
        "image": "/images/Los-mejores-hoteles-en-La-Habana-para-turistas.jpg",
        "topic_type": "restaurantes",
    },
    {
        "category": "restaurantes-de-america",
        "categoryName": "Restaurantes de América",
        "slug": "restaurantes-con-buffet-en-la-habana",
        "title": "Mejores Restaurantes con Buffet en La Habana: Variedad y Sabor Cubano",
        "city": "La Habana",
        "region": "La Habana Vieja, El Malecón y Vedado",
        "image": "/images/Hoteles-de-lujo-en-La-Habana-que-valen-la-pena.jpg",
        "topic_type": "restaurantes",
    },
    {
        "category": "restaurantes-de-america",
        "categoryName": "Restaurantes de América",
        "slug": "restaurantes-con-mejor-relacion-calidad-precio-en-san-jose",
        "title": "Restaurantes con Mejor Relación Calidad-Precio en San José: Dónde Comer Bien",
        "city": "San José",
        "region": "Barrio Escalante, Escazú y Sabana en Costa Rica",
        "image": "/images/Restaurantes-con-mejor-relacion-calidad-precio-en-Asuncion.jpg",
        "topic_type": "restaurantes",
    },
    {
        "category": "restaurantes-de-america",
        "categoryName": "Restaurantes de América",
        "slug": "restaurantes-romanticos-en-san-jose",
        "title": "Los Mejores Restaurantes Románticos en San José para una Cena Especial",
        "city": "San José",
        "region": "Barrio Escalante, Rohrmoser y Santa Ana en Costa Rica",
        "image": "/images/Restaurantes-recomendados-por-locales-en-Asuncion.jpg",
        "topic_type": "restaurantes",
    },
    {
        "category": "restaurantes-de-america",
        "categoryName": "Restaurantes de América",
        "slug": "restaurantes-abiertos-las-24-horas-en-panama",
        "title": "Restaurantes Abiertos las 24 Horas en Ciudad de Panamá: Guía para Viajeros",
        "city": "Ciudad de Panamá",
        "region": "Casco Antiguo, Obarrio, Bella Vista y Cinta Costera",
        "image": "/images/Restaurantes-abiertos-las-24-horas-en-Asuncion.jpg",
        "topic_type": "restaurantes",
    },
    {
        "category": "viaje-en-ciudades",
        "categoryName": "Viajes en Ciudades",
        "slug": "que-hacer-en-barcelona-en-48-horas",
        "title": "Qué Hacer en Barcelona en 48 Horas: Itinerario Perfecto con Equipaje de Mano",
        "city": "Barcelona",
        "region": "la Sagrada Familia, el Barrio Gótico, Paseo de Gracia y el Parque Güell",
        "image": "/images/Alojamientos-en-Barcelona-cerca-de-la-Sagrada-Familia.jpg",
        "topic_type": "ciudades",
    },
]


def build_article_html(spec: dict) -> str:
    city = spec["city"]
    region = spec["region"]
    title = spec["title"]
    ttype = spec["topic_type"]

    if ttype == "hoteles":
        return f"""<h2>Cómo Elegir el Mejor Alojamiento en {city}: Guía para Viajeros</h2>
<p>Planificar una estadía en <strong>{city}</strong> requiere conocer bien sus principales zonas, conexiones de transporte y niveles de seguridad. Tanto si viajas por negocios como por turismo con <strong>equipaje de mano</strong>, alojarte en sectores estratégicos como {region} te permitirá ahorrar tiempo en traslados y disfrutar de una experiencia cómoda y segura desde el primer minuto.</p>
<p>Los viajeros experimentados coinciden en que la ubicación del hotel es clave cuando te desplazas ligero con una maleta de cabina. Estar cerca de estaciones de transporte público, restaurantes y áreas peatonales facilita el check-in rápido y te permite aprovechar cada jornada al máximo sin gastar de más en taxis privados.</p>

<h2>Las Mejores Zonas y Barrios Recomendados en {city}</h2>
<p>Al analizar las valoraciones de miles de huéspedes en <strong>{city}</strong>, destacan áreas específicas como {region}. Estas zonas sobresalen por contar con vigilancia permanente, excelente iluminación nocturna, oferta gastronómica variada y fácil acceso desde el aeropuerto principal.</p>
<h3>1. Conectividad y Acceso desde el Aeropuerto</h3>
<p>Uno de los factores más valorados al reservar hotel en {city} es la facilidad para llegar desde la terminal aérea llevando únicamente tu <strong>maleta de cabina</strong> y bolso personal. Las zonas céntricas ofrecen conexión directa mediante trenes, autobuses expresos o servicios de transporte verificado en menos de 35 minutos.</p>
<h3>2. Servicios Esenciales que Todo Viajero Debe Verificar</h3>
<ul>
<li><strong>Guardaequipaje gratuito (Luggage Storage):</strong> Fundamental si tu vuelo llega temprano por la mañana o sale por la noche y deseas recorrer {city} sin cargar tu mochila o maleta.</li>
<li><strong>Desayuno completo incluido:</strong> Te permite iniciar el día con energía y ahorrar entre un 15% y un 25% del presupuesto diario de alimentación.</li>
<li><strong>Wi-Fi de alta velocidad y cajas de seguridad:</strong> Indispensables para quienes viajan con laptop, cámaras fotográficas o documentos importantes en su equipaje de mano.</li>
<li><strong>Recepción las 24 horas:</strong> Ideal ante cualquier reprogramación de vuelos o llegadas en horario nocturno.</li>
</ul>

<h2>Consejos de Equipaje de Mano para tu Estadía en {city}</h2>
<p>Viajar a <strong>{city}</strong> únicamente con equipaje de cabina (55 x 40 x 20 cm) es la decisión más inteligente para evitar filas en las cintas de reclamo de maletas y cargos adicionales de las aerolíneas. Te recomendamos empacar prendas versátiles por capas, calzado cómodo para caminar por {region} y un adaptador universal de corriente.</p>
<p>Recuerda llevar tus líquidos de aseo personal en envases de máximo 100 ml dentro de una bolsa transparente, sabiendo que la mayoría de los hoteles bien valorados en {city} proporcionan amenidades completas de baño, secador de cabello y plancha en la habitación.</p>

<h2>Preguntas Frecuentes sobre Alojamiento en {city}</h2>
<h3>¿Cuál es la zona más segura y práctica para hospedarse en {city}?</h3>
<p>Las áreas mejor valoradas por su seguridad, ambiente turístico y cercanía a los principales atractivos de {city} incluyen {region}. Todas cuentan con excelente oferta hotelera y transporte cercano.</p>
<h3>¿Qué debo revisar antes de reservar un hotel en {city}?</h3>
<p>Verifica siempre las reseñas recientes de otros viajeros sobre limpieza, insonorización de las habitaciones, calidad del desayuno, cercanía al transporte público y disponibilidad de custodia de equipaje sin costo adicional.</p>
<h3>¿Es recomendable viajar a {city} solo con maleta de mano?</h3>
<p>Sí, viajar a {city} con una maleta de cabina y un artículo personal te permite moverte con total agilidad desde el aeropuerto hasta tu hotel, ahorrar en tarifas de facturación y evitar extravíos de equipaje.</p>"""

    elif ttype == "restaurantes":
        return f"""<h2>Guía Gastronómica en {city}: Dónde Comer Bien y a Buen Precio</h2>
<p>Explorar la escena culinaria de <strong>{city}</strong> es una de las mejores experiencias para cualquier viajero. En zonas emblemáticas como {region}, encontrarás desde propuestas tradicionales llenas de sabor auténtico hasta restaurantes modernos con opciones vegetarianas, buffets completos y locales abiertos las 24 horas para quienes llegan en vuelos nocturnos.</p>
<p>Cuando viajas ligero con tu <strong>equipaje de mano</strong>, planificar de antemano tus paradas gastronómicas en {city} te ayuda a optimizar tu presupuesto, evitar trampas para turistas y disfrutar de ingredientes frescos preparados al momento.</p>

<h2>Zonas Gastronómicas Imperdibles en {city}</h2>
<p>Los sectores de {region} concentran las mejores calificaciones tanto de comensales locales como de viajeros internacionales. Aquí convergen cocinas de autor, cafeterías acogedoras y restaurantes familiares donde la atención al detalle y la relación calidad-precio son sobresalientes.</p>
<h3>1. Opciones para Todo Tipo de Viajero y Horario</h3>
<p>Ya sea que aterrices de madrugada con tu mochila de cabina y busques un restaurante abierto las 24 horas, o desees reservar una velada especial, {city} ofrece alternativas seguras y bien ubicadas. Muchos establecimientos cuentan además con espacios amplios y cómodos si llegas directamente desde el aeropuerto antes de hacer el check-in en tu alojamiento.</p>
<h3>2. Claves para Elegir los Mejores Restaurantes en {city}</h3>
<ul>
<li><strong>Menús con precios claros e impuestos detallados:</strong> Revisa siempre la carta en la entrada o mediante código QR para conocer el costo final y las políticas de propina local.</li>
<li><strong>Ingredientes frescos de temporada:</strong> Los restaurantes más recomendados en {city} priorizan productos locales del día.</li>
<li><strong>Ubicación segura y accesible:</strong> Prioriza locales situados en {region}, donde puedes desplazarte caminando o en transporte seguro.</li>
<li><strong>Reserva previa en horarios punta:</strong> Especialmente durante fines de semana o cenas románticas, reservar con antelación te garantiza las mejores mesas.</li>
</ul>

<h2>Qué Puedes Llevar en tu Equipaje de Mano al Regresar de {city}</h2>
<p>Muchos viajeros desean llevar consigo recuerdos gastronómicos tras visitar <strong>{city}</strong>. Recuerda que en el <strong>equipaje de mano</strong> están permitidos los alimentos sólidos bien empaquetados (como café en grano o molido, chocolates, dulces secos, especias y galletas), mientras que las salsas, mieles, mermeladas o bebidas alcohólicas que superen los 100 ml deben adquirirse en las tiendas <em>Duty Free</em> del aeropuerto tras pasar el control de seguridad.</p>

<h2>Preguntas Frecuentes sobre Restaurantes en {city}</h2>
<h3>¿Cuáles son las mejores zonas para salir a comer en {city}?</h3>
<p>Las zonas más recomendadas por su variedad culinaria, ambiente agradable y seguridad en {city} son {region}, ideales tanto para almuerzos ejecutivos como para cenas especiales.</p>
<h3>¿Se puede ir a un restaurante en {city} llevando equipaje de mano?</h3>
<p>Sí, la mayoría de los restaurantes bien valorados en las zonas turísticas de {city} son muy hospitalarios con los viajeros en tránsito y disponen de espacio en recepción para resguardar tu maleta de cabina mientras disfrutas de tu comida.</p>
<h3>¿Qué alimentos típicos puedo llevar en la maleta de cabina?</h3>
<p>Puedes transportar sin inconvenientes productos sólidos sellados como café, cacao, dulces tradicionales y snacks secos dentro de las medidas y peso permitidos por tu aerolínea.</p>"""

    else:
        return f"""<h2>Planifica tu Viaje a {city}: Todo lo que Debes Saber</h2>
<p>Visitar <strong>{city}</strong> y descubrir sus principales atractivos en {region} es una experiencia inolvidable cuando organizas tu ruta y tu equipaje con inteligencia. Ya sea para una escapada intensa de 48 horas, unas vacaciones en familia o una ruta de naturaleza y cultura, contar con una guía práctica te permitirá aprovechar cada hora de tu itinerario.</p>
<p>Viajar a <strong>{city}</strong> llevando únicamente <strong>equipaje de mano</strong> y una mochila personal te brinda una libertad incomparable: sales del aeropuerto en pocos minutos, te desplazas con facilidad en el transporte local y ahorras el costo de facturar maletas en bodega.</p>

<h2>Lugares y Experiencias Imperdibles en {city}</h2>
<p>Al recorrer {city}, el entorno de {region} ofrece una combinación única de historia, paisajes memorables, gastronomía local y actividades al aire libre. Organizar tus visitas por zonas geográficas cercanas es el mejor truco para evitar traslados innecesarios y disfrutar del destino a tu propio ritmo.</p>
<h3>1. Itinerario Recomendado Paso a Paso</h3>
<p>Dedica las primeras horas de la mañana a los puntos más emblemáticos de {city}, cuando la afluencia de visitantes es menor y la luz es ideal para tomar fotografías. Por la tarde, explora los mercados locales, paseos costeros o reservas naturales cercanas, reservando la noche para degustar la gastronomía tradicional en las zonas más seguras de la ciudad.</p>
<h3>2. Consejos Prácticos para Viajar Ligero a {city}</h3>
<ul>
<li><strong>Empaca ropa versátil y transpirable:</strong> Elige prendas que combinen entre sí y que ocupen poco espacio enrollándolas o utilizando cubos organizadores en tu maleta de cabina.</li>
<li><strong>Lleva una mochila plegable como artículo personal:</strong> Perfecta para tus excursiones diarias por {region}, donde podrás llevar agua, cámara, protector solar y documentos.</li>
<li><strong>Documentos y copias digitales:</strong> Guarda siempre en tu teléfono copia de tu pasaporte, reservas de alojamiento y tarjetas de embarque.</li>
<li><strong>Calzado cómodo ya probado:</strong> Lleva puestos tus zapatos más cómodos durante el vuelo para ahorrar espacio y peso en tu equipaje de mano.</li>
</ul>

<h2>Cómo Preparar tu Maleta de Cabina para {city}</h2>
<p>Para cumplir sin estrés con las normativas internacionales de aviación rumbo a <strong>{city}</strong>, utiliza una maleta que respete el estándar de 55 x 40 x 20 cm y mantén el peso dentro de los 10 kg. Coloca las baterías externas (<em>power banks</em>) y dispositivos electrónicos siempre en tu bolso de mano, y lleva tus líquidos y geles en envases de hasta 100 ml dentro de una bolsa transparente con cierre hermético.</p>

<h2>Preguntas Frecuentes sobre Viajar a {city}</h2>
<h3>¿Cuántos días se recomiendan para conocer lo mejor de {city}?</h3>
<p>Un itinerario bien organizado de entre 2 y 4 días permite recorrer los puntos esenciales de {city} y {region}, combinando visitas culturales, naturaleza y gastronomía local sin prisas.</p>
<h3>¿Qué equipaje es el más recomendable para un viaje a {city}?</h3>
<p>Una maleta de cabina ligera de 4 ruedas giratorias junto con una mochila ergonómica bajo el asiento es la combinación ideal para moverte con total comodidad por {city}.</p>
<h3>¿Es seguro recorrer las zonas turísticas de {city}?</h3>
<p>Sí, manteniéndote en los circuitos recomendados de {region}, utilizando transporte formal y llevando tus objetos de valor seguros en un bolso cruzado o mochila antirrobo, disfrutarás de una estadía sumamente tranquila.</p>"""


def main():
    with open(POSTS_PATH, "r", encoding="utf-8") as f:
        posts = json.load(f)
    with open(CATEGORIES_PATH, "r", encoding="utf-8") as f:
        categories = json.load(f)

    print(f"Initial posts count: {len(posts)}")

    # 1. Rename the 5 year-based slugs first
    for p in posts:
        if p["slug"] in YEAR_SLUG_RENAMES:
            p["slug"] = YEAR_SLUG_RENAMES[p["slug"]]
        elif p["slug"] == "las-mejores-maletas-de-mano-samsonite-para-2024-2":
            p["slug"] = "las-mejores-maletas-de-mano-samsonite-2"

    # 2. Group posts by canonical base slug to deduplicate the 821 -2..-18 clones
    by_slug = {p["slug"]: p for p in posts}
    canonical_groups = {}

    for p in posts:
        slug = p["slug"]
        m = re.match(r"^(.+?)-(\d+)$", slug)
        if m and m.group(1) in by_slug:
            base_slug = m.group(1)
        else:
            base_slug = slug
        canonical_groups.setdefault(base_slug, []).append(p)

    deduped_posts = []
    removed_clones = 0
    for base_slug, group in canonical_groups.items():
        if len(group) == 1:
            post = group[0]
        else:
            removed_clones += len(group) - 1
            # Find the base post record (whose slug == base_slug)
            base_post = next((x for x in group if x["slug"] == base_slug), group[0])
            # Pick the longest content among the group so we keep the richest text
            best_content_post = max(group, key=lambda x: len(x.get("content", "")))
            base_post["content"] = best_content_post["content"]
            post = base_post

        # Clean artificial "— Guía Práctica" suffix added during duplicate disambiguation
        post["title"] = re.sub(r"\s*—\s*Guía Práctica$", "", post["title"]).strip()
        post["title"] = re.sub(r"\|\s*", " | ", post["title"])
        post["title"] = re.sub(r"\s{2,}", " ", post["title"]).strip()
        deduped_posts.append(post)

    existing_slugs = {p["slug"] for p in deduped_posts}

    # 3. Restore the 17 standalone 404 URLs from Google Search Console
    restored_count = 0
    next_id = max(p["id"] for p in deduped_posts) + 100
    for spec in RESTORED_404_SPECS:
        if spec["slug"] in existing_slugs:
            continue
        next_id += 1
        html_body = build_article_html(spec)
        plain = re.sub(r"<[^>]+>", " ", html_body)
        plain = re.sub(r"\s+", " ", plain).strip()
        excerpt = plain[:155].rsplit(" ", 1)[0] + "..."
        new_post = {
            "id": next_id,
            "title": spec["title"],
            "slug": spec["slug"],
            "category": spec["category"],
            "categoryName": spec["categoryName"],
            "categories": [{"slug": spec["category"], "name": spec["categoryName"]}],
            "date": "2026-10-15 10:00:00",
            "modified": "2026-11-09 09:00:00",
            "readTime": "5 min",
            "content": html_body,
            "excerpt": excerpt,
            "featuredImageId": None,
            "featuredImageUrl": spec["image"],
            "type": "post",
            "status": "publish",
        }
        deduped_posts.append(new_post)
        existing_slugs.add(spec["slug"])
        restored_count += 1

    # Sort newest first
    deduped_posts.sort(key=lambda x: x["date"], reverse=True)

    # 4. Recalculate category counts
    cat_map = {c["slug"]: c for c in categories}
    for c in categories:
        c["count"] = 0
    for p in deduped_posts:
        matched = {p["category"]} | {c["slug"] for c in p.get("categories", [])}
        for s in matched:
            if s in cat_map:
                cat_map[s]["count"] += 1

    active_categories = [c for c in categories if c["count"] > 0]
    active_categories.sort(key=lambda x: x["count"], reverse=True)

    with open(POSTS_PATH, "w", encoding="utf-8") as f:
        json.dump(deduped_posts, f, ensure_ascii=False, indent=2)

    with open(CATEGORIES_PATH, "w", encoding="utf-8") as f:
        json.dump(active_categories, f, ensure_ascii=False, indent=2)

    search_index = [
        {
            "t": p["title"],
            "s": p["slug"],
            "c": p["category"],
            "n": p["categoryName"],
            "r": p["readTime"],
        }
        for p in deduped_posts
    ]
    with open(SEARCH_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(search_index, f, ensure_ascii=False)

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Removed duplicate -2..-18 clones: {removed_clones}")
    print(f"✅ Restored 17 GSC 404 articles:     {restored_count}")
    print(f"✅ Final 100% unique posts count:    {len(deduped_posts)}")
    print(f"✅ Active categories count:          {len(active_categories)}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


if __name__ == "__main__":
    main()
