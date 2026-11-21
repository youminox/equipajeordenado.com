import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AirlineChecker from "@/components/AirlineChecker";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import ReadingProgress from "@/components/ReadingProgress";
import SplitHeading from "@/components/SplitHeading";
import ClientEffects from "@/components/ClientEffects";
import OpenChatButton from "@/components/OpenChatButton";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import PackingScience from "@/components/home/PackingScience";
import LuggageOrbit, { type OrbitItem } from "@/components/home/LuggageOrbit";
import CabinCounters, {
  type CabinStatItem,
} from "@/components/home/CabinCounters";
import DayNightSlider from "@/components/home/DayNightSlider";
import MomentsCarousel, {
  type Moment,
} from "@/components/home/MomentsCarousel";
import LuggageCalculatorBlock, {
  type LuggageModeOption,
} from "@/components/home/LuggageCalculatorBlock";
import {
  getFeaturedPosts,
  getRecentPosts,
  getIndexableCategories,
  getIndexablePosts,
  toPostCard,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
} from "@/lib/data";

export const metadata: Metadata = {
  title: {
    absolute: `Equipaje de mano: medidas, peso y normas por aerolínea | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const MARQUEE_AIRLINES = [
  "Iberia · 56×40×25 cm (10 kg)",
  "LATAM Airlines · 55×35×25 cm (12 kg)",
  "Ryanair · 55×40×20 cm (10 kg)",
  "Air Europa · 55×35×25 cm (10 kg)",
  "Vueling · 55×40×20 cm (10 kg)",
  "Avianca · 55×35×25 cm (10 kg)",
  "Copa Airlines · 56×36×26 cm (10 kg)",
  "JetSMART · 55×35×25 cm (10 kg)",
  "Aeroméxico · 55×40×25 cm (10 kg)",
  "American Airlines · 56×36×23 cm",
];

const MARQUEE_RULES = [
  "Líquidos máx. 100 ml por envase",
  "Bolsa transparente 1 Litro (20×20 cm)",
  "Estándar Cabina 55 × 40 × 20 cm",
  "Artículo Personal Bajo el Asiento",
  "Candado Homologado TSA",
  "Power Bank ≤ 100 Wh en Cabina",
  "Cubos Compresores -40% Volumen",
  "Viaja Ligero y Sin Cargos Extra",
];

const FAQ = [
  {
    q: "¿Cuáles son las medidas estándar del equipaje de mano en las aerolíneas?",
    a: "La medida estándar recomendada por IATA y aceptada por la mayoría de aerolíneas es de 55 × 40 × 20 cm (o 55 × 35 × 25 cm en aerolíneas como LATAM, Avianca, Air Europa y JetSMART), incluyendo ruedas, asas y bolsillos. Además, casi todas permiten un artículo personal gratuito bajo el asiento delantero (aprox. 40 × 30 × 15 cm o 45 × 35 × 20 cm).",
  },
  {
    q: "¿Cuál es la regla de líquidos de 100 ml en el equipaje de mano?",
    a: "Todos los líquidos, geles, aerosoles, cremas y pastas deben ir en envases individuales de máximo 100 ml (3.4 oz), reunidos dentro de una única bolsa de plástico transparente con cierre hermético de hasta 1 litro (aprox. 20 × 20 cm) por pasajero. Están exentos los medicamentos líquidos con receta y la leche o comida para bebés.",
  },
  {
    q: "¿Puedo llevar una mochila o bolso pequeño además de mi maleta de cabina?",
    a: "Depende de tu tarifa. En tarifas que incluyen equipaje de cabina (como Iberia Basic, Copa Basic, Air Europa Lite o tarifas Light/Plus en LATAM y Avianca), sí puedes subir con ambas piezas: la maleta de mano (10–12 kg) en el compartimento superior y la mochila o bolso personal bajo el asiento. En tarifas Basic/Zero de aerolíneas low cost solo está incluido el artículo personal bajo el asiento.",
  },
  {
    q: "¿Dónde debo llevar el power bank (batería externa) y la laptop?",
    a: "Las baterías de litio, power banks (de hasta 100 Wh o ~27,000 mAh), laptops, tablets, cámaras y cigarrillos electrónicos deben viajar obligatoriamente contigo en el equipaje de mano dentro de la cabina. Por normativa internacional de seguridad aérea están prohibidos en la bodega del avión.",
  },
  {
    q: "¿Cómo funciona el Asesor de Equipaje y Vuelos IA de Equipaje Ordenado?",
    a: "Haz clic en el botón flotante 'Asesor Equipaje IA' en cualquier momento y pregúntale qué medidas exige tu aerolínea, si un objeto específico está permitido en cabina o cómo empacar tu maleta según tu destino. Te responderá al instante con los datos verificados y te dará acceso directo a nuestras guías paso a paso.",
  },
  {
    q: "¿Qué hago si mi maleta supera por 1 o 2 kilos el límite en la puerta de embarque?",
    a: "Usa la técnica de distribución previa al embarque: coloca el abrigo o casaca más pesada puesta, guarda el cargador y pequeños accesorios en los bolsillos de tu prenda exterior y pasa los artículos más densos (como un libro o batería externa) a tu mochila personal bajo el asiento.",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "reglas-de-equipaje": "📏",
  "que-se-puede-llevar-en-el-equipaje-de-mano": "🧴",
  regulaciones: "🛂",
  marcas: "🧳",
  tipos: "🎒",
  barato: "🏷️",
  guias: "📘",
  consejos: "💡",
  curiosidades: "✈️",
  seguridad: "🔒",
  aerolineas: "🛫",
  resenas: "⭐",
  "experiencias-y-tips-de-viajeros": "🧭",
};

export default function HomePage() {
  const featuredPosts = getFeaturedPosts(6);
  const explorerPosts = getRecentPosts(48).map(toPostCard);
  const categories = getIndexableCategories().filter((c) => c.count > 0);
  const totalGuides = getIndexablePosts().length;

  const orbitItems: OrbitItem[] = [
    {
      k: "carry-on",
      name: "Maleta Carry-On 55×40×20",
      img: "/images/Cuales-son-las-dimensiones-estandar-del-equipaje-de-mano.jpg",
      icon: "🧳",
      role: "Pieza principal de compartimento superior (8 a 12 kg)",
      d: "Las dimensiones 55 × 40 × 20 cm (incluyendo ruedas y asas) son el estándar más compatible del mundo. Elige carcasa rígida de policarbonato para proteger objetos frágiles o tela blanda si necesitas bolsillo exterior para laptop.",
      href: "/equipaje-de-mano/",
    },
    {
      k: "personal-item",
      name: "Artículo Personal Bajo Asiento",
      img: "/images/Que-mochilas-caben-como-equipaje-de-mano.jpg",
      icon: "🎒",
      role: "Gratis en todas las tarifas (40 × 30 × 15 cm)",
      d: "Tu mochila o bolso que va debajo del asiento delantero. Allí debes llevar tu pasaporte, laptop, medicinas, objetos de valor, auriculares y una muda de emergencia.",
      href: "/reglas-de-equipaje/cual-es-la-diferencia-entre-equipaje-de-mano-y-equipaje-personal/",
    },
    {
      k: "liquidos-100ml",
      name: "Bolsa de Líquidos 100 ml",
      img: "/images/Como-empacar-liquidos-en-cabina.jpg",
      icon: "💧",
      role: "Envases ≤ 100 ml en bolsa zip transparente de 1 L",
      d: "Perfumes, champú, cremas, pasta dental y desodorante en gel cuentan como líquidos. Coloca la bolsa de 20 × 20 cm en la parte superior de tu maleta para sacarla en 3 segundos en el control de rayos X.",
      href: "/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/",
    },
    {
      k: "power-bank",
      name: "Power Bank y Electrónicos",
      img: "/images/Que-considerar-al-llevar-electronicos-en-el-equipaje-de-mano.jpg",
      icon: "🔋",
      role: "Baterías de litio ≤ 100 Wh (~27,000 mAh) solo en cabina",
      d: "Las baterías externas, laptops, cámaras y consolas nunca deben facturarse en bodega por riesgo térmico. Asegúrate de que tu power bank tenga impresa su capacidad en mAh o Wh.",
      href: "/que-se-puede-llevar-en-el-equipaje-de-mano/puedo-viajar-con-bateria-externa-o-power-bank/",
    },
    {
      k: "candado-tsa",
      name: "Candado TSA y Seguridad",
      img: "/images/Como-identificar-equipaje-de-mano-de-calidad-a-bajo-costo.jpg",
      icon: "🔒",
      role: "Cerradura con llave maestra universal de aduanas",
      d: "Un candado con el rombo rojo Travel Sentry permite que los agentes de seguridad aeroportuaria inspeccionen tu maleta sin romper los cierres, protegiendo además tu equipaje en cabina y hotel.",
      href: "/seguridad/como-asegurar-tu-equipaje-de-mano-contra-robos/",
    },
    {
      k: "cubos-ropa",
      name: "Ropa en Cubos Compresores",
      img: "/images/Que-consideraciones-tomar-para-el-equipaje-de-mano-en-viajes-largos.jpg",
      icon: "👕",
      role: "Enrollado militar + doble cremallera (-40% espacio)",
      d: "Enrollar las prendas en lugar de doblarlas evita arrugas y expulsa el aire. Clasifica un cubo para prendas superiores, otro para pantalones y uno pequeño para ropa interior.",
      href: "/que-se-puede-llevar-en-el-equipaje-de-mano/que-ropa-debo-llevar-en-la-maleta-de-mano/",
    },
    {
      k: "medicamentos",
      name: "Medicamentos y Botiquín",
      img: "/images/Que-tipo-de-bolsas-son-adecuadas-para-liquidos-en-el-equipaje-de-mano.jpg",
      icon: "💊",
      role: "Permitidos en cabina en su envase original",
      d: "Pastillas, inhaladores, insulina o jarabes médicos pueden superar los 100 ml si llevas la receta o informe médico a tu nombre. Llévalos siempre contigo en cabina por si se retrasa el vuelo.",
      href: "/que-se-puede-llevar-en-el-equipaje-de-mano/que-medicamentos-puedo-llevar-en-el-equipaje-de-mano/",
    },
    {
      k: "seguro-maleta",
      name: "Seguro de Maletas y Viaje",
      img: "/images/Que-pasa-si-llevo-un-objeto-fragil.jpg",
      icon: "🛡️",
      role: "Cobertura ante pérdida, demora, robo o daños",
      d: "Conoce cómo reclamar indemnización con el parte PIR en el aeropuerto antes de salir de la sala de llegadas y qué cubren los seguros de viaje y tarjetas bancarias.",
      href: "/seguridad/seguro-para-maletas-de-viaje/",
    },
  ];

  const cabinStats: CabinStatItem[] = [
    {
      v: 100,
      dec: 0,
      u: "ml",
      l: "Máximo por envase líquido",
      pct: 100,
      note: "Dentro de 1 bolsa zip transparente de 1 litro",
    },
    {
      v: 10,
      dec: 0,
      u: "kg",
      l: "Peso estándar de cabina",
      pct: 84,
      note: "Entre 8 kg y 12 kg según la aerolínea",
    },
    {
      v: 55,
      dec: 0,
      u: "cm",
      l: "Altura máxima Carry-On",
      pct: 92,
      note: "Estándar 55 × 40 × 20 cm (con ruedas)",
    },
    {
      v: 20,
      dec: 0,
      u: "aerolíneas",
      l: "Tablas oficiales verificadas",
      pct: 100,
      note: "Medidas de cabina y bolso personal al día",
    },
    {
      v: totalGuides,
      dec: 0,
      u: "guías",
      l: "Artículos especializados",
      pct: 96,
      note: "Normativas, marcas, empaque y seguridad",
    },
    {
      v: 100,
      dec: 0,
      u: "Wh",
      l: "Límite batería Power Bank",
      pct: 88,
      note: "Equivale a ~27,000 mAh a 3.7V en cabina",
    },
  ];

  const moments: Moment[] = [
    {
      img: "/images/Como-empacar-liquidos-en-cabina.jpg",
      t: "Control de Líquidos 100 ml",
      d: "Qué entra exactamente en la bolsa de 1 litro y qué productos pasan sin problema.",
      href: "/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/",
      alt: "Bolsa transparente de líquidos de 100 ml para control de aeropuerto",
      tag: "Control TSA/UE",
    },
    {
      img: "/images/Que-hacer-si-tu-equipaje-de-mano-no-cabe-en-el-compartimento-superior.jpg",
      t: "¿No cabe en el medidor?",
      d: "Trucos de último minuto en la puerta de embarque si tu maleta excede medidas o peso.",
      href: "/reglas-de-equipaje/consejos-para-evitar-pagar-extra-por-el-equipaje-de-mano/",
      alt: "Pasajero colocando maleta en el compartimento superior del avión",
      tag: "Puerta de Embarque",
    },
    {
      img: "/images/Norwegian-Air-medidas-del-equipaje-de-mano-gratuito.jpg",
      t: "Aerolíneas Low Cost",
      d: "Comparativa de Ryanair, Vueling, easyJet, JetSMART, Sky y Volaris sin pagar recargos.",
      href: "/reglas-de-equipaje/comparativa-equipaje-de-mano-permitido-por-aerolineas-low-cost/",
      alt: "Equipaje de mano en aerolíneas low cost",
      tag: "Low Cost ✈️",
    },
    {
      img: "/images/Que-mochilas-caben-como-equipaje-de-mano.jpg",
      t: "Viajar solo con Mochila 40L",
      d: "La experiencia real empacando para una semana entera sin llevar maleta con ruedas.",
      href: "/experiencias-y-tips-de-viajeros/que-aprendi-al-empacar-todo-en-una-mochila-de-40l/",
      alt: "Mochila de cabina de 40 litros lista para viajar",
      tag: "Mochila 40L 🎒",
    },
    {
      img: "/images/Que-considerar-al-llevar-electronicos-en-el-equipaje-de-mano.jpg",
      t: "Laptop, Dron y Power Bank",
      d: "Reglas sobre baterías de litio, cargadores, consolas y cámaras fotográficas a bordo.",
      href: "/que-se-puede-llevar-en-el-equipaje-de-mano/puedo-llevar-laptop-en-el-equipaje-de-mano/",
      alt: "Laptop, cámara y dispositivos electrónicos en el equipaje de mano",
      tag: "Electrónicos 🔋",
    },
    {
      img: "/images/Que-articulos-no-se-permiten-en-el-equipaje-de-mano-segun-LATAM.jpg",
      t: "10 Objetos Prohibidos",
      d: "Tijeras, cuchillas, herramientas, aerosoles y alimentos que retienen en seguridad.",
      href: "/reglas-de-equipaje/que-objetos-no-debes-llevar-en-tu-equipaje-de-mano/",
      alt: "Artículos prohibidos en el control de seguridad del aeropuerto",
      tag: "Prohibidos 🚫",
    },
    {
      img: "/images/Equipaje-de-mano-American-Tourister-Modelos-recomendados.jpg",
      t: "Las Mejores Marcas",
      d: "Samsonite, American Tourister, Travelpro y Cabin Max: cuál dura más y pesa menos.",
      href: "/marcas/",
      alt: "Comparativa de las mejores marcas de maletas de cabina",
      tag: "Comparativa ⭐",
    },
  ];

  const calculatorOptions: LuggageModeOption[] = [
    {
      key: "personal",
      label: "Solo Artículo Personal",
      dimensions: "40 × 30 × 15 cm",
      maxWeightKg: 6,
      liters: 20,
      feeSavedUsd: 45,
      img: "/images/Que-mochilas-caben-como-equipaje-de-mano.jpg",
      alt: "Mochila de artículo personal que cabe bajo el asiento del avión",
      desc: "Incluido gratis en el 100% de aerolíneas (incluso tarifas Basic y Zero). Va debajo del asiento delantero y te permite salir del aeropuerto sin esperar nada.",
      idealFor: "Escapadas de 2 a 4 días y vuelos Low Cost",
      href: "/reglas-de-equipaje/que-mochilas-caben-como-equipaje-de-mano/",
    },
    {
      key: "carryon",
      label: "Maleta de Cabina 10 kg",
      dimensions: "55 × 40 × 20 cm",
      maxWeightKg: 10,
      liters: 40,
      feeSavedUsd: 65,
      img: "/images/Cuales-son-las-dimensiones-estandar-del-equipaje-de-mano.jpg",
      alt: "Maleta rígida de cabina estándar de 55x40x20 cm",
      desc: "El estándar de oro del viajero frecuente: 40 litros en el compartimento superior + tu mochila bajo el asiento. Con cubos compresores rinde perfectamente para 1 o 2 semanas.",
      idealFor: "Viajes de 4 a 10 días nacionales o internacionales",
      href: "/equipaje-de-mano/",
    },
    {
      key: "combo",
      label: "Cabina 12 kg + Mochila Pro",
      dimensions: "55 × 35 × 25 cm + 45 × 35 × 20 cm",
      maxWeightKg: 12,
      liters: 58,
      feeSavedUsd: 90,
      img: "/images/Que-consideraciones-tomar-para-el-equipaje-de-mano-en-viajes-largos.jpg",
      alt: "Combinación de maleta de cabina y mochila de viaje para vuelos largos",
      desc: "Aprovecha al máximo las aerolíneas que permiten 12 kg en cabina (LATAM, Sky, KLM, Air France) sumando una mochila técnica bajo el asiento para viajes largos sin facturar.",
      idealFor: "Viajes de 10 a 14+ días o vuelos intercontinentales",
      href: "/reglas-de-equipaje/medidas-de-equipaje-de-mano-permitidas-en-vuelos-intercontinentales/",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <ReadingProgress />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* 1–2. Hero 3D con Partículas, Buscador y Tarjeta Tilt */}
        <Hero
          totalGuides={totalGuides}
          totalCategories={categories.length}
        />

        {/* 3. Doble Cinta Marquee de Aerolíneas y Normas IATA */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-base sm:text-lg font-extrabold text-[#0f172a]/85"
                aria-hidden={k === 1}
              >
                {MARQUEE_AIRLINES.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-amber-400 to-[#0767db]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden="true">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#03428e]/75"
              >
                {MARQUEE_RULES.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Qué es Equipaje Ordenado + Mosaico Spotlight + Opinión de Charlie Lingán */}
        <section id="que-es" className="wrap py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Por qué Equipaje Ordenado
              </span>
              <SplitHeading
                text="Viajar ligero y sin sorpresas,"
                accent={{
                  text: "con las reglas reales de cada aerolínea",
                  className: "text-[#0767db]",
                }}
                className="section-title mt-3 text-[#0f172a]"
              />
              <p
                className="mt-5 text-base sm:text-lg text-[#4b5563] leading-relaxed"
                data-reveal
              >
                Cada aerolínea cambia sus franquicias de cabina, tarifas básicas
                y tamaños de medidor. En{" "}
                <strong className="text-[#0f172a]">Equipaje Ordenado</strong>{" "}
                documentamos al milímetro las{" "}
                <strong className="text-[#0f172a]">
                  medidas oficiales de 20 aerolíneas, las normativas TSA/UE de
                  seguridad y más de {totalGuides} guías prácticas
                </strong>{" "}
                para que empaques como un profesional.
              </p>

              {/* Charlie Lingán Author Box */}
              <div
                className="mt-6 rounded-2xl border border-amber-300/70 bg-amber-50/80 p-5"
                data-reveal
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Charlie-Lingan.jpg"
                    alt="Charlie Lingán - Fundador de Equipaje Ordenado"
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-400 shadow-sm shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-800">
                      ✈️ Todo según mi experiencia viajera
                    </p>
                    <p className="text-base font-extrabold text-[#0f172a]">
                      Charlie Lingán · Creador de Equipaje Ordenado
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#4b5563]">
                      “He reunido aquí las guías, comparativas de marcas y
                      normas reales de cabina para que disfrutes cada vuelo sin
                      estrés ni sobrecostos.”
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/equipaje-de-mano/"
                  className="btn btn-buy shine text-sm"
                  data-magnetic
                >
                  Guía completa de equipaje de mano
                </Link>
                <Link
                  href="/hola-hablamos/"
                  className="btn btn-ghost text-sm"
                  data-magnetic
                >
                  Conocer más sobre Charlie Lingán →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-3xl shadow-[0_30px_60px_-35px_rgba(3,66,142,0.6)]"
                data-reveal
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Que-se-considera-como-equipaje-de-mano.jpg"
                  alt="Maleta de cabina y accesorios de viaje organizados antes de volar"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#03428e] shadow">
                  Normativas IATA, TSA y Aerolíneas 2026
                </span>
              </div>
              {[
                [
                  "📏",
                  "Medidas Verificadas",
                  "Alto, ancho, profundidad y peso en cabina de 20 aerolíneas.",
                ],
                [
                  "💧",
                  "Control Sin Retrasos",
                  "Regla de 100 ml, medicamentos, comida y electrónica en rayos X.",
                ],
                [
                  "🧳",
                  "Maletas y Mochilas",
                  "Comparativas honestas de marcas rígidas, blandas y mochilas 40L.",
                ],
                [
                  "🤖",
                  "Asesor IA 24/7",
                  "Resuelve cualquier duda de tu vuelo o maleta en segundos.",
                ],
              ].map(([e, t, d], i) => (
                <div
                  key={t}
                  className="card spot p-5"
                  data-reveal
                  data-reveal-delay={String(i)}
                >
                  <p className="text-2xl" aria-hidden="true">
                    {e}
                  </p>
                  <p className="mt-2 text-lg font-extrabold leading-tight text-[#0f172a]">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-[#4b5563]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Historia fijada con GSAP ScrollTrigger: Abres la maleta → Metes la ropa → Termina en un avión */}
        <ScrollStory />

        {/* Verificador Interactivo de las 20 Aerolíneas */}
        <AirlineChecker />

        {/* Banner AdSense */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdBanner />
        </div>

        {/* 6. La Ciencia del Empaque Compacto (Sección oscura con SVG interactivo) */}
        <section className="relative isolate overflow-hidden bg-[#071326] py-20 sm:py-24 text-white">
          <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[#0767db]/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-amber-500/20 blur-3xl" />
          <div className="hero-grid opacity-50" />
          <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow !text-amber-300" data-reveal>
                Ingeniería del espacio en 40 litros
              </span>
              <SplitHeading
                text="Cómo funciona el"
                accent={{
                  text: "empaque por compresión",
                  className: "text-gradient",
                }}
                className="section-title mt-3 text-white"
              />
              <p
                className="mt-5 text-base sm:text-lg text-sky-100/80 leading-relaxed"
                data-reveal
              >
                El 35% del volumen de una maleta mal empacada es{" "}
                <strong className="text-white">aire atrapado entre los pliegues</strong>.
                Al combinar el{" "}
                <strong className="text-white">enrollado militar</strong> de
                prendas con{" "}
                <strong className="text-white">
                  cubos organizadores de doble cremallera
                </strong>{" "}
                y colocar el peso denso (calzado y neceser) junto al eje de las
                ruedas, ganas hasta un 40% de capacidad real sin deformar la
                maleta.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3" data-reveal>
                {[
                  ["🌀", "Enrollado sin aire"],
                  ["📦", "Cubos modulares"],
                  ["⚖️", "Centro de gravedad"],
                ].map(([e, t]) => (
                  <div key={t} className="glass p-4 text-center">
                    <p className="text-2xl" aria-hidden="true">
                      {e}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-bold">{t}</p>
                  </div>
                ))}
              </div>

              <div
                className="glass mt-6 p-5 text-sm text-sky-100/80"
                data-reveal
              >
                <strong className="text-amber-300">Truco de cabina:</strong>{" "}
                rellena el interior de tus zapatos con medias y accesorios
                pequeños. Aprovechas un hueco rígido que de otro modo quedaría
                vacío y evitas que el calzado se aplaste.
              </div>

              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/experiencias-y-tips-de-viajeros/los-mejores-consejos-de-viajeros-expertos-para-ahorrar-espacio-experiencia-real/"
                  className="btn btn-glass text-sm"
                  data-magnetic
                >
                  Trucos para ahorrar espacio
                </Link>
                <Link
                  href="/consejos/"
                  className="btn btn-glass text-sm"
                  data-magnetic
                >
                  Consejos de empaque →
                </Link>
              </div>
            </div>

            <div data-reveal>
              <PackingScience />
            </div>
          </div>
        </section>

        {/* 7. Órbita Interactiva de los 8 Esenciales del Equipaje de Mano */}
        <section className="wrap py-20 sm:py-24">
          <LuggageOrbit
            items={orbitItems}
            centerImg="/images/Cuales-son-las-dimensiones-estandar-del-equipaje-de-mano.jpg"
          />
          <p className="mt-10 text-center text-sm text-[#4b5563]">
            ¿Tienes dudas sobre un artículo específico como secador de pelo,
            cuchillas, paraguas, comida o instrumentos?{" "}
            <Link
              href="/que-se-puede-llevar-en-el-equipaje-de-mano/"
              className="font-extrabold text-[#03428e] underline hover:text-[#0767db]"
            >
              Ver las 88 guías de Qué Llevar en el Equipaje de Mano →
            </Link>
          </p>
        </section>

        {/* 8. Estándares Oficiales y Contadores Animados + Tarjeta Boarding Pass IATA */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#03428e] via-[#071326] to-[#022c61] py-20 sm:py-24 text-white">
          <div className="hero-aurora opacity-40" />
          <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="eyebrow !text-amber-300" data-reveal>
                Normativa internacional verificada
              </span>
              <SplitHeading
                text="Las reglas de cabina,"
                accent={{ text: "cifra por cifra", className: "text-gradient" }}
                className="section-title mt-3 text-white"
              />
              <p
                className="mt-4 max-w-xl text-sky-100/75 text-base sm:text-lg"
                data-reveal
              >
                Antes de salir hacia el aeropuerto, verifica que tu equipaje
                cumpla con los límites físicos y de seguridad exigidos en los
                controles internacionales TSA, Unión Europea y Latinoamérica.
              </p>
              <div className="mt-8">
                <CabinCounters data={cabinStats} />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/medidas-equipaje-de-mano/"
                  className="btn btn-amber shine text-sm"
                  data-magnetic
                >
                  Ver tabla completa de 20 aerolíneas
                </Link>
                <Link
                  href="/regulaciones/cuales-son-las-restricciones-de-peso-para-el-equipaje-de-mano/"
                  className="btn btn-glass text-sm"
                  data-magnetic
                >
                  Restricciones de peso en cabina
                </Link>
              </div>
            </div>

            {/* Tarjeta visual estilo Boarding Pass / Etiqueta Oficial de Cabina */}
            <div
              className="mx-auto w-full max-w-[420px] rounded-3xl bg-white p-6 text-[#0f172a] shadow-2xl"
              data-reveal
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0767db]">
                    CABIN BAGGAGE PASS · IATA / TSA
                  </p>
                  <h3 className="text-2xl font-extrabold text-[#0f172a]">
                    Ficha de Control Rápido
                  </h3>
                </div>
                <span className="rounded-xl bg-[#0767db] px-3 py-1.5 text-xs font-extrabold text-white">
                  ✈️ CABINA
                </span>
              </div>

              <dl className="mt-4 divide-y divide-gray-200 text-sm">
                {[
                  [
                    "🧳 Maleta Carry-On Estándar",
                    "55 × 40 × 20 cm",
                    "Incluye ruedas, asas y bolsillos",
                  ],
                  [
                    "🎒 Artículo Personal (Gratis)",
                    "40 × 30 × 15 cm",
                    "Debe caber bajo el asiento delantero",
                  ],
                  [
                    "⚖️ Peso Permitido en Cabina",
                    "8 a 12 kg",
                    "10 kg en la mayoría de aerolíneas",
                  ],
                  [
                    "💧 Regla de Líquidos TSA/UE",
                    "Máx. 100 ml",
                    "En 1 bolsa zip de 1 L (20 × 20 cm)",
                  ],
                  [
                    "🔋 Baterías Externas (Litio)",
                    "Máx. 100 Wh",
                    "~27,000 mAh · Prohibidas en bodega",
                  ],
                ].map(([k, v, sub]) => (
                  <div
                    key={k}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <dt className="font-extrabold text-[#0f172a]">{k}</dt>
                      <dd className="text-xs text-[#4b5563]">{sub}</dd>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#f0f7ff] border border-[#bfdbfe] px-3 py-1 font-extrabold text-xs text-[#03428e]">
                      {v}
                    </span>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-950">
                <strong>✓ Consejo de embarque:</strong> Si tu vuelo va lleno,
                las últimas filas en abordar suelen tener que enviar su maleta a
                bodega en la puerta. Lleva siempre tus electrónicos, documentos
                y medicinas en tu mochila personal.
              </div>
            </div>
          </div>
        </section>

        {/* 9. Escena Interactiva Día ↔ Noche: Vuelo Diurno vs. Vuelo Nocturno */}
        <section className="wrap py-20 sm:py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Tu equipaje en cualquier horario
              </span>
              <SplitHeading
                text="De día o en vuelo nocturno,"
                accent={{
                  text: "tu maleta viaja contigo",
                  className: "text-[#0767db]",
                }}
                className="section-title mt-3 text-[#0f172a]"
              />
            </div>
            <p className="text-base sm:text-lg text-[#4b5563]" data-reveal>
              Arrastra el control horario de la escena. Cambia el cielo sobre la
              pista del aeropuerto y descubre cómo preparar tu equipaje de
              cabina según la hora de tu vuelo.
            </p>
          </div>

          <div data-reveal>
            <DayNightSlider />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [
                "Control de Seguridad",
                "Bolsa de 100 ml y laptop listas en el bolsillo superior",
                "/images/Como-empacar-liquidos-en-cabina.jpg",
                "/experiencias-y-tips-de-viajeros/trucos-para-pasar-controles-sin-abrir-tu-equipaje/",
              ],
              [
                "Compartimento Superior",
                "Maleta de 55×40×20 cm con las ruedas hacia adentro",
                "/images/Que-hacer-si-tu-equipaje-de-mano-no-cabe-en-el-compartimento-superior.jpg",
                "/equipaje-de-mano/",
              ],
              [
                "Confort en Vuelos Largos",
                "Qué llevar bajo tu asiento para dormir y llegar fresco",
                "/images/Que-consideraciones-tomar-para-el-equipaje-de-mano-en-viajes-largos.jpg",
                "/experiencias-y-tips-de-viajeros/que-llevar-en-el-equipaje-de-mano-para-un-vuelo-largo/",
              ],
            ].map(([t, d, src, href], i) => (
              <Link
                key={t}
                href={href}
                className="card spot overflow-hidden group"
                data-reveal
                data-reveal-delay={String(i)}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0767db] to-[#03428e] font-extrabold text-white">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-lg font-extrabold leading-tight text-[#0f172a] group-hover:text-[#0767db] transition-colors">
                      {t}
                    </p>
                    <p className="text-sm text-[#4b5563]">{d}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. Carrusel Horizontal 4:5 de Situaciones y Dudas en el Aeropuerto */}
        <section className="overflow-hidden bg-[#f0f7ff] py-20 sm:py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Guías para cada momento del viaje
              </span>
              <SplitHeading
                text="Situaciones reales y"
                accent={{
                  text: "soluciones en el aeropuerto",
                  className: "text-[#03428e]",
                }}
                className="section-title mt-3 text-[#0f172a]"
              />
            </div>
            <MomentsCarousel items={moments} />
          </div>
        </section>

        {/* 11. Calculadora Interactiva de Equipaje y Ahorro */}
        <section id="calculadora" className="wrap py-20 sm:py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Planifica tu maleta según tus días
              </span>
              <SplitHeading
                text="40 litros bien ordenados."
                accent={{
                  text: "Cero cargos en el mostrador.",
                  className: "text-[#0767db]",
                }}
                className="section-title mt-3 text-[#0f172a]"
              />
            </div>
            <ul className="grid gap-2 text-[#4b5563]" data-reveal>
              {[
                "Ahorra entre $90 y $180 USD por viaje redondo evitando facturar",
                "Sal del avión directo a la ciudad sin esperar en la cinta de equipaje",
                "Elimina el riesgo de extravío de maletas en vuelos con escala",
                "Pídele al Asesor IA tu lista de empaque personalizada al instante",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm sm:text-base">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#8cc63f]/25 text-xs font-extrabold text-[#3b630c]">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <LuggageCalculatorBlock options={calculatorOptions} />
          </div>
        </section>

        {/* 12. Bento Grid de Categorías + Guías Esenciales */}
        <section className="bg-gradient-to-b from-white to-[#f0f7ff] py-20 sm:py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Explora por temática
              </span>
              <SplitHeading
                text="Todo sobre equipaje de mano,"
                accent={{
                  text: "ordenado por categoría",
                  className: "text-[#03428e]",
                }}
                className="section-title mt-3 text-[#0f172a]"
              />
            </div>

            <div className="grid auto-rows-[minmax(185px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const big = i === 0;
                const wide = i === 1 || i === 4;
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}/`}
                    className={`card spot group flex flex-col p-6 sm:p-7 ${
                      big
                        ? "spot-dark border-transparent bg-gradient-to-br from-[#0767db] via-[#03428e] to-[#071326] text-white md:col-span-2 lg:row-span-2"
                        : ""
                    } ${wide ? "lg:col-span-2" : ""}`}
                    data-reveal
                    data-reveal-delay={String(i % 4)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                          big ? "bg-white/15" : "bg-[#f0f7ff]"
                        }`}
                        aria-hidden="true"
                      >
                        {CATEGORY_ICONS[cat.slug] || "🧳"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                          big
                            ? "bg-amber-400/20 text-amber-300"
                            : "bg-[#f0f7ff] text-[#03428e]"
                        }`}
                      >
                        {cat.count} guías
                      </span>
                    </div>

                    <h3
                      className={`mt-5 font-extrabold ${
                        big
                          ? "text-2xl sm:text-3xl text-white"
                          : "text-xl text-[#0f172a] group-hover:text-[#0767db]"
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        big ? "text-sky-100/85" : "text-[#4b5563] line-clamp-3"
                      }`}
                    >
                      {cat.description}
                    </p>

                    {big && (
                      <div className="mt-6 grid grid-cols-2 gap-2.5 text-xs font-semibold text-sky-100/90">
                        <span className="rounded-xl bg-white/10 px-3 py-2">
                          → Líquidos y cremas 100 ml
                        </span>
                        <span className="rounded-xl bg-white/10 px-3 py-2">
                          → Power banks y laptops
                        </span>
                        <span className="rounded-xl bg-white/10 px-3 py-2">
                          → Medicamentos en cabina
                        </span>
                        <span className="rounded-xl bg-white/10 px-3 py-2">
                          → Alimentos y regalos
                        </span>
                      </div>
                    )}

                    <span
                      className={`mt-auto pt-5 text-sm font-extrabold ${
                        big ? "text-amber-300" : "text-[#0767db]"
                      }`}
                    >
                      Explorar categoría →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Guías Esenciales (Lo más consultado) */}
            <div className="mt-16">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="eyebrow" data-reveal>
                    Lecturas imprescindibles
                  </span>
                  <h3
                    className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0f172a]"
                    data-reveal
                  >
                    Guías Esenciales de{" "}
                    <span className="text-[#0767db]">Equipaje de Mano</span>
                  </h3>
                </div>
                <Link
                  href="/equipaje-de-mano/"
                  className="text-sm font-extrabold text-[#03428e] hover:text-[#0767db]"
                >
                  Ver guía pilar completa →
                </Link>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="card spot group flex flex-col overflow-hidden"
                    data-reveal
                    data-reveal-delay={String(idx % 3)}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(post.featuredImageUrl)}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#0767db]/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow">
                        {post.categoryName}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <span>⏱️ {post.readTime} de lectura</span>
                        <span>·</span>
                        <span className="text-gray-500">
                          {post.categoryName}
                        </span>
                      </div>
                      <h4 className="text-lg font-extrabold text-[#0f172a] transition-colors group-hover:text-[#0767db] line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="mt-2 line-clamp-3 text-sm text-[#4b5563] flex-1">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0767db]">
                        Leer guía completa →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 13. Buscador y Explorador Interactivo de Guías por Categoría */}
        <section className="py-20 bg-white">
          <div className="wrap">
            <div className="mb-10 text-center">
              <span className="eyebrow" data-reveal>
                Buscador en tiempo real
              </span>
              <SplitHeading
                text="Explora nuestras"
                accent={{
                  text: "guías actualizadas",
                  className: "text-[#0767db]",
                }}
                className="section-title mt-3 text-[#0f172a]"
              />
              <p
                className="mx-auto mt-3 max-w-2xl text-base text-[#4b5563]"
                data-reveal
              >
                Filtra por categoría o escribe el objeto, aerolínea o consejo de
                viaje que necesitas consultar.
              </p>
            </div>

            <BlogExplorerClient
              initialPosts={explorerPosts}
              categories={categories}
            />
          </div>
        </section>

        {/* 14. Preguntas Frecuentes (FAQ) + Botón al Asesor IA */}
        <section className="wrap py-20 border-t border-[var(--line)]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Preguntas frecuentes
              </span>
              <SplitHeading
                text="Respuestas rápidas"
                accent={{ text: "antes de volar", className: "text-[#0767db]" }}
                className="section-title mt-3 text-[#0f172a]"
              />
              <p className="mt-4 text-[#4b5563]" data-reveal>
                ¿Viajas pronto y tienes una duda puntual sobre tu maleta,
                aerolínea o un artículo que quieres subir al avión? Pregúntale a
                nuestro Asesor IA en vivo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="Preguntar al Asesor IA 💬"
                  className="btn btn-buy shine text-sm"
                />
                <Link
                  href="/medidas-equipaje-de-mano/"
                  className="btn btn-ghost text-sm"
                >
                  Tabla de aerolíneas
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="card card-static group p-5 open:shadow-lg"
                  data-reveal
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base sm:text-lg font-extrabold text-[#0f172a]">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f0f7ff] text-[#0767db] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-[#4b5563] leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 15. CTA Final Aeronáutico */}
        <section className="wrap pb-16">
          <div className="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0767db] via-[#03428e] to-[#071326] px-6 py-14 text-white sm:px-14 sm:py-20">
            <div className="hero-grid opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-amber-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="text-center lg:text-left">
                <SplitHeading
                  text="Tu próximo vuelo empieza"
                  accent={{
                    text: "con una maleta bien ordenada",
                    className: "text-amber-300",
                  }}
                  className="text-3xl font-extrabold sm:text-5xl leading-tight"
                />
                <p className="mt-4 text-base sm:text-lg text-sky-100/85">
                  Revisa las medidas oficiales de tu aerolínea o consulta en
                  tiempo real con nuestro Asesor IA de Equipaje y Vuelos para
                  viajar ligero, seguro y sin pagar cargos inesperados.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link
                    href="/medidas-equipaje-de-mano/"
                    className="btn btn-amber shine text-sm sm:text-base"
                    data-magnetic
                  >
                    ✈️ Ver Medidas por Aerolínea
                  </Link>
                  <OpenChatButton
                    label="Abrir Asesor de Equipaje IA 💬"
                    className="btn btn-glass text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[360px]">
                <div className="absolute inset-[12%] rounded-full bg-amber-400/20 blur-3xl" />
                <div className="float-y relative overflow-hidden rounded-3xl border-2 border-white/25 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Cuales-son-las-dimensiones-estandar-del-equipaje-de-mano.jpg"
                    alt="Maleta de cabina lista para embarcar sin cargos extra"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ClientEffects />
    </>
  );
}
