"use client";

import { useEffect } from "react";

export default function ArticleEnhancer() {
  useEffect(() => {
    const containers = document.querySelectorAll<HTMLElement>(
      "#video-container[data-video-id]"
    );
    containers.forEach((container) => {
      if (container.dataset.enhanced === "true") return;
      container.dataset.enhanced = "true";
      container.setAttribute("role", "button");
      container.setAttribute("tabIndex", "0");
      container.setAttribute("aria-label", "Reproducir video de YouTube");

      const activateVideo = () => {
        const videoId = container.getAttribute("data-video-id");
        if (!videoId) return;
        container.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(
          videoId
        )}?autoplay=1&rel=0" title="Video guía de viaje" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:1rem;display:block;"></iframe>`;
      };

      container.addEventListener("click", activateVideo, { once: true });
      container.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activateVideo();
          }
        },
        { once: true }
      );
    });
  }, []);

  return null;
}
