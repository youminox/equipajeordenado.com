"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { openEquipajeChat } from "@/lib/chat-constants";

/**
 * Efectos globales de página (estilo prunex1.com):
 * - Activa [data-reveal], .split y .gel-scene al entrar en el viewport
 * - Spotlight radial (.spot) que sigue al cursor
 * - Botones magnéticos ([data-magnetic])
 * - Barra fija inferior en móvil tras 700 px de scroll
 */
export default function ClientEffects({
  stickyBar = true,
}: {
  stickyBar?: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );

    const scan = () =>
      document
        .querySelectorAll(
          "[data-reveal]:not(.is-in), .split:not(.is-in), .gel-scene:not(.is-in)"
        )
        .forEach((el) => io.observe(el));

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const t = target?.closest?.(".spot") as HTMLElement | null;
      if (t) {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${e.clientX - r.left}px`);
        t.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (!fine) return;
      const m = target?.closest?.("[data-magnetic]") as HTMLElement | null;
      if (magnet && magnet !== m) {
        magnet.style.transform = "";
        magnet = null;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
        magnet = m;
      }
    };

    const onLeave = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };

    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!stickyBar) return null;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 md:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-white/15 bg-[#0b1820]/95 p-2.5 pl-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="leading-tight min-w-0">
          <p className="text-[0.68rem] uppercase tracking-wider text-sky-300/80">
            Cabina · 20 Aerolíneas
          </p>
          <p className="text-sm font-extrabold truncate">
            55×40×20 cm{" "}
            <span className="text-xs font-semibold text-amber-300">
              · 10 kg
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/medidas-equipaje-de-mano/"
            className="rounded-full bg-white/15 px-3.5 py-2.5 text-xs font-bold text-white"
          >
            Medidas
          </Link>
          <button
            type="button"
            onClick={() => openEquipajeChat()}
            className="btn btn-amber shine !px-4 !py-2.5 text-xs cursor-pointer"
          >
            Asesor IA 💬
          </button>
        </div>
      </div>
    </div>
  );
}
