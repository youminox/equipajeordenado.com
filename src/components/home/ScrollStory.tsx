"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    t: "Abres tu maleta de cabina (55 × 40 × 20 cm)",
    d: "Despliegas las dos mitades rígidas a 180°: un compartimento con cierre de malla y otro con correas elásticas cruzadas.",
  },
  {
    n: "02",
    t: "Empacas la ropa en cubos y líquidos de 100 ml",
    d: "Entran las prendas enrolladas, los cubos organizadores, el calzado en la base y el neceser transparente de 1 L arriba. Cierras con candado TSA.",
  },
  {
    n: "03",
    t: "Embarcas directo a cabina y despega tu avión",
    d: "Tu maleta cerrada de 10 kg sube al compartimento superior sin pasar por facturación ni pagar recargos, lista para volar a tu destino.",
  },
];

/**
 * Escena fijada con GSAP ScrollTrigger (reemplaza el vaso de prunex1.com):
 * 1) Se abre la maleta de cabina mostrando sus compartimentos.
 * 2) Caen y se acomodan la ropa doblada, cubos organizadores, zapatos y bolsa de líquidos 100 ml; se abrochan las cintas y se cierra la maleta.
 * 3) La maleta cerrada aborda el avión comercial y el avión despega surcando el cielo.
 */
