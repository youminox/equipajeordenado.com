export const AMAZON_TAG_US = "equipajeordenado-20";
export const AMAZON_TAG_ES = "equipajeordenado-21";

export type AmazonStoreRegion = "ES" | "US";

export interface AmazonProductRecommendation {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  features: string[];
  categoryType:
    | "suitcase"
    | "backpack"
    | "liquids"
    | "scale"
    | "security"
    | "electronics"
    | "comfort"
    | "cubes";
  /** Direct ASIN on Amazon.com if fixed product */
  asinUS?: string;
  /** Direct ASIN on Amazon.es if fixed product */
  asinES?: string;
  /** Search query on Amazon.com */
  queryUS: string;
  /** Search query on Amazon.es */
  queryES: string;
  ctaLabel: string;
}

/**
 * Generates an official Amazon Affiliate link with automatic geolocation store support:
 * - Spain & Europe (ES): amazon.es with tag=equipajeordenado-21
 * - USA & Latin America (US): amazon.com with tag=equipajeordenado-20
 */
export function buildAmazonUrl(
  product: AmazonProductRecommendation,
  region: AmazonStoreRegion
): string {
  if (region === "ES") {
    if (product.asinES) {
      return `https://www.amazon.es/dp/${product.asinES}?tag=${AMAZON_TAG_ES}`;
    }
    const q = encodeURIComponent(product.queryES);
    return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG_ES}`;
  }

  if (product.asinUS) {
    return `https://www.amazon.com/dp/${product.asinUS}?tag=${AMAZON_TAG_US}`;
  }
  const q = encodeURIComponent(product.queryUS);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG_US}`;
}

/**
 * Detects whether the user is browsing from Spain/Europe or Americas
 * based on browser timezone and language locale.
 */
export function detectUserAmazonRegion(): AmazonStoreRegion {
  if (typeof window === "undefined") {
    return "ES";
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();

    if (
      tz === "Europe/Madrid" ||
      tz === "Atlantic/Canary" ||
      tz === "Europe/Ceuta" ||
      lang === "es-es"
    ) {
      return "ES";
    }

    if (tz.startsWith("Europe/")) {
      return "ES";
    }

    return "US";
  } catch {
    return "ES";
  }
}

// ============================================================================
// CURATED CABIN LUGGAGE & TRAVEL GEAR CATALOG (AMAZON.ES & AMAZON.COM)
// ============================================================================

export const CATALOG = {
  SUITCASE_CABIN_55X40X20: {
    id: "suitcase-cabin-55x40x20",
    badge: "🏆 #1 Maleta de Cabina Universal",
    title:
      "Maleta de Cabina Rígida 55×40×20 cm Ultraligera con 4 Ruedas Dobles 360° y Candado TSA",
    subtitle:
      "Cumple con las medidas estándar IATA aceptadas en Iberia, Ryanair Priority, Vueling, LATAM, Air Europa y +20 aerolíneas.",
    features: [
      "Dimensiones exteriores exactas 55 × 40 × 20 cm (incluyendo ruedas y asas) · Capacidad 40L",
      "Carcasa rígida antirrayaduras con cerradura de combinación TSA integrada en el lateral",
      "Interior dividido en 2 compartimentos con malla con cremallera y cintas elásticas cruzadas",
    ],
    categoryType: "suitcase",
    queryES: "maleta cabina 55x40x20 rigida 4 ruedas candado TSA",
    queryUS: "carry on luggage 21x14x9 hardshell spinner TSA lock",
    ctaLabel: "Ver maleta 55×40×20 en Amazon",
  } satisfies AmazonProductRecommendation,

  SUITCASE_CABIN_55X35X20: {
    id: "suitcase-cabin-55x35x20",
    badge: "✈️ 100% Compatible LATAM / Avianca / Air Europa",
    title:
      "Maleta de Mano Rígida 55×35×20 cm Compacta — Aprobada en Todas las Aerolíneas",
    subtitle:
      "El formato compacto de 35 cm de ancho que entra sin fricción incluso en los medidores más estrictos de Sudamérica, EE. UU. y Europa.",
    features: [
      "Diseño ligero (2.4 kg en vacío) para aprovechar al máximo los 8 a 12 kg permitidos en cabina",
      "4 ruedas dobles silenciosas con giro multidireccional 360° para pasillos de avión estrechos",
      "Cierre de seguridad TSA aprobado para vuelos internacionales a EE. UU. y Europa",
    ],
    categoryType: "suitcase",
    queryES: "maleta cabina 55x35x20 rigida ligera TSA",
    queryUS: "carry on luggage 21x13x8 hardshell spinner lightweight",
    ctaLabel: "Ver maleta universal en Amazon",
  } satisfies AmazonProductRecommendation,

  BACKPACK_UNDERSEAT_40X20X25: {
    id: "backpack-underseat-40x20x25",
    badge: "🎒 #1 Gratis Bajo el Asiento (Sin Pagar Extra)",
    title:
      "Mochila de Cabina Bajo Asiento 40×20×25 / 40×30×20 cm (Apertura 180° Tipo Maleta)",
    subtitle:
      "Diseñada al milímetro para viajar gratis en la tarifa básica de Ryanair, Vueling, easyJet, JetSMART, Sky, Volaris y LATAM.",
    features: [
      "Se abre 180° como una maleta con correas de sujeción, bolsillo húmedo y funda para laptop 15.6\"",
      "Banda trasera para acoplar al asa del trolley + bolsillo antirrobo oculto en la espalda",
      "Pasa gratis como artículo personal bajo el asiento delantero sin pagar suplemento de cabina",
    ],
    categoryType: "backpack",
    queryES: "mochila viaje cabina avion 40x20x25 40x30x20 apertura maleta",
    queryUS: "personal item travel backpack 18x14x8 underseat airline approved",
    ctaLabel: "Ver mochila bajo asiento en Amazon",
  } satisfies AmazonProductRecommendation,

  BACKPACK_CABIN_40L: {
    id: "backpack-cabin-40l",
    badge: "🧭 Favorita de Nómadas y Viajes de 7-14 Días",
    title:
      "Mochila de Viaje de Cabina 40L Expandible Impermeable con Apertura 180° y Puerto USB",
    subtitle:
      "La máxima capacidad permitida en el compartimento superior (55×35×20 cm) sin el peso muerto de las ruedas.",
    features: [
      "Capacidad real de 40 litros con compartimento independiente para calzado y bolsillo húmedo",
      "Tirantes ergonómicos acolchados ocultables y correas laterales de compresión",
      "Incluye compartimento acolchado para portátil de hasta 17 pulgadas",
    ],
    categoryType: "backpack",
    queryES: "mochila viaje cabina 40L equipaje de mano avion 55x40x20",
    queryUS: "40L carry on travel backpack flight approved expandible",
    ctaLabel: "Ver mochila de 40L en Amazon",
  } satisfies AmazonProductRecommendation,

  PACKING_CUBES_COMPRESSOR: {
    id: "packing-cubes-compressor",
    badge: "📦 Ahorra 40% de Espacio en tu Maleta",
    title:
      "Set de 6/8 Cubos Organizadores Compresores de Equipaje con Doble Cremallera",
    subtitle:
      "El secreto de los viajeros frecuentes para meter 10 días de ropa en una maleta de mano de 10 kg sin arrugas.",
    features: [
      "Cremallera exterior de compresión que expulsa el aire entre las prendas sin necesidad de aspiradora",
      "Tejido ultraligero Ripstop impermeable que no suma peso a tu franquicia de cabina",
      "Incluye cubos para camisetas, pantalones, ropa interior, bolsa de lavandería y bolsa de zapatos",
    ],
    categoryType: "cubes",
    queryES: "cubos organizadores maleta compresion viaje equipaje",
    queryUS: "compression packing cubes for carry on luggage travel",
    ctaLabel: "Ver cubos compresores en Amazon",
  } satisfies AmazonProductRecommendation,

  VACUUM_ROLL_BAGS: {
    id: "vacuum-roll-bags",
    badge: "🌀 Compresión al Vacío Sin Aspiradora",
    title:
      "Pack de 10 Bolsas de Compresión al Vacío Enrollables a Mano para Viaje y Maleta",
    subtitle:
      "Ideales para casacas, chompas, ropa de invierno o viajes largos: solo enrollas la bolsa y el aire sale por la válvula unidireccional.",
    features: [
      "No requieren bomba ni aspiradora: se comprimen en 15 segundos enrollándolas con las manos",
      "Reducen hasta un 60% el volumen de prendas abultadas y protegen de humedad u olores",
      "Tamaño mediano y grande adaptado exactamente a maletas de cabina de 55 cm",
    ],
    categoryType: "cubes",
    queryES: "bolsas vacio ropa viaje enrollables sin aspiradora maleta",
    queryUS: "travel space saver bags roll up no vacuum needed carry on",
    ctaLabel: "Ver bolsas enrollables en Amazon",
  } satisfies AmazonProductRecommendation,

  LIQUIDS_BAG_TSA_100ML: {
    id: "liquids-bag-tsa-100ml",
    badge: "💧 Homologado Control TSA / Unión Europea",
    title:
      "Neceser Transparente Avión 1 Litro (20×20 cm) + Set de Botes de Silicona 100 ml Antifugas",
    subtitle:
      "Pasa el escáner de seguridad en segundos sin que te confisquen perfumes, champú, cremas ni pasta dental.",
    features: [
      "Bolsa de PVC transparente reforzada con cierre hermético que cumple la norma 20 × 20 cm (1 L)",
      "Incluye botellas de silicona de 100 ml con válvula antigoteo, tarros para cremas y etiquetas",
      "Reutilizable, lavable y mucho más resistente que las bolsas zip desechables",
    ],
    categoryType: "liquids",
    queryES: "neceser transparente avion 100ml homologado botes silicona viaje",
    queryUS: "TSA approved toiletry bag quart size leakproof 3.4 oz travel bottles",
    ctaLabel: "Ver kit de líquidos 100 ml en Amazon",
  } satisfies AmazonProductRecommendation,

  PERFUME_ATOMIZER_PACK: {
    id: "perfume-atomizer-pack",
    badge: "✨ Lleva tu Perfume Favorito en Cabina",
    title:
      "Pack de 4 Atomizadores de Perfume Recargables de Viaje (5 ml / 8 ml Aprobados en Avión)",
    subtitle:
      "No arriesgues tu frasco de perfume de 100+ ml en el aeropuerto: recarga en 5 segundos por bombeo inferior sin embudos.",
    features: [
      "Válvula inferior de recarga directa desde cualquier perfume estándar sin derramar una gota",
      "Carcasa de aluminio anodizado irrompible con ventana para ver el nivel restante",
      "Rinde ~70 pulverizaciones por envase y ocupa menos que un lápiz labial en tu bolsa de 1 L",
    ],
    categoryType: "liquids",
    queryES: "atomizador perfume recargable viaje avion pack 4",
    queryUS: "refillable perfume atomizer travel size 5ml pack of 4 TSA",
    ctaLabel: "Ver atomizadores de viaje en Amazon",
  } satisfies AmazonProductRecommendation,

  LUGGAGE_SCALE_DIGITAL: {
    id: "luggage-scale-digital",
    badge: "⚖️ Evita Multas de precio variable en Amazon en Puerta",
    title:
      "Báscula Digital Portátil para Maletas de Viaje (Hasta 50 kg / 110 lb con Pantalla LCD)",
    subtitle:
      "Pesa tu maleta de cabina y tu mochila en casa y en el hotel antes del vuelo de regreso para no pagar exceso de peso.",
    features: [
      "Sensor de alta precisión (graduación de 10 g / 0.02 lb) con función Tara y bloqueo de peso",
      "Correa de nylon trenzado con gancho de acero inoxidable que no raya el asa de la maleta",
      "Pesa solo 85 gramos: cabe en el bolsillo exterior de tu maleta para el viaje de vuelta",
    ],
    categoryType: "scale",
    queryES: "bascula digital maletas viaje portatil 50kg equipaje",
    queryUS: "digital luggage scale portable 110 lbs travel hanging scale",
    ctaLabel: "Ver báscula de maletas en Amazon",
  } satisfies AmazonProductRecommendation,

  TSA_LOCK_2PACK: {
    id: "tsa-lock-2pack",
    badge: "🔒 Seguridad Oficial Travel Sentry (TSA)",
    title:
      "Pack de 2 Candados Homologados TSA de 4 Dígitos con Cable de Acero Flexible",
    subtitle:
      "Protege tu maleta de mano y mochila contra robos en cabina, bodega y hoteles sin que aduanas rompa tu cierre.",
    features: [
      "Certificación oficial TSA (rombo rojo): permite inspección de seguridad sin dañar el candado",
      "Cable de acero trenzado flexible que pasa fácilmente por cierres dobles de maletas y mochilas",
      "10.000 combinaciones numéricas configurables en segundos sin necesidad de llaves",
    ],
    categoryType: "security",
    queryES: "candado TSA maleta viaje cable acero combinacion pack 2",
    queryUS: "TSA approved luggage locks 4 digit cable lock 2 pack",
    ctaLabel: "Ver candados TSA en Amazon",
  } satisfies AmazonProductRecommendation,

  LUGGAGE_TRACKER_GPS: {
    id: "luggage-tracker-gps",
    badge: "📍 Localiza tu Maleta en Tiempo Real",
    title:
      "Localizador Inteligente para Equipaje (Compatible Apple Buscar / Android) + Funda Llavero",
    subtitle:
      "Sabrás exactamente dónde está tu maleta desde tu móvil si la aerolínea la envía a bodega en puerta o en una escala.",
    features: [
      "Rastreo global en aeropuertos de todo el mundo directamente desde la app de tu teléfono",
      "Batería reemplazable de hasta 1 año de duración (cumple al 100% normativa aérea IATA)",
      "Altavoz integrado para hacerlo sonar al recoger o buscar tu equipaje",
    ],
    categoryType: "security",
    queryES: "localizador rastreador maletas equipaje AirTag compatible viaje",
    queryUS: "luggage tracker tag smart tracker for suitcases travel",
    ctaLabel: "Ver rastreador de maletas en Amazon",
  } satisfies AmazonProductRecommendation,

  RFID_TRAVEL_WALLET: {
    id: "rfid-travel-wallet",
    badge: "🛡️ Protección de Pasaporte y Tarjetas",
    title:
      "Riñonera Interior Oculta & Portapasaporte Antirrobo con Bloqueo RFID Impermeable",
    subtitle:
      "Guarda tu pasaporte, tarjetas de embarque, tarjetas bancarias y efectivo ocultos bajo la ropa contra carteristas.",
    features: [
      "Malla de bloqueo RFID certificada que impide el clonado inalámbrico de tarjetas y pasaporte",
      "Diseño ultrafino transpirable con correa elástica suave para llevar bajo la camisa",
      "Bolsillos con cremallera organizados para monedas, billetes, móvil y llaves",
    ],
    categoryType: "security",
    queryES: "rinonera oculta viaje antirrobo RFID portapasaporte",
    queryUS: "RFID money belt travel hidden passport holder under clothes",
    ctaLabel: "Ver portapasaporte RFID en Amazon",
  } satisfies AmazonProductRecommendation,

  POWER_BANK_20000_CABIN: {
    id: "power-bank-20000-cabin",
    badge: "🔋 74 Wh — 100% Aprobado en Cabina IATA/TSA",
    title:
      "Power Bank 20.000 mAh Carga Rápida USB-C PD (22.5W) con Capacidad Impresa para Avión",
    subtitle:
      "Por debajo del límite legal de 100 Wh (27.000 mAh): carga tu móvil 4 veces durante vuelos largos, escalas y excursiones.",
    features: [
      "Capacidad de 74 Wh claramente serigrafiada en la carcasa (requisito de los controles aeroportuarios)",
      "Puerto USB-C bidireccional Power Delivery + 2 salidas USB-A para cargar 3 equipos a la vez",
      "Protección térmica multicapa homologada para viajar en cabina de avión",
    ],
    categoryType: "electronics",
    queryES: "power bank 20000mAh carga rapida USB C avion cabina",
    queryUS: "power bank 20000mAh USB C fast charging airline approved",
    ctaLabel: "Ver power bank de cabina en Amazon",
  } satisfies AmazonProductRecommendation,

  UNIVERSAL_TRAVEL_ADAPTER: {
    id: "universal-travel-adapter",
    badge: "🌍 Funciona en +150 Países (UE / USA / UK / Asia)",
    title:
      "Adaptador de Enchufe Universal de Viaje Internacional con 3 USB-C + 2 USB-A Carga Rápida",
    subtitle:
      "Un solo cubo compacto en tu maleta de mano para conectar tus equipos en Estados Unidos, Europa, Reino Unido, Japón, Perú o Australia.",
    features: [
      "Clavijas retráctiles integradas Tipo C (Europa), Tipo A/B (USA/Latam), Tipo G (UK) y Tipo I",
      "Carga hasta 6 dispositivos simultáneamente (enchufe AC + puertos USB-C y USB-A)",
      "Doble fusible de seguridad contra sobretensiones y tamaño ultracompacto",
    ],
    categoryType: "electronics",
    queryES: "adaptador enchufe universal viaje internacional USB C",
    queryUS: "universal travel adapter international all in one USB C",
    ctaLabel: "Ver adaptador universal en Amazon",
  } satisfies AmazonProductRecommendation,

  ELECTRONICS_ORGANIZER_BAG: {
    id: "electronics-organizer-bag",
    badge: "🔌 Adiós a los Cables Enredados en Rayos X",
    title:
      "Estuche Organizador Impermeable para Cables, Cargadores, Power Bank, Memorias y AirPods",
    subtitle:
      "Mantén todos tus accesorios electrónicos ordenados en un solo estuche acolchado dentro de tu mochila personal.",
    features: [
      "Bandas elásticas, bolsillos de malla con cierre y divisores acolchados ajustables",
      "Exterior impermeable antigolpes que cabe en cualquier mochila bajo el asiento",
      "Permite pasar el control de seguridad del aeropuerto sin vaciar cables sueltos en la bandeja",
    ],
    categoryType: "electronics",
    queryES: "organizador cables viaje estuche accesorios electronicos",
    queryUS: "electronics organizer travel case cable storage bag",
    ctaLabel: "Ver organizador de cables en Amazon",
  } satisfies AmazonProductRecommendation,

  TRAVEL_PILLOW_MEMORY_FOAM: {
    id: "travel-pillow-memory-foam",
    badge: "😴 Duerme en Clase Turista sin Dolor de Cuello",
    title:
      "Almohada de Viaje Cervical Viscoelástica (Memory Foam 360°) + Antifaz 3D + Tapones",
    subtitle:
      "Soporte ergonómico de barbilla y nuca que evita que la cabeza caiga hacia adelante en vuelos largos y nocturnos.",
    features: [
      "Espuma viscoelástica de alta densidad que se comprime a la mitad en su bolsa con mosquetón",
      "Se engancha por fuera de la mochila personal sin ocupar espacio dentro de tu maleta de 10 kg",
      "Funda transpirable extraíble y lavable + antifaz opaco y tapones antirruido incluidos",
    ],
    categoryType: "comfort",
    queryES: "almohada viaje avion cervical viscoelastica antifaz",
    queryUS: "memory foam travel neck pillow airplane kit 360 support",
    ctaLabel: "Ver almohada de vuelo en Amazon",
  } satisfies AmazonProductRecommendation,

  FLIGHT_COMPRESSION_SOCKS: {
    id: "flight-compression-socks",
    badge: "🦵 Imprescindible en Vuelos de +4 Horas",
    title:
      "Pack de 3 Pares de Medias de Compresión Graduada para Avión y Viajes Largos",
    subtitle:
      "Mejoran la circulación sanguínea en cabina presurizada y evitan los pies y tobillos hinchados al aterrizar.",
    features: [
      "Compresión graduada (15-20 mmHg) recomendada para vuelos transatlánticos y caminatas",
      "Tejido transpirable antibacteriano que mantiene los pies secos y cómodos",
      "Ideales también para recorrer ciudades a pie durante todo el viaje",
    ],
    categoryType: "comfort",
    queryES: "medias calcetines compresion viaje avion vuelos largos",
    queryUS: "compression socks for flying travel flight 15-20 mmHg",
    ctaLabel: "Ver medias de vuelo en Amazon",
  } satisfies AmazonProductRecommendation,

  MEDICINE_TRAVEL_ORGANIZER: {
    id: "medicine-travel-organizer",
    badge: "💊 Botiquín de Cabina Ordenado y Seguro",
    title:
      "Neceser Botiquín Organizador de Medicamentos de Viaje Impermeable + Pastillero Semanal",
    subtitle:
      "Lleva tus medicamentos con receta, analgésicos, termómetro, tiritas e inhaladores organizados y protegidos en cabina.",
    features: [
      "Compartimentos transparentes con cierre para que el control de seguridad vea los envases originales",
      "Aislamiento interior que protege los medicamentos de cambios bruscos de temperatura en el avión",
      "Tamaño compacto que cabe en tu artículo personal bajo el asiento para acceso inmediato",
    ],
    categoryType: "liquids",
    queryES: "botiquin viaje organizador medicamentos neceser pastillero",
    queryUS: "travel medicine organizer bag first aid pill case carry on",
    ctaLabel: "Ver organizador de medicinas en Amazon",
  } satisfies AmazonProductRecommendation,

  BABY_TRAVEL_BACKPACK: {
    id: "baby-travel-backpack",
    badge: "👶 Viajar con Bebés y Niños en Cabina",
    title:
      "Mochila Pañalera de Viaje para Avión con Cambiador Plegable y Bolsillos Térmicos para Biberones",
    subtitle:
      "Todo lo que tu bebé necesita a bordo (pañales, biberones, papillas, toallitas y mudas) en una mochila que cabe bajo el asiento.",
    features: [
      "3 bolsillos térmicos revestidos en aluminio para conservar la leche o papilla a temperatura ideal",
      "Correas para enganchar al cochecito de bebé y banda trasera para sujetar a la maleta de mano",
      "Apertura amplia de fácil acceso durante el vuelo con una sola mano",
    ],
    categoryType: "backpack",
    queryES: "mochila panalera viaje bebe cambiador biberones avion",
    queryUS: "diaper bag backpack travel airplane baby stroller straps",
    ctaLabel: "Ver mochila para bebés en Amazon",
  } satisfies AmazonProductRecommendation,

  KIDS_RIDE_ON_SUITCASE: {
    id: "kids-ride-on-suitcase",
    badge: "🧒 Maleta Infantil de Cabina Montable",
    title:
      "Maleta Infantil de Equipaje de Mano Montable (Correlinguas) con Ruedas y Correa de Arrastre",
    subtitle:
      "Cumple las medidas de cabina y permite llevar al niño sentado por los pasillos largos del aeropuerto sin cansarse.",
    features: [
      "Homologada como equipaje de mano en cabina (guarda su ropa, juguetes y manta de vuelo)",
      "Estructura rígida ultrarresistente que soporta el peso del niño como asiento en colas de embarque",
      "Incluye correa para tirar cómodamente o llevar al hombro",
    ],
    categoryType: "suitcase",
    queryES: "maleta infantil montable cabina avion ninos correlinguas",
    queryUS: "kids ride on suitcase carry on luggage for toddlers airplane",
    ctaLabel: "Ver maleta infantil en Amazon",
  } satisfies AmazonProductRecommendation,

  LUGGAGE_COVER_TAGS: {
    id: "luggage-cover-tags",
    badge: "🛡️ Protege tu Maleta de Rayones y Golpes",
    title:
      "Funda Protectora Elástica Lavable para Maleta de Cabina (18-21\") + Etiquetas de Identificación",
    subtitle:
      "Mantén tu maleta como nueva frente a roces en compartimentos superiores o si la envían a bodega en puerta.",
    features: [
      "Tejido spandex de alto gramaje con aberturas exactas para asas superiores y laterales",
      "Cierre inferior con cremallera y hebilla elástica que no bloquea las 4 ruedas 360°",
      "Color y diseño fácil de identificar al instante para que nadie confunda tu maleta",
    ],
    categoryType: "suitcase",
    queryES: "funda protectora maleta cabina talla S elastica etiquetas",
    queryUS: "carry on luggage cover protector washable 18-21 inch",
    ctaLabel: "Ver funda protectora en Amazon",
  } satisfies AmazonProductRecommendation,
};

// ============================================================================
// DYNAMIC LUGGAGE BRAND & AIRLINE DETECTORS (COVERS ALL 1,845 PAGES)
// ============================================================================

interface BrandLuggageEntry {
  keywords: string[];
  brandName: string;
  highlight: string;
  queryES: string;
  queryUS: string;
}

const BRAND_LUGGAGE_MAP: BrandLuggageEntry[] = [
  {
    keywords: ["samsonite"],
    brandName: "Samsonite",
    highlight:
      "Modelos oficiales Samsonite de cabina (55×40×20 cm): S'Cure, Base Boost, Flux, Lite-Shock y Neopulse con garantía internacional.",
    queryES: "maleta cabina Samsonite 55x40x20",
    queryUS: "Samsonite carry on luggage spinner 20 21 inch",
  },
  {
    keywords: ["american-tourister", "american tourister"],
    brandName: "American Tourister",
    highlight:
      "La famosa American Tourister Soundbox Spinner 55 cm (expandible, candado TSA y 4 ruedas dobles) y línea Bon Air / Airconic.",
    queryES: "American Tourister Soundbox maleta cabina 55x40x20",
    queryUS: "American Tourister carry on luggage spinner 20 inch",
  },
  {
    keywords: ["cabin-max", "cabin max"],
    brandName: "Cabin Max",
    highlight:
      "Mochilas y maletas Cabin Max (Metz, Manhattan, Anode) diseñadas específicamente para las jaulas medidoras de Ryanair, easyJet y Vueling.",
    queryES: "Cabin Max mochila maleta cabina 40x20x25 55x40x20",
    queryUS: "Cabin Max Metz underseat backpack carry on luggage",
  },
  {
    keywords: ["travelpro"],
    brandName: "Travelpro",
    highlight:
      "Travelpro Maxlite 5 y Platinum Elite Carry-On: la marca elegida por pilotos y tripulaciones de cabina en todo el mundo.",
    queryES: "Travelpro Maxlite 5 maleta cabina",
    queryUS: "Travelpro Maxlite 5 carry on spinner luggage",
  },
  {
    keywords: ["aerolite"],
    brandName: "Aerolite",
    highlight:
      "Maletas ultraligeras Aerolite ABS y mochilas bajo asiento homologadas para aerolíneas europeas e internacionales.",
    queryES: "Aerolite maleta cabina 55x40x20",
    queryUS: "Aerolite carry on luggage suitcase",
  },
  {
    keywords: ["delsey"],
    brandName: "Delsey Paris",
    highlight:
      "Maletas francesas Delsey Paris con cremallera antirrobo patentada SECURITECH de doble capa y cerradura TSA integrada.",
    queryES: "Delsey Paris maleta cabina 55 cm",
    queryUS: "Delsey Paris carry on luggage spinner",
  },
  {
    keywords: ["roncato"],
    brandName: "Roncato",
    highlight:
      "Diseño italiano Roncato (Box, Light, We Are, Ironik): carcasa de polipropileno flexible ultraligero y resistente a impactos.",
    queryES: "Roncato maleta cabina 55x40x20",
    queryUS: "Roncato carry on spinner suitcase",
  },
  {
    keywords: ["victorinox"],
    brandName: "Victorinox",
    highlight:
      "Ingeniería suiza Victorinox (Spectra, Airox, Werks Traveler): policarbonato virgen Bayer y organización ejecutiva para viajeros frecuentes.",
    queryES: "Victorinox maleta cabina equipaje mano",
    queryUS: "Victorinox carry on luggage spinner",
  },
  {
    keywords: ["tumi"],
    brandName: "Tumi",
    highlight:
      "Maletas y mochilas de cabina de alta gama Tumi Alpha y 19 Degree en nylon balístico FXT y policarbonato.",
    queryES: "Tumi maleta cabina mochila viaje",
    queryUS: "Tumi Alpha carry on luggage backpack",
  },
  {
    keywords: ["eastpak"],
    brandName: "Eastpak",
    highlight:
      "Bolsas con ruedas Eastpak Tranverz S (51×32.5×23 cm) y mochilas Travelpack de cabina con 30 años de garantía.",
    queryES: "Eastpak Tranverz S maleta cabina mochila",
    queryUS: "Eastpak Tranverz S carry on luggage travelpack",
  },
  {
    keywords: ["osprey"],
    brandName: "Osprey",
    highlight:
      "Mochilas técnicas de cabina Osprey Farpoint 40 y Fairview 40: arnés ergonómico de trekking con medidas oficiales de avión.",
    queryES: "Osprey Farpoint 40 Fairview 40 mochila cabina",
    queryUS: "Osprey Farpoint 40 Fairview 40 travel backpack carry on",
  },
];

interface AirlineBagEntry {
  keywords: string[];
  airlineName: string;
  dimensions: string;
  isLowCostUnderseat: boolean;
  queryES: string;
  queryUS: string;
}

const AIRLINE_BAG_MAP: AirlineBagEntry[] = [
  {
    keywords: ["ryanair"],
    airlineName: "Ryanair",
    dimensions: "40×20×25 cm (Gratis) / 55×40×20 cm (Priority 10 kg)",
    isLowCostUnderseat: true,
    queryES: "mochila Ryanair 40x20x25 cabina bajo asiento",
    queryUS: "Ryanair 40x20x25 underseat cabin backpack bag",
  },
  {
    keywords: ["vueling"],
    airlineName: "Vueling",
    dimensions: "40×30×20 cm (Gratis bajo asiento) / 55×40×20 cm (10 kg)",
    isLowCostUnderseat: true,
    queryES: "mochila Vueling 40x30x20 equipaje mano cabina",
    queryUS: "Vueling 40x30x20 underseat cabin backpack",
  },
  {
    keywords: ["easyjet"],
    airlineName: "easyJet",
    dimensions: "45×36×20 cm (Gratis bajo asiento) / 56×45×25 cm (Cabina)",
    isLowCostUnderseat: true,
    queryES: "mochila easyJet 45x36x20 cabina bajo asiento",
    queryUS: "easyJet 45x36x20 underseat cabin bag backpack",
  },
  {
    keywords: ["wizz", "wizzair"],
    airlineName: "Wizz Air",
    dimensions: "40×30×20 cm (Gratis bajo asiento) / 55×40×23 cm (10 kg)",
    isLowCostUnderseat: true,
    queryES: "mochila Wizz Air 40x30x20 cabina bajo asiento",
    queryUS: "Wizz Air 40x30x20 underseat travel backpack",
  },
  {
    keywords: ["jetsmart"],
    airlineName: "JetSMART",
    dimensions: "45×35×25 cm (Mochila gratis) / 55×35×25 cm (Cabina 10 kg)",
    isLowCostUnderseat: true,
    queryES: "mochila cabina 45x35x20 equipaje mano avion",
    queryUS: "personal item backpack 18x14x8 underseat JetSMART",
  },
  {
    keywords: ["sky-airline", "sky airline"],
    airlineName: "Sky Airline",
    dimensions: "45×35×20 cm (Tarifa Zero) / 55×35×25 cm (Cabina 12 kg)",
    isLowCostUnderseat: true,
    queryES: "mochila cabina 45x35x20 equipaje mano avion",
    queryUS: "personal item travel backpack 18x14x8 underseat",
  },
  {
    keywords: ["volaris"],
    airlineName: "Volaris",
    dimensions: "45×35×20 cm (Objeto personal) / 55×40×25 cm (Cabina)",
    isLowCostUnderseat: true,
    queryES: "mochila cabina 45x35x20 maleta 55x40x20",
    queryUS: "Volaris personal item backpack 18x14x8 carry on",
  },
  {
    keywords: ["viva-aerobus", "viva aerobus", "vivaaerobus"],
    airlineName: "Viva Aerobus",
    dimensions: "45×35×20 cm (Artículo personal) / 55×40×25 cm (10 kg)",
    isLowCostUnderseat: true,
    queryES: "mochila cabina 45x35x20 maleta 55x40x20",
    queryUS: "personal item backpack 18x14x8 carry on luggage",
  },
  {
    keywords: ["spirit"],
    airlineName: "Spirit Airlines",
    dimensions: "45×35×20 cm (18×14×8 in Gratis bajo asiento)",
    isLowCostUnderseat: true,
    queryES: "mochila cabina 45x35x20 bajo asiento avion",
    queryUS: "Spirit Airlines personal item bag 18x14x8 underseat backpack",
  },
  {
    keywords: ["latam"],
    airlineName: "LATAM Airlines",
    dimensions: "55×35×25 cm (Cabina 12 kg) + 45×35×20 cm (Artículo personal)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina 55x35x25 55x35x20 rigida 4 ruedas",
    queryUS: "carry on luggage 21x14x9 spinner + personal item backpack",
  },
  {
    keywords: ["iberia"],
    airlineName: "Iberia",
    dimensions: "56×40×25 cm (Cabina 10 kg) + 40×30×15 cm (Accesorio)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina Iberia 55x40x20 rigida TSA",
    queryUS: "carry on luggage 22x14x9 spinner TSA lock",
  },
  {
    keywords: ["air-europa", "air europa"],
    airlineName: "Air Europa",
    dimensions: "55×35×25 cm (Cabina 10 kg) + 40×30×15 cm (Accesorio)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina 55x35x25 55x35x20 rigida",
    queryUS: "carry on luggage 21x14x9 hardshell spinner",
  },
  {
    keywords: ["avianca"],
    airlineName: "Avianca",
    dimensions: "55×35×25 cm (Cabina 10 kg) + 45×35×20 cm (Artículo personal)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina 55x35x25 mochila 45x35x20",
    queryUS: "Avianca carry on luggage 21x14x9 personal item backpack",
  },
  {
    keywords: ["copa"],
    airlineName: "Copa Airlines",
    dimensions: "56×36×26 cm (Cabina 10 kg) + 43×25×22 cm (Artículo personal)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina 55x35x25 rigida 4 ruedas TSA",
    queryUS: "Copa Airlines carry on luggage 22x14x10 spinner",
  },
  {
    keywords: ["aeromexico", "aeroméxico"],
    airlineName: "Aeroméxico",
    dimensions: "55×40×25 cm (Cabina 10–15 kg) + 45×35×20 cm (Personal)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina 55x40x20 rigida TSA",
    queryUS: "Aeromexico carry on luggage 21.5x15.7x10 spinner",
  },
  {
    keywords: ["lufthansa"],
    airlineName: "Lufthansa",
    dimensions: "55×40×23 cm (Cabina 8 kg) + 40×30×10 cm (Accesorio)",
    isLowCostUnderseat: false,
    queryES: "maleta cabina ultraligera 55x40x20 8kg",
    queryUS: "lightweight carry on luggage 55x40x23 Lufthansa",
  },
];

/**
 * Main context engine: Given any of the 1,845 pages (slug, category, title),
 * returns the 3 highest-converting Amazon affiliate products tailored to that exact page.
 */
export function getContextualAmazonProducts(
  slug: string,
  category: string,
  title: string
): {
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
} {
  const s = `${slug} ${category} ${title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 1. SPECIFIC LUGGAGE BRAND MATCH (Samsonite, American Tourister, Cabin Max, Travelpro, etc.)
  for (const brand of BRAND_LUGGAGE_MAP) {
    if (brand.keywords.some((kw) => s.includes(kw))) {
      const dynamicBrandProduct: AmazonProductRecommendation = {
        id: `brand-${brand.keywords[0]}`,
        badge: `🧳 Catálogo Oficial ${brand.brandName}`,
        title: `Maletas de Cabina y Equipaje de Mano ${brand.brandName} (Modelos Mejor Valorados)`,
        subtitle: brand.highlight,
        features: [
          `Dimensiones verificadas de cabina para viajar sin facturar con ${brand.brandName}`,
          "Ruedas multidireccionales 360° silenciosas y cerradura de combinación TSA integrada",
          "Disponibles con oferta y envío rápido Prime en Amazon",
        ],
        categoryType: "suitcase",
        queryES: brand.queryES,
        queryUS: brand.queryUS,
        ctaLabel: `Ver maletas ${brand.brandName} en Amazon`,
      };

      return {
        sectionTitle: `🧳 Las Mejores Maletas de Cabina ${brand.brandName} y Accesorios en Amazon`,
        sectionSubtitle: `Compara los modelos de cabina más vendidos de ${brand.brandName} y protégelos en cada vuelo:`,
        products: [
          dynamicBrandProduct,
          CATALOG.PACKING_CUBES_COMPRESSOR,
          CATALOG.LUGGAGE_COVER_TAGS,
        ],
      };
    }
  }

  // 2. SPECIFIC AIRLINE MATCH (Ryanair, LATAM, Iberia, Vueling, Avianca, easyJet, JetSMART, etc.)
  for (const airline of AIRLINE_BAG_MAP) {
    if (airline.keywords.some((kw) => s.includes(kw))) {
      const dynamicAirlineBag: AmazonProductRecommendation = {
        id: `airline-${airline.keywords[0]}`,
        badge: `✈️ Medidas Exactas para ${airline.airlineName}`,
        title: `${
          airline.isLowCostUnderseat
            ? "Mochila y Equipaje Bajo Asiento Homologado para"
            : "Maleta de Cabina y Mochila Compatible con"
        } ${airline.airlineName}`,
        subtitle: `Cumple con la franquicia oficial de ${airline.airlineName}: ${airline.dimensions}.`,
        features: [
          `Diseñado específicamente para encajar en el medidor de ${airline.airlineName} sin pagar multas`,
          "Apertura completa de 180° tipo maleta con compartimento para portátil y bolsillo antirrobo",
          "Ultraligero para aprovechar cada kilo permitido a bordo",
        ],
        categoryType: airline.isLowCostUnderseat ? "backpack" : "suitcase",
        queryES: airline.queryES,
        queryUS: airline.queryUS,
        ctaLabel: `Ver equipaje para ${airline.airlineName} en Amazon`,
      };

      return {
        sectionTitle: `✈️ Equipaje Recomendado en Amazon para Volar con ${airline.airlineName} sin Recargos`,
        sectionSubtitle: `Asegúrate de cumplir las medidas (${airline.dimensions}) y el peso límite antes de llegar a la puerta de embarque:`,
        products: [
          dynamicAirlineBag,
          CATALOG.LUGGAGE_SCALE_DIGITAL,
          CATALOG.PACKING_CUBES_COMPRESSOR,
        ],
      };
    }
  }

  // 3. LIQUIDS 100 ML, CREAMS, PERFUMES, SHAMPOO, TOILETRIES, MAKEUP
  if (
    s.includes("liquido") ||
    s.includes("100 ml") ||
    s.includes("100ml") ||
    s.includes("crema") ||
    s.includes("perfume") ||
    s.includes("colonia") ||
    s.includes("champu") ||
    s.includes("shampoo") ||
    s.includes("desodorante") ||
    s.includes("maquillaje") ||
    s.includes("cosmetico") ||
    s.includes("pasta de dientes") ||
    s.includes("gel") ||
    s.includes("aerosol") ||
    s.includes("neceser") ||
    s.includes("bolsa transparente") ||
    s.includes("toallitas")
  ) {
    return {
      sectionTitle:
        "💧 Kits Homologados en Amazon para Pasar Líquidos de 100 ml en el Control",
      sectionSubtitle:
        "Cumple la normativa internacional de envases de 100 ml en bolsa transparente de 1 litro (20×20 cm) sin derrames ni confiscaciones:",
      products: [
        CATALOG.LIQUIDS_BAG_TSA_100ML,
        CATALOG.PERFUME_ATOMIZER_PACK,
        CATALOG.PACKING_CUBES_COMPRESSOR,
      ],
    };
  }

  // 4. ELECTRONICS, POWER BANKS, BATTERIES, LAPTOPS, CHARGERS, HAIR DRYERS, STRAIGHTENERS
  if (
    s.includes("bateria") ||
    s.includes("power bank") ||
    s.includes("powerbank") ||
    s.includes("cargador") ||
    s.includes("laptop") ||
    s.includes("portatil") ||
    s.includes("electronico") ||
    s.includes("tablet") ||
    s.includes("kindle") ||
    s.includes("celular") ||
    s.includes("camara") ||
    s.includes("dron") ||
    s.includes("consola") ||
    s.includes("secador") ||
    s.includes("plancha") ||
    s.includes("alisadora") ||
    s.includes("afeitadora") ||
    s.includes("rasuradora")
  ) {
    return {
      sectionTitle:
        "🔋 Accesorios Electrónicos y Baterías Homologadas para Cabina en Amazon",
      sectionSubtitle:
        "Viaja con tus dispositivos siempre cargados, cables ordenados para rayos X y baterías de litio ≤ 100 Wh aprobadas por TSA/IATA:",
      products: [
        CATALOG.POWER_BANK_20000_CABIN,
        CATALOG.UNIVERSAL_TRAVEL_ADAPTER,
        CATALOG.ELECTRONICS_ORGANIZER_BAG,
      ],
    };
  }

  // 5. MEDICINES, FIRST AID, INSULIN, SYRINGES, PILLS, VITAMINS
  if (
    s.includes("medicamento") ||
    s.includes("medicina") ||
    s.includes("pastilla") ||
    s.includes("jarabe") ||
    s.includes("insulina") ||
    s.includes("jeringa") ||
    s.includes("inhalador") ||
    s.includes("termometro") ||
    s.includes("primeros auxilios") ||
    s.includes("vitamina") ||
    s.includes("receta medica") ||
    s.includes("botiquin")
  ) {
    return {
      sectionTitle:
        "💊 Estuches y Organizadores para Llevar Medicamentos en Cabina sin Problemas",
      sectionSubtitle:
        "Mantén tus medicinas protegidas, identificables y a mano debajo de tu asiento durante todo el vuelo:",
      products: [
        CATALOG.MEDICINE_TRAVEL_ORGANIZER,
        CATALOG.LIQUIDS_BAG_TSA_100ML,
        CATALOG.BACKPACK_UNDERSEAT_40X20X25,
      ],
    };
  }

  // 6. BABIES & KIDS (Biberones, pañales, papilla, coche de bebé, niños)
  if (
    s.includes("bebe") ||
    s.includes("nino") ||
    s.includes("panal") ||
    s.includes("biberon") ||
    s.includes("papilla") ||
    s.includes("coche para bebe") ||
    s.includes("carriola") ||
    s.includes("infantil")
  ) {
    return {
      sectionTitle:
        "👶 Los Mejores Accesorios en Amazon para Volar con Bebés y Niños en Cabina",
      sectionSubtitle:
        "Organiza biberones, pañales y ropa infantil para embarcar cómodo y mantener a los niños entretenidos:",
      products: [
        CATALOG.BABY_TRAVEL_BACKPACK,
        CATALOG.KIDS_RIDE_ON_SUITCASE,
        CATALOG.LIQUIDS_BAG_TSA_100ML,
      ],
    };
  }

  // 7. SECURITY, THEFT PROTECTION, TSA LOCKS, INSURANCE, LOST LUGGAGE
  if (
    category === "seguridad" ||
    s.includes("robo") ||
    s.includes("seguro") ||
    s.includes("candado") ||
    s.includes("tsa") ||
    s.includes("proteger") ||
    s.includes("asegurar") ||
    s.includes("perdida") ||
    s.includes("extravi") ||
    s.includes("rastreador") ||
    s.includes("airtag")
  ) {
    return {
      sectionTitle:
        "🔒 Kit Antirrobo y Seguridad Aeroportuaria Más Vendido en Amazon",
      sectionSubtitle:
        "Protege tus cierres con candados homologados TSA, localiza tu maleta por GPS en cualquier aeropuerto y blinda tu pasaporte:",
      products: [
        CATALOG.TSA_LOCK_2PACK,
        CATALOG.LUGGAGE_TRACKER_GPS,
        CATALOG.RFID_TRAVEL_WALLET,
      ],
    };
  }

  // 8. WEIGHT LIMITS, OVERWEIGHT FEES, KILOS, MEASURING LUGGAGE
  if (
    s.includes("peso") ||
    s.includes("kilo") ||
    s.includes("kg") ||
    s.includes("pesad") ||
    s.includes("pagar extra") ||
    s.includes("cobros extra") ||
    s.includes("sobrepeso") ||
    s.includes("bascula") ||
    s.includes("miden el equipaje")
  ) {
    return {
      sectionTitle:
        "⚖️ Herramientas para No Pagar Exceso de Peso ni Medidas en el Aeropuerto",
      sectionSubtitle:
        "Verifica los kilos exactos antes de salir de casa y aprovecha el artículo personal gratis bajo el asiento:",
      products: [
        CATALOG.LUGGAGE_SCALE_DIGITAL,
        CATALOG.BACKPACK_UNDERSEAT_40X20X25,
        CATALOG.PACKING_CUBES_COMPRESSOR,
      ],
    };
  }

  // 9. BACKPACKS, 40L, MOCHILEROS, UNDERSEAT PERSONAL ITEM
  if (
    s.includes("mochila") ||
    s.includes("mochilero") ||
    s.includes("40l") ||
    s.includes("articulos personales") ||
    s.includes("articulo personal") ||
    s.includes("equipaje personal") ||
    s.includes("bolso pequeno") ||
    s.includes("bajo asiento") ||
    s.includes("low cost")
  ) {
    return {
      sectionTitle:
        "🎒 Las Mejores Mochilas de Cabina y Artículo Personal en Amazon",
      sectionSubtitle:
        "Viaja sin facturar con mochilas de apertura 180° diseñadas para las medidas exactas de las aerolíneas:",
      products: [
        CATALOG.BACKPACK_UNDERSEAT_40X20X25,
        CATALOG.BACKPACK_CABIN_40L,
        CATALOG.PACKING_CUBES_COMPRESSOR,
      ],
    };
  }

  // 10. PACKING TIPS, CLOTHES, SHOES, MAXIMIZING SPACE, LONG FLIGHTS COMFORT
  if (
    category === "consejos" ||
    category === "experiencias-y-tips-de-viajeros" ||
    s.includes("empacar") ||
    s.includes("ropa") ||
    s.includes("espacio") ||
    s.includes("organizar") ||
    s.includes("zapato") ||
    s.includes("calzado") ||
    s.includes("vuelo largo") ||
    s.includes("dormir") ||
    s.includes("manta") ||
    s.includes("almohada")
  ) {
    return {
      sectionTitle:
        "💡 Los Esenciales de Empaque y Confort a Bordo Recomendados en Amazon",
      sectionSubtitle:
        "Reduce un 40% el volumen de tu ropa con cubos compresores y vuela cómodo en trayectos largos:",
      products: [
        CATALOG.PACKING_CUBES_COMPRESSOR,
        CATALOG.TRAVEL_PILLOW_MEMORY_FOAM,
        CATALOG.VACUUM_ROLL_BAGS,
      ],
    };
  }

  // 11. DESTINATIONS, CITIES, HOTELS, BEACHES, NATURE, AFRICA, ASIA, EUROPE, AMERICA
  if (
    [
      "hoteles-en-europa",
      "hoteles-en-america",
      "viaje-en-ciudades",
      "restaurantes-de-america",
      "afrika",
      "asia",
      "destinos",
      "escapadas-a-la-naturaleza",
    ].includes(category)
  ) {
    return {
      sectionTitle:
        "🌍 Equipamiento Esencial de Viaje Recomendado en Amazon para tu Destino",
      sectionSubtitle:
        "Prepárate para recorrer tu destino con enchufe universal multimarca, batería para todo el día y maleta de cabina segura:",
      products: [
        CATALOG.UNIVERSAL_TRAVEL_ADAPTER,
        CATALOG.POWER_BANK_20000_CABIN,
        CATALOG.SUITCASE_CABIN_55X40X20,
      ],
    };
  }

  // 12. DEFAULT / GENERAL CABIN LUGGAGE, TYPES, CHEAP LUGGAGE, PILLAR PAGES & HOME
  return {
    sectionTitle:
      "🧳 El Kit #1 de Equipaje de Mano Recomendado por Equipaje Ordenado en Amazon",
    sectionSubtitle:
      "Los 3 productos mejor valorados por miles de viajeros para cumplir medidas de cabina, organizar la ropa y evitar cargos extra:",
    products: [
      CATALOG.SUITCASE_CABIN_55X40X20,
      CATALOG.BACKPACK_UNDERSEAT_40X20X25,
      CATALOG.PACKING_CUBES_COMPRESSOR,
    ],
  };
}
