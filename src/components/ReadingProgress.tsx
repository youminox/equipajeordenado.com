"use client";

import { useEffect, useRef } from "react";

export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div
      ref={ref}
      className="progress-bar w-full"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}
