/** SVG animado: cómo los cubos organizadores, el enrollado de prendas y la compresión reducen el volumen un 40% dentro de una maleta de 40 L. */
export default function PackingScience() {
  const drops = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x: 200 + Math.cos(a) * 46,
      y: 210 + Math.sin(a) * 46,
      dx: `${Math.cos(a) * 145}px`,
      dy: `${Math.sin(a) * 145}px`,
      d: `${(i % 6) * 0.65}s`,
      r: 7 + (i % 3) * 2,
    };
  });

  const strands = Array.from({ length: 7 }).map((_, i) => {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    const x1 = 200 + Math.cos(a) * 30,
      y1 = 210 + Math.sin(a) * 30;
    const x2 = 200 + Math.cos(a) * 122,
      y2 = 210 + Math.sin(a) * 122;
    const mx = 200 + Math.cos(a + 0.5) * 80,
      my = 210 + Math.sin(a + 0.5) * 80;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  });

  return (
    <div className="gel-scene relative mx-auto aspect-square w-full max-w-[450px]">
      <svg
        viewBox="0 0 400 420"
        className="h-full w-full"
        role="img"
        aria-label="Ilustración interactiva: compresión por cubos y distribución del volumen en una maleta de cabina de 40 litros"
      >
        <defs>
          <filter id="pk-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
            <feColorMatrix
              in="b"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
          </filter>
          <radialGradient id="pk-core" cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#fde047" />
            <stop offset="0.55" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#0767db" />
          </radialGradient>
          <radialGradient id="pk-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0767db" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="210" r="190" fill="url(#pk-halo)" />
        <circle
          cx="200"
          cy="210"
          r="150"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeDasharray="4 7"
        />

        {/* Silueta punteada de la maleta de 40 L */}
        <rect
          x="118"
          y="108"
          width="164"
          height="204"
          rx="26"
          fill="none"
          stroke="rgba(251,191,36,0.35)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {strands.map((d, i) => (
          <path
            key={i}
            d={d}
            className="fiber-strand"
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.6"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        <g filter="url(#pk-goo)">
          <circle
            className="gel-blob"
            cx="200"
            cy="210"
            r="46"
            fill="url(#pk-core)"
          />
          <circle
            className="gel-blob"
            cx="178"
            cy="196"
            r="26"
            fill="#f59e0b"
            style={{ animationDelay: "0.4s" }}
          />
          <circle
            className="gel-blob"
            cx="224"
            cy="226"
            r="24"
            fill="#0767db"
            style={{ animationDelay: "0.9s" }}
          />
          {drops.map((p, i) => (
            <circle
              key={i}
              className="drop"
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="#38bdf8"
              style={{
                ["--dx" as string]: p.dx,
                ["--dy" as string]: p.dy,
                animationDelay: p.d,
              }}
            />
          ))}
        </g>

        <g fontSize="11.5" fontWeight="700">
          <g transform="translate(14 38)">
            <rect
              width="126"
              height="28"
              rx="14"
              fill="rgba(56,189,248,0.18)"
              stroke="rgba(56,189,248,0.55)"
            />
            <text x="63" y="18" textAnchor="middle" fill="#bae6fd">
              cubos compresores
            </text>
          </g>
          <g transform="translate(262 56)">
            <rect
              width="124"
              height="28"
              rx="14"
              fill="rgba(251,191,36,0.18)"
              stroke="rgba(251,191,36,0.6)"
            />
            <text x="62" y="18" textAnchor="middle" fill="#fef08a">
              enrollado militar
            </text>
          </g>
          <g transform="translate(124 372)">
            <rect
              width="152"
              height="28"
              rx="14"
              fill="rgba(140,198,63,0.2)"
              stroke="rgba(140,198,63,0.65)"
            />
            <text x="76" y="18" textAnchor="middle" fill="#d9f99d">
              40 L · -40% volumen
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
