"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import HeroSearch from "@/components/HeroSearch";
import { openEquipajeChat } from "@/lib/chat-constants";

/** Partículas sutiles en canvas (ámbar / celeste / azul) que reaccionan al puntero. */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = false;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const COLORS = [
      "251,191,36",
      "245,158,11",
      "56,189,248",
      "125,211,252",
      "7,103,219",
      "255,255,255",
    ];
    const N = w < 700 ? 42 : 100;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.3 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.55 + 0.25,
    }));
    let mx = -999,
      my = -999;
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mx,
          dy = p.y - my,
          d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          p.vx += (dx / 4000) * f;
          p.vy += (dy / 4000) * f;
        }
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 - 0.006;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? play() : pause()
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ric =
      (window as any).requestIdleCallback ||
      ((f: () => void) => setTimeout(f, 300));
    ric(() => io.observe(c));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function Hero({
  totalGuides,
  totalCategories,
}: {
  totalGuides: number;
  totalCategories: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01)
        raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 20;
      ty = -(e.clientY / window.innerHeight - 0.5) * 15;
      kick();
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-16, Math.min(16, e.gamma / 2));
      ty = Math.max(-12, Math.min(12, (e.beta - 45) / 3));
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  const words = ["Equipaje", "de", "Mano"];
  const subWords = ["Medidas,", "peso", "y", "reglas", "de", "cabina"];

  return (
    <section className="hero min-h-[calc(100svh-80px)] py-12 lg:py-16">
      <div className="hero-aurora" />
      <div className="hero-grid" />
      <Particles />
      <div className="wrap grid min-h-[calc(100svh-140px)] items-center gap-10 lg:grid-cols-[1.12fr_0.95fr]">
        <div className="relative z-10">
          <span className="chip">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />{" "}
            ✈️ Centro Experto en Equipaje de Cabina · 20 Aerolíneas Verificadas
          </span>

          <h1 className="hero-title mt-6">
            <span className="block">
              {words.map((w, i) => (
                <span key={w}>
                  <span
                    className="hw"
                    style={{
                      animationDelay: `${0.08 + i * 0.12}s, ${-i * 1.2}s`,
                    }}
                  >
                    {w}
                  </span>
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </span>{" "}
            <span className="mt-4 block text-[0.42em] font-bold leading-[1.22] tracking-[-0.02em] text-white/90">
              {subWords.map((w, i) => (
                <Fragment key={w + i}>
                  <span className="reveal-word">
                    <span style={{ animationDelay: `${0.42 + i * 0.06}s` }}>
                      {w}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
              <span className="reveal-word">
                <span
                  style={{ animationDelay: "0.82s" }}
                  className="text-amber-300"
                >
                  sin pagar cargos extra
                </span>
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-sky-100/85">
            Consulta las{" "}
            <strong className="text-white">
              dimensiones exactas por aerolínea, la regla de líquidos de 100 ml,
              artículos permitidos en cabina y comparativas de maletas
            </strong>{" "}
            para preparar tu equipaje con precisión y embarcar sin sorpresas.
          </p>

          {/* Search Bar */}
          <div className="mt-7 max-w-xl">
            <HeroSearch />
          </div>

          {/* Primary CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/medidas-equipaje-de-mano/"
              className="btn btn-amber shine text-sm sm:text-base"
              data-magnetic
            >
              📏 Tabla de Medidas por Aerolínea
            </Link>
            <button
              type="button"
              onClick={() => openEquipajeChat()}
              className="btn btn-glass text-sm sm:text-base cursor-pointer"
              data-magnetic
            >
              Consultar al Asesor IA 💬
            </button>
          </div>

          {/* Quick Category Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/que-se-puede-llevar-en-el-equipaje-de-mano/"
              className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-sky-100 transition hover:bg-white hover:text-[#03428e]"
            >
              🧴 Qué Llevar en Cabina
            </Link>
            <Link
              href="/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/"
              className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-sky-100 transition hover:bg-white hover:text-[#03428e]"
            >
              💧 Líquidos 100 ml
            </Link>
            <Link
              href="/marcas/"
              className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-sky-100 transition hover:bg-white hover:text-[#03428e]"
            >
              🧳 Mejores Marcas
            </Link>
            <Link
              href="/equipaje-de-mano/"
              className="rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-300 hover:text-gray-950"
            >
              📘 Guía Completa →
            </Link>
          </div>

          {/* Key Stats */}
          <ul
            className="mt-8 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-3"
            aria-label="Cifras clave del portal"
          >
            {[
              [String(totalGuides), "+", "Guías de equipaje"],
              ["20", "líneas", "Medidas verificadas"],
              [String(totalCategories), "temas", "Categorías de viaje"],
            ].map(([v, u, l], i) => (
              <li
                key={l}
                className="glass px-3 py-3 sm:px-4"
                style={{
                  animation: `fadeup .8s ${0.85 + i * 0.1}s cubic-bezier(.2,.8,.2,1) both`,
                }}
              >
                <p className="text-xl font-extrabold text-white sm:text-2xl">
                  {v}
                  {u && (
                    <span className="ml-1 text-xs font-bold text-amber-300">
                      {u}
                    </span>
                  )}
                </p>
                <p className="text-[0.72rem] leading-tight text-sky-100/75 sm:text-xs">
                  {l}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 3D Tilt Stage */}
        <div className="tilt-stage relative z-10 mx-auto w-full max-w-[540px]">
          <div ref={card} className="tilt-card relative">
            <div className="tilt-glow" />
            <div className="halo-ring" />
            <div
              className="relative"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="float-y glass p-4 sm:p-5 shadow-[0_40px_70px_rgba(0,0,0,0.55)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#071326]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Cuales-son-las-dimensiones-estandar-del-equipaje-de-mano.jpg"
                    alt="Maleta de cabina ordenada según las medidas estándar de aerolíneas"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071326]/90 via-[#071326]/20 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        ✓ Estándar Cabina IATA
                      </span>
                      <p className="mt-1.5 text-base sm:text-lg font-extrabold text-white leading-tight">
                        Carry-On + Artículo Personal Bajo Asiento
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotating Circular Badge */}
            <div
              className="price-badge -right-1 -top-4 sm:right-2 sm:-top-5"
              aria-label="Estándar de cabina 55 por 40 por 20 centímetros, 10 kilos"
            >
              <svg viewBox="0 0 124 124" aria-hidden="true">
                <defs>
                  <path
                    id="pb-circle"
                    d="M62,62 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0"
                  />
                </defs>
                <text fontSize="8.8" fontWeight="800" fill="#0f172a">
                  <textPath
                    href="#pb-circle"
                    textLength="300"
                    lengthAdjust="spacing"
                  >
                    EQUIPAJE DE CABINA · MEDIDAS OFICIALES ·
                  </textPath>
                </text>
              </svg>
              <div className="relative">
                <p className="text-[1.45rem] font-extrabold leading-none">
                  10 kg
                </p>
                <p className="mt-0.5 text-[0.62rem] font-extrabold">
                  55×40×20 cm
                </p>
              </div>
            </div>

            <div
              className="absolute -left-2 -bottom-4 hidden rounded-2xl border border-white/20 bg-[#071326]/90 px-4 py-3 shadow-xl backdrop-blur sm:block"
              style={{ transform: "translateZ(80px)" }}
            >
              <p className="text-[0.68rem] uppercase tracking-wider text-sky-300">
                Regla de Líquidos TSA / UE
              </p>
              <p className="font-extrabold text-sm text-white">
                💧 Máx. 100 ml · Bolsa 1 Litro
              </p>
            </div>

            <div
              className="absolute bottom-[36%] -right-3 hidden rounded-full border border-white/20 bg-[#071326]/85 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur md:block shadow-lg"
              style={{ transform: "translateZ(110px)" }}
            >
              🔒 Candado TSA · Power Bank ≤ 100 Wh
            </div>
          </div>
        </div>
      </div>

      <a
        href="#que-es"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/50 lg:flex"
        aria-label="Bajar a cómo funciona Equipaje Ordenado"
      >
        <span className="h-10 w-6 rounded-full border border-white/30 p-1">
          <span className="block h-2 w-full animate-bounce rounded-full bg-amber-400" />
        </span>
      </a>
    </section>
  );
}
