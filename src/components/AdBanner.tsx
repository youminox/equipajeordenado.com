"use client";

import { useEffect } from "react";
import { ADSENSE_ID } from "@/lib/data";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  format?: "auto" | "fluid" | "rectangle";
  layout?: "in-article";
  className?: string;
}

export default function AdBanner({
  format = "auto",
  layout,
  className = "my-8",
}: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore AdSense push warnings when auto-ads already initialized slot
    }
  }, []);

  return (
    <div
      className={`w-full overflow-hidden text-center flex flex-col items-center justify-center ${className}`}
      aria-label="Espacio publicitario"
    >
      <span className="mb-1 text-[10px] font-medium uppercase tracking-widest text-gray-400">
        Publicidad
      </span>
      <div className="min-h-[90px] w-full rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-center p-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={ADSENSE_ID}
          data-ad-format={format}
          {...(layout ? { "data-ad-layout": layout } : {})}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
