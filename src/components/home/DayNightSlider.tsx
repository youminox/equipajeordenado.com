"use client";

import { useCallback, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Escena arrastrable Día ↔ Noche: Vuelo Diurno vs. Vuelo Nocturno (Red-Eye) desde la terminal hasta el avión. */
export default function DayNightSlider() {
  const [v, setV] = useState(22);
  const [touched, setTouched] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const t = v / 100;
  const dusk = clamp(1 - Math.abs(t - 0.5) * 2.4);
  const night = clamp((t - 0.45) / 0.45);
  const stars = clamp((t - 0.62) / 0.3);
  const sunX = 110 + t * 520;
  const sunY = 95 + Math.pow(t, 1.6) * 330;
  const sunO = 1 - clamp((t - 0.55) / 0.2);
  const moonY = 420 - clamp((t - 0.5) / 0.5) * 320;
  const hour = 7 + t * 15;
  const hh = Math.floor(hour);
  const mm = Math.round(((hour - hh) * 60) / 15) * 15;
  const time = `${String(hh + (mm === 60 ? 1 : 0)).padStart(2, "0")}:${String(
    mm === 60 ? 0 : mm
  ).padStart(2, "0")}`;
  const phase =
    t < 0.34
      ? "Vuelo Matutino · 07:00–12:00"
      : t < 0.67
      ? "Embarque de Tarde · 12:00–18:00"
      : "Vuelo Nocturno (Red-Eye) · 18:00–22:00";

  const tip =
    t < 0.34
      ? "Control rápido: lleva tu bolsa 100 ml y laptop en el bolsillo superior."
      : t < 0.67
      ? "Vuelos con alta ocupación: llega temprano a puerta para asegurar compartimento."
      : "Vuelo nocturno: antifaz, cuello cervical y abrigo ligero en tu artículo personal.";

  const fromPointer = useCallback((clientX: number) => {
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setV(Math.round(clamp((clientX - r.left) / r.width) * 100));
    setTouched(true);
  }, []);

  return (
    <div className="daynight bg-[#071326] shadow-[0_40px_80px_-40px_rgba(7,19,38,0.75)]">
      <div
        ref={scene}
        className="relative aspect-[4/5] cursor-ew-resize select-none sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") {
            if (
              (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)
            )
              fromPointer(e.clientX);
          }
        }}
      >
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dn-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#e0f2fe" />
            </linearGradient>
            <linearGradient id="dn-dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1e3a8a" />
              <stop offset="0.55" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="dn-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#020813" />
              <stop offset="0.7" stopColor="#071a3e" />
              <stop offset="1" stopColor="#03428e" />
            </linearGradient>
            <radialGradient id="dn-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff7d1" />
              <stop offset="0.5" stopColor="#ffd166" />
              <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dn-runway" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="450" fill="url(#dn-day)" />
          <rect width="800" height="450" fill="url(#dn-dusk)" opacity={dusk} />
          <rect
            width="800"
            height="450"
            fill="url(#dn-night)"
            opacity={night}
          />

          {/* Estrellas */}
          <g opacity={stars} fill="#fff">
            {[
              [60, 40, 1.6],
              [140, 90, 1.1],
              [230, 30, 1.4],
              [320, 70, 1],
              [410, 25, 1.5],
              [500, 85, 1.1],
              [590, 35, 1.3],
              [690, 70, 1],
              [760, 30, 1.4],
              [100, 150, 1],
              [380, 130, 0.9],
              [720, 140, 1.2],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>

          {/* Sol y Luna */}
          <g opacity={sunO}>
            <circle cx={sunX} cy={sunY} r="90" fill="url(#dn-sun)" />
            <circle cx={sunX} cy={sunY} r="30" fill="#ffe08a" />
          </g>
          <g
            transform={`translate(640 ${moonY})`}
            opacity={clamp((t - 0.5) / 0.25)}
          >
            <circle r="30" fill="#fdf3d8" />
            <circle
              cx="12"
              cy="-8"
              r="26"
              fill="#051329"
              opacity={0.9 * night + 0.1}
            />
          </g>

          {/* Avión cruzando el cielo a lo lejos */}
          <g transform={`translate(${140 + t * 440} ${125 - Math.sin(t * Math.PI) * 35})`}>
            <line
              x1="-75"
              y1="8"
              x2="-6"
              y2="3"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            <path
              d="M0 0 L34 -5 C42 -6 48 -3 50 0 C48 3 42 5 34 5 L2 6 Z"
              fill="#ffffff"
            />
            <polygon points="16,1 6,-12 14,-12 26,0" fill="#38bdf8" />
            <polygon points="2,1 -6,-10 2,-10 8,0" fill="#f59e0b" />
          </g>

          {/* Horizonte, torre de control y pista de aterrizaje */}
          <path
            d="M0 325 C140 295 240 305 360 320 C480 290 600 300 800 315 L800 450 L0 450 Z"
            fill={night > 0.5 ? "#0b1d3a" : "#7dd3fc"}
            opacity="0.85"
          />
          {/* Torre de control del aeropuerto */}
          <g fill={t > 0.5 ? "#0f172a" : "#334155"}>
            <rect x="615" y="218" width="16" height="110" />
            <polygon points="598,218 648,218 656,192 590,192" />
            <rect x="621" y="168" width="4" height="24" />
            <circle
              cx="623"
              cy="166"
              r="4"
              fill="#ef4444"
              opacity={0.4 + night * 0.6}
            />
            {/* Terminal */}
            <rect x="460" y="282" width="145" height="46" rx="4" />
          </g>

          {/* Luces de pista y terminal de noche */}
          <g fill="#fbbf24" opacity={night}>
            {[475, 495, 515, 535, 555, 575, 602, 614, 626, 638].map((x, i) => (
              <rect
                key={i}
                x={x}
                y={i > 5 ? 198 : 296}
                width="8"
                height="8"
                rx="1"
              />
            ))}
          </g>

          {/* Pista y plataforma de embarque */}
          <circle
            cx="400"
            cy="345"
            r="200"
            fill="url(#dn-runway)"
            opacity={night}
          />
          <rect
            x="0"
            y="386"
            width="800"
            height="64"
            fill={night > 0.5 ? "#0f172a" : "#475569"}
          />
          <rect
            x="0"
            y="382"
            width="800"
            height="6"
            fill="#f59e0b"
            opacity="0.85"
          />

          {/* Luces guía de pista */}
          {[70, 150, 230, 310, 490, 570, 650, 730].map((x) => (
            <circle
              key={x}
              cx={x}
              cy="415"
              r="4"
              fill={night > 0.4 ? "#38bdf8" : "#cbd5e1"}
            />
          ))}

          {/* Maleta de cabina Carry-On y Mochila Personal listas en primer plano */}
          <g transform="translate(340 245)">
            {/* Asa telescópica */}
            <path
              d="M36 0 L36 -28 Q36 -34 42 -34 L68 -34 Q74 -34 74 -28 L74 0"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="5"
            />
            <rect x="30" y="-38" width="50" height="8" rx="4" fill="#f59e0b" />
            {/* Cuerpo de maleta rígida */}
            <rect
              x="10"
              y="0"
              width="90"
              height="132"
              rx="16"
              fill="#0767db"
              stroke="#ffffff"
              strokeWidth="3"
            />
            {[26, 50, 74, 98].map((y) => (
              <line
                key={y}
                x1="24"
                y1={y}
                x2="86"
                y2={y}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
            {/* Etiqueta de cabina */}
            <rect
              x="28"
              y="42"
              width="54"
              height="22"
              rx="6"
              fill="#f59e0b"
            />
            <text
              x="55"
              y="56"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="900"
              fill="#0f172a"
            >
              CABINA
            </text>
            {/* Ruedas */}
            <circle cx="26" cy="138" r="6" fill="#0f172a" />
            <circle cx="84" cy="138" r="6" fill="#0f172a" />

            {/* Mochila / Artículo personal junto a la maleta */}
            <g transform="translate(108 56)">
              <path
                d="M12 0 Q32 -12 52 0 L58 72 Q58 82 46 82 L18 82 Q6 82 6 72 Z"
                fill="#03428e"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <rect
                x="15"
                y="34"
                width="34"
                height="34"
                rx="8"
                fill="#0284c7"
              />
              <line
                x1="20"
                y1="44"
                x2="44"
                y2="44"
                stroke="#fbbf24"
                strokeWidth="2.5"
              />
            </g>
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/30 bg-black/35 px-4 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-amber-300">
            {phase}
          </p>
          <p className="text-3xl font-extrabold tabular-nums">{time}</p>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 max-w-[54%] rounded-2xl border border-white/30 bg-black/35 px-4 py-3 text-right text-white backdrop-blur-md sm:right-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sky-300">
            Estándar de cabina 24/7
          </p>
          <p className="text-xs font-bold leading-snug sm:text-sm">{tip}</p>
        </div>

        {!touched && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-extrabold text-[#03428e] shadow-lg sm:bottom-5 sm:px-4 sm:py-2 sm:text-sm">
            ← Arrastra para pasar del vuelo diurno al nocturno →
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 bg-[#071326] px-5 py-4 text-white sm:px-7">
        <span aria-hidden="true">☀️</span>
        <label className="sr-only" htmlFor="dn-range">
          Hora del vuelo en la escena
        </label>
        <input
          id="dn-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(Number(e.target.value));
            setTouched(true);
          }}
          aria-valuetext={`${phase}, ${time}`}
        />
        <span aria-hidden="true">🌙</span>
      </div>
    </div>
  );
}