export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (reduce) {
          gsap.set(q(".step"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          gsap.set(q(".suitcase-open-group"), { opacity: 0 });
          gsap.set(q(".flight-sky, .stars, .clouds, .plane-scene, .done"), {
            opacity: 1,
          });
          return;
        }

        // Initial states
        gsap.set(q(".clothes-item"), { opacity: 0, y: -95, scale: 0.85 });
        gsap.set(q(".straps-fastened"), { opacity: 0, scaleX: 0.4 });
        gsap.set(q(".suitcase-closed-pack"), { opacity: 0, scale: 0.92 });
        gsap.set(q(".flight-sky, .stars, .clouds, .boarding-badge"), {
          opacity: 0,
        });
        gsap.set(q(".plane-fly"), { opacity: 0, x: -130, y: 70, rotate: 4 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2300",
            scrub: 0.7,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });

        // PASO 1: Abres la maleta de cabina (0 -> 1.1)
        tl.to(q(".step-0"), { opacity: 1, duration: 0.2 }, 0)
          .to(
            q(".step-0 .dot"),
            { backgroundColor: "#0767db", color: "#fff", duration: 0.2 },
            0
          )
          .fromTo(
            q(".lid-closed-initial"),
            { opacity: 1, scaleY: 1 },
            {
              opacity: 0,
              scaleY: 0.15,
              svgOrigin: "200 185",
              duration: 0.65,
              ease: "power2.inOut",
            },
            0.1
          )
          .fromTo(
            q(".lid-open-top"),
            { opacity: 0, scaleY: 0.2 },
            {
              opacity: 1,
              scaleY: 1,
              svgOrigin: "200 185",
              duration: 0.65,
              ease: "power2.out",
            },
            0.35
          )
          .fromTo(
            q(".size-callout"),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.35 },
            0.55
          )
          .to(q(".step-0"), { opacity: 0.75, duration: 0.2 }, 1.15)

          // PASO 2: Metes la ropa, cubos, zapatos y líquidos 100 ml (1.15 -> 2.4)
          .to(q(".step-1"), { opacity: 1, duration: 0.2 }, 1.15)
          .to(
            q(".step-1 .dot"),
            { backgroundColor: "#f59e0b", color: "#0f172a", duration: 0.2 },
            1.15
          )
          .to(
            q(".clothes-item"),
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.12,
              duration: 0.55,
              ease: "back.out(1.3)",
            },
            1.22
          )
          .to(
            q(".straps-fastened"),
            {
              opacity: 1,
              scaleX: 1,
              svgOrigin: "200 285",
              duration: 0.35,
              ease: "power2.out",
            },
            1.95
          )
          // Se cierra la maleta con candado TSA
          .to(
            q(".lid-open-top"),
            {
              opacity: 0,
              scaleY: 0.15,
              svgOrigin: "200 185",
              duration: 0.4,
            },
            2.2
          )
          .to(
            q(".suitcase-open-base, .size-callout"),
            { opacity: 0, duration: 0.35 },
            2.3
          )
          .to(
            q(".suitcase-closed-pack"),
            {
              opacity: 1,
              scale: 1,
              svgOrigin: "200 265",
              duration: 0.4,
              ease: "back.out(1.4)",
            },
            2.28
          )
          .to(q(".step-1"), { opacity: 0.75, duration: 0.2 }, 2.55)

          // PASO 3: La maleta sube al avión y despega (2.55 -> 3.8)
          .to(q(".step-2"), { opacity: 1, duration: 0.2 }, 2.55)
          .to(
            q(".step-2 .dot"),
            { backgroundColor: "#8CC63F", color: "#142600", duration: 0.2 },
            2.55
          )
          .to(q(".flight-sky"), { opacity: 1, duration: 0.55 }, 2.55)
          .to(q(".stars, .clouds"), { opacity: 1, duration: 0.5 }, 2.65)
          // La maleta cerrada se reduce y entra al avión
          .to(
            q(".suitcase-closed-pack"),
            {
              scale: 0.32,
              x: -10,
              y: -35,
              opacity: 0,
              svgOrigin: "200 265",
              duration: 0.5,
              ease: "power2.in",
            },
            2.65
          )
          // El avión aparece y despega cruzando el cielo
          .to(
            q(".plane-fly"),
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: -10,
              svgOrigin: "200 220",
              duration: 0.65,
              ease: "power2.out",
            },
            2.8
          )
          .to(
            q(".plane-fly"),
            {
              x: 28,
              y: -18,
              rotate: -14,
              svgOrigin: "200 220",
              duration: 0.55,
            },
            3.45
          )
          .fromTo(
            q(".boarding-badge"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4 },
            3.1
          )
          .to(q(".done"), { opacity: 1, y: 0, duration: 0.4 }, 3.2)
          .to(q(".bar"), { scaleX: 1, duration: 3.9 }, 0);
      }, el);
    };

    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io?.disconnect();
          init();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="de-la-maleta-al-avion"
      ref={root}
      className="relative bg-gradient-to-b from-white via-[#f0f7ff] to-white"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-10 lg:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="eyebrow">De tu habitación a 35,000 pies</span>
            <h2 className="section-title mt-3 text-[#0f172a]">
              Abres la maleta, empacas tu ropa{" "}
              <span className="text-[#0767db]">y directo al avión.</span>
            </h2>
            <div className="mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-[#0767db] via-[#f59e0b] to-[#8cc63f]" />
            </div>

            <ol className="mt-6 space-y-3 sm:mt-8 sm:space-y-5">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`step step-${i} flex gap-4`}
                  style={{ opacity: 0.78 }}
                >
                  <span className="dot grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white font-extrabold text-[#0f172a] shadow-md border border-[#d6e4f2]">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-lg font-extrabold text-[#0f172a] sm:text-xl">
                      {s.t}
                    </p>
                    <p className="text-sm text-[#4b5563] sm:text-base">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p
              className="done mt-6 hidden text-sm text-[#03428e] font-semibold sm:block"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              ✈️ Regla de oro del viajero inteligente: “Prendas pesadas abajo
              junto a las ruedas, ropa enrollada en cubos al centro y bolsa de
              líquidos 100 ml accesible arriba para el escáner.”
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[430px]">
            <svg
              viewBox="0 0 400 440"
              className="relative w-full drop-shadow-[0_30px_50px_rgba(3,66,142,0.24)]"
              role="img"
              aria-label="Animación interactiva: se abre una maleta de cabina, se empaca la ropa y líquidos de 100 ml, se cierra y termina despegando en un avión"
            >
              <defs>
                <linearGradient id="eo-day" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#dbeafe" />
                  <stop offset="1" stopColor="#f8fafc" />
                </linearGradient>
                <linearGradient id="eo-flight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#021836" />
                  <stop offset="0.6" stopColor="#05387e" />
                  <stop offset="1" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="eo-shell" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#0767db" />
                  <stop offset="1" stopColor="#03428e" />
                </linearGradient>
                <linearGradient id="eo-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fde047" />
                  <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
                <clipPath id="eo-panel">
                  <rect x="0" y="0" width="400" height="440" rx="36" />
                </clipPath>
              </defs>

              <g clipPath="url(#eo-panel)">
                {/* Fondo Día (Habitación / Preparación) */}
                <rect width="400" height="440" fill="url(#eo-day)" />
                <circle
                  cx="332"
                  cy="64"
                  r="28"
                  fill="#fbbf24"
                  opacity="0.35"
                />

                {/* Fondo Vuelo (Cielo de Crucero para Paso 3) */}
                <rect
                  className="flight-sky"
                  width="400"
                  height="440"
                  fill="url(#eo-flight)"
                  opacity="0"
                />

                {/* Estrellas en altitud de crucero */}
                <g className="stars" opacity="0" fill="#ffffff">
                  {[
                    [45, 42, 1.5],
                    [105, 70, 1.2],
                    [165, 32, 1.6],
                    [240, 58, 1.1],
                    [310, 38, 1.5],
                    [358, 82, 1.3],
                    [68, 122, 1.1],
                    [285, 110, 1.2],
                  ].map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} />
                  ))}
                </g>

                {/* Base / Superficie de Empaque */}
                <ellipse
                  cx="200"
                  cy="402"
                  rx="155"
                  ry="18"
                  fill="#cbd5e1"
                  opacity="0.55"
                />

                {/* ==================== MALETA ABIERTA (PASOS 1 Y 2) ==================== */}
                <g className="suitcase-open-base">
                  {/* Asa telescópica superior */}
                  <path
                    d="M170 42 L170 18 Q170 12 178 12 L222 12 Q230 12 230 18 L230 42"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="162"
                    y="8"
                    width="76"
                    height="10"
                    rx="5"
                    fill="#0f172a"
                  />

                  {/* Ruedas 360° */}
                  <rect
                    x="118"
                    y="386"
                    width="16"
                    height="18"
                    rx="5"
                    fill="#1e293b"
                  />
                  <rect
                    x="266"
                    y="386"
                    width="16"
                    height="18"
                    rx="5"
                    fill="#1e293b"
                  />

                  {/* TAPA SUPERIOR ABIERTA (Compartimento de malla superior: y=42..182) */}
                  <g className="lid-open-top" opacity="0">
                    <rect
                      x="96"
                      y="42"
                      width="208"
                      height="140"
                      rx="22"
                      fill="#03428e"
                      stroke="#ffffff"
                      strokeWidth="4"
                    />
                    <rect
                      x="106"
                      y="52"
                      width="188"
                      height="120"
                      rx="16"
                      fill="#eff6ff"
                      stroke="#93c5fd"
                      strokeWidth="2"
                    />
                    {/* Malla organizadora con cierre */}
                    <line
                      x1="106"
                      y1="112"
                      x2="294"
                      y2="112"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <rect
                      x="182"
                      y="106"
                      width="36"
                      height="12"
                      rx="4"
                      fill="#0767db"
                    />
                    <text
                      x="200"
                      y="82"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill="#03428e"
                    >
                      COMPARTIMENTO SUPERIOR · MALLA ZIP
                    </text>
                    <text
                      x="200"
                      y="146"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="#3b82f6"
                    >
                      Documentación · Laptop · Líquidos 100 ml
                    </text>
                  </g>

                  {/* Bisagra central de la maleta */}
                  <rect
                    x="104"
                    y="181"
                    width="192"
                    height="8"
                    rx="4"
                    fill="#1e293b"
                  />

                  {/* BASE INFERIOR DE LA MALETA (Compartimento principal: y=188..388) */}
                  <rect
                    x="96"
                    y="188"
                    width="208"
                    height="200"
                    rx="24"
                    fill="url(#eo-shell)"
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                  {/* Interior acolchado de la maleta */}
                  <rect
                    x="108"
                    y="200"
                    width="184"
                    height="176"
                    rx="16"
                    fill="#f8fafc"
                    stroke="#bfdbfe"
                    strokeWidth="2"
                  />

                  {/* ==================== ROPA, CUBOS Y LÍQUIDOS QUE CAEN DENTRO (PASO 2) ==================== */}
                  {/* Item 1: Cubo organizador azul (Camisetas y pantalones enrollados) */}
                  <g className="clothes-item">
                    <rect
                      x="114"
                      y="206"
                      width="106"
                      height="76"
                      rx="10"
                      fill="#0767db"
                    />
                    <rect
                      x="122"
                      y="214"
                      width="90"
                      height="16"
                      rx="5"
                      fill="#38bdf8"
                    />
                    <rect
                      x="122"
                      y="234"
                      width="90"
                      height="16"
                      rx="5"
                      fill="#7dd3fc"
                    />
                    <rect
                      x="122"
                      y="254"
                      width="90"
                      height="16"
                      rx="5"
                      fill="#bae6fd"
                    />
                    <text
                      x="167"
                      y="226"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill="#071326"
                    >
                      👕 ROPA ENROLLADA
                    </text>
                  </g>

                  {/* Item 2: Cubo ámbar (Casaca y mudas) */}
                  <g className="clothes-item">
                    <rect
                      x="224"
                      y="206"
                      width="62"
                      height="76"
                      rx="10"
                      fill="url(#eo-gold)"
                    />
                    <text
                      x="255"
                      y="240"
                      textAnchor="middle"
                      fontSize="18"
                    >
                      🧥
                    </text>
                    <text
                      x="255"
                      y="262"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="800"
                      fill="#0f172a"
                    >
                      CUBO ROPA
                    </text>
                  </g>

                  {/* Item 3: Calzado / Zapatillas en la base junto a las ruedas */}
                  <g className="clothes-item">
                    <rect
                      x="114"
                      y="288"
                      width="84"
                      height="80"
                      rx="10"
                      fill="#1e293b"
                    />
                    <text
                      x="156"
                      y="324"
                      textAnchor="middle"
                      fontSize="20"
                    >
                      👟
                    </text>
                    <text
                      x="156"
                      y="348"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="800"
                      fill="#f8fafc"
                    >
                      CALZADO BASE
                    </text>
                  </g>

                  {/* Item 4: Bolsa transparente de Líquidos 100 ml + Power Bank */}
                  <g className="clothes-item">
                    <rect
                      x="204"
                      y="288"
                      width="82"
                      height="80"
                      rx="10"
                      fill="#e0f2fe"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    {/* Botellitas de 100 ml */}
                    <rect
                      x="215"
                      y="302"
                      width="14"
                      height="28"
                      rx="3"
                      fill="#0284c7"
                    />
                    <rect
                      x="235"
                      y="302"
                      width="14"
                      height="28"
                      rx="3"
                      fill="#f59e0b"
                    />
                    <rect
                      x="255"
                      y="302"
                      width="14"
                      height="28"
                      rx="3"
                      fill="#8cc63f"
                    />
                    <text
                      x="245"
                      y="348"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="800"
                      fill="#03428e"
                    >
                      💧 100 ml × 1L
                    </text>
                    <text
                      x="245"
                      y="360"
                      textAnchor="middle"
                      fontSize="7.5"
                      fontWeight="700"
                      fill="#0284c7"
                    >
                      🔋 Power Bank
                    </text>
                  </g>

                  {/* Cintas elásticas cruzadas abrochadas sobre la ropa */}
                  <g className="straps-fastened" opacity="0">
                    <line
                      x1="112"
                      y1="204"
                      x2="288"
                      y2="372"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="288"
                      y1="204"
                      x2="112"
                      y2="372"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <rect
                      x="184"
                      y="276"
                      width="32"
                      height="22"
                      rx="5"
                      fill="#0f172a"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>

                  {/* TAPA CERRADA INICIAL (Antes de abrir en Paso 1) */}
                  <g className="lid-closed-initial">
                    <rect
                      x="96"
                      y="188"
                      width="208"
                      height="200"
                      rx="24"
                      fill="url(#eo-shell)"
                      stroke="#ffffff"
                      strokeWidth="4"
                    />
                    {/* Ranuras rígidas de policarbonato */}
                    {[225, 255, 285, 315, 345].map((y) => (
                      <line
                        key={y}
                        x1="122"
                        y1={y}
                        x2="278"
                        y2={y}
                        stroke="rgba(255,255,255,0.28)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    ))}
                    <rect
                      x="166"
                      y="268"
                      width="68"
                      height="28"
                      rx="8"
                      fill="#f59e0b"
                    />
                    <text
                      x="200"
                      y="286"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill="#0f172a"
                    >
                      ABRIR 🧳
                    </text>
                  </g>
                </g>

                {/* Etiqueta de medidas estándar */}
                <g className="size-callout" opacity="0">
                  <rect
                    x="18"
                    y="196"
                    width="68"
                    height="46"
                    rx="10"
                    fill="#0f172a"
                  />
                  <text
                    x="52"
                    y="216"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#fbbf24"
                  >
                    55×40×20
                  </text>
                  <text
                    x="52"
                    y="231"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    Máx. 10 kg
                  </text>
                </g>

                {/* ==================== MALETA CERRADA Y SELLADA TSA (FIN PASO 2) ==================== */}
                <g className="suitcase-closed-pack" opacity="0">
                  <path
                    d="M175 160 L175 125 Q175 118 182 118 L218 118 Q225 118 225 125 L225 160"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="6"
                  />
                  <rect
                    x="104"
                    y="156"
                    width="192"
                    height="224"
                    rx="26"
                    fill="url(#eo-shell)"
                    stroke="#ffffff"
                    strokeWidth="4"
                  />
                  {[196, 228, 260, 292, 324, 352].map((y) => (
                    <line
                      key={y}
                      x1="130"
                      y1={y}
                      x2="270"
                      y2={y}
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  ))}
                  {/* Tag TSA aprobado */}
                  <rect
                    x="142"
                    y="246"
                    width="116"
                    height="40"
                    rx="12"
                    fill="#8CC63F"
                  />
                  <text
                    x="200"
                    y="264"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#142600"
                  >
                    🔒 TSA CERRADA
                  </text>
                  <text
                    x="200"
                    y="278"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="800"
                    fill="#142600"
                  >
                    9.8 KG · LISTA
                  </text>
                </g>

                {/* ==================== ESCENA DE AVIÓN DESPEGANDO (PASO 3) ==================== */}
                {/* Nubes de altitud */}
                <g className="clouds" opacity="0" fill="rgba(255,255,255,0.18)">
                  <ellipse cx="85" cy="340" rx="65" ry="22" />
                  <ellipse cx="130" cy="348" rx="50" ry="18" />
                  <ellipse cx="315" cy="320" rx="75" ry="24" />
                  <ellipse cx="265" cy="332" rx="48" ry="18" />
                </g>

                {/* Avión Comercial en Despegue con la Maleta a Bordo */}
                <g className="plane-fly" opacity="0">
                  {/* Estelas de condensación */}
                  <line
                    x1="20"
                    y1="275"
                    x2="135"
                    y2="245"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="4"
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="35"
                    y1="298"
                    x2="165"
                    y2="262"
                    stroke="rgba(251,191,36,0.5)"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                  />

                  {/* Ala trasera */}
                  <polygon
                    points="175,215 130,165 158,162 215,208"
                    fill="#93c5fd"
                  />

                  {/* Cola / Estabilizador vertical */}
                  <polygon
                    points="92,235 64,172 104,175 132,226"
                    fill="#0767db"
                  />
                  <circle cx="88" cy="196" r="7" fill="#fbbf24" />

                  {/* Fuselaje principal del avión */}
                  <path
                    d="M78 232 L292 192 C328 186 356 198 362 212 C356 228 328 238 292 242 L92 256 C78 256 72 244 78 232 Z"
                    fill="#ffffff"
                    stroke="#bae6fd"
                    strokeWidth="2.5"
                  />

                  {/* Franja aerolínea azul y ámbar */}
                  <path
                    d="M84 242 L344 206 L336 216 L88 250 Z"
                    fill="#0767db"
                  />

                  {/* Ventanillas de cabina + Cabina de pilotos */}
                  <path
                    d="M316 198 C334 198 346 204 348 210 L314 213 Z"
                    fill="#022c61"
                  />
                  {[145, 165, 185, 205, 225, 245, 265, 285].map((x, idx) => (
                    <circle
                      key={idx}
                      cx={x}
                      cy={224 - idx * 1.9}
                      r="3.5"
                      fill="#03428e"
                    />
                  ))}

                  {/* Mini-icono de la maleta en cabina iluminado */}
                  <rect
                    x="196"
                    y="198"
                    width="24"
                    height="18"
                    rx="4"
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <text
                    x="208"
                    y="210"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="900"
                    fill="#0f172a"
                  >
                    10K
                  </text>

                  {/* Ala delantera principal + Turbina */}
                  <polygon
                    points="190,236 135,305 172,302 246,232"
                    fill="#e2e8f0"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="188"
                    y="258"
                    width="36"
                    height="16"
                    rx="7"
                    fill="#03428e"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>

                {/* Insignia de Embarque Aprobado en Paso 3 */}
                <g className="boarding-badge" opacity="0">
                  <rect
                    x="70"
                    y="352"
                    width="260"
                    height="46"
                    rx="23"
                    fill="rgba(15, 23, 42, 0.88)"
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                  <text
                    x="200"
                    y="373"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill="#fbbf24"
                  >
                    ✈️ CABINA APROBADA · 0 CARGOS EXTRA
                  </text>
                  <text
                    x="200"
                    y="388"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="600"
                    fill="#e0f2fe"
                  >
                    Maleta 55×40×20 cm + Artículo Personal a Bordo
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
