/**
 * Client-safe helpers and constants.
 *
 * IMPORTANT: this module must NEVER import data/posts.json (20 MB). Client
 * components ("use client") import from here or from ./airlines — importing
 * ./data from a client component ships every post to the browser.
 */

export const SITE_NAME = "Equipaje Ordenado";
export const SITE_URL = "https://equipajeordenado.com";
export const SITE_DESCRIPTION =
  "Guías prácticas sobre equipaje de mano: medidas y peso por aerolínea, qué líquidos y objetos puedes llevar en cabina, seguros de equipaje y las mejores maletas de cabina.";
export const ADSENSE_ID = "ca-pub-1070738569472471";
export const GA_ID = "G-BVHPKNW89H";
export const AUTHOR_NAME = "Charlie Lingán";
export const AUTHOR_URL = `${SITE_URL}/hola-hablamos/`;

export function getPostUrl(post: { category: string; slug: string }): string {
  return `/${post.category}/${post.slug}/`;
}

export function getCategoryUrl(
  category: { slug: string } | string
): string {
  const slug = typeof category === "string" ? category : category.slug;
  return `/${slug}/`;
}

export function cleanImageFilename(url: string): string {
  const raw = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "");
  const dotIdx = raw.lastIndexOf(".");
  const name = dotIdx > 0 ? raw.slice(0, dotIdx) : raw;
  const ext = dotIdx > 0 ? raw.slice(dotIdx).toLowerCase() : ".jpg";
  const asciiName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "");
  const validExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
    ? ext
    : ".jpg";
  return `${asciiName || "imagen"}${validExt}`;
}

export function getImageUrl(url: string): string {
  if (!url) return "/images/Charlie-Lingan.jpg";
  if (url.startsWith("/images/")) return url;
  if (url.includes("equipajeordenado.com/wp-content/uploads/")) {
    return `/images/${cleanImageFilename(url)}`;
  }
  return url;
}

export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  const cleaned = content.replace(/<noscript>[\s\S]*?<\/noscript>/gi, " ");
  const text = cleaned
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/** "2024-06-21 19:42:52" -> Date (UTC). Returns undefined on bad input. */
export function parseWpDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value.replace(" ", "T") + (value.includes("Z") ? "" : "Z"));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function toIsoDate(value?: string): string | undefined {
  return parseWpDate(value)?.toISOString();
}

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-11-21 10:00:00" -> "21 de noviembre de 2026" */
export function formatDateEs(value?: string): string {
  const d = parseWpDate(value);
  if (!d) return "";
  return `${d.getUTCDate()} de ${MONTHS_ES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}
