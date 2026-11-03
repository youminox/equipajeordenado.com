import postsData from "../../data/posts.json";
import categoriesData from "../../data/categories.json";
import pagesData from "../../data/pages.json";
import type { Post, Category } from "./types";

const posts: Post[] = postsData as Post[];
const categories: Category[] = categoriesData as Category[];
const pages: Post[] = pagesData as Post[];

export const SITE_NAME = "Equipaje Ordenado";
export const SITE_URL = "https://equipajeordenado.com";
export const SITE_DESCRIPTION =
  "Guía experta sobre equipaje de mano, medidas permitidas por aerolíneas, reseñas de las mejores maletas de cabina, destinos y consejos para viajar ligero y sin estrés.";
export const ADSENSE_ID = "ca-pub-1070738569472471";
export const GA_ID = "G-BVHPKNW89H";

export function getAllPosts(): Post[] {
  return posts;
}

export function getAllPages(): Post[] {
  return pages;
}

export function getPageBySlug(slug: string): Post | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategorySlug(categorySlug: string): Post[] {
  return posts.filter(
    (p) =>
      p.category === categorySlug ||
      p.categories.some((c) => c.slug === categorySlug)
  );
}

const FEATURED_SLUGS = [
  "que-se-considera-como-equipaje-de-mano",
  "cuales-son-las-dimensiones-estandar-del-equipaje-de-mano",
  "como-elegir-el-mejor-equipaje-de-mano",
  "que-es-permitido-llevar-en-el-equipaje-de-mano",
  "como-maximizar-el-espacio-en-el-equipaje-de-mano",
  "cuales-son-las-politicas-de-equipaje-de-mano-de-las-principales-aerolineas",
];

export function getFeaturedPosts(limit: number = 6): Post[] {
  const featured: Post[] = [];
  for (const slug of FEATURED_SLUGS) {
    const found = posts.find((p) => p.slug === slug && p.featuredImageUrl);
    if (found) featured.push(found);
    if (featured.length >= limit) return featured;
  }
  for (const p of posts) {
    if (p.featuredImageUrl && !featured.some((f) => f.id === p.id)) {
      featured.push(p);
      if (featured.length >= limit) break;
    }
  }
  return featured;
}

export function getRecentPosts(limit: number = 12): Post[] {
  const featuredIds = new Set(FEATURED_SLUGS);
  const catCounts = new Map<string, number>();
  const selected: Post[] = [];

  for (const p of posts) {
    if (featuredIds.has(p.slug)) continue;
    const count = catCounts.get(p.category) || 0;
    if (count >= 2) continue;
    selected.push(p);
    catCounts.set(p.category, count + 1);
    if (selected.length >= limit) break;
  }

  return selected.length > 0 ? selected : posts.slice(0, limit);
}

export function getRelatedPosts(post: Post, limit: number = 4): Post[] {
  const sameCategory = posts.filter((p) => p.category === post.category);
  if (sameCategory.length <= 1) return [];

  const currentIndex = sameCategory.findIndex((p) => p.id === post.id);
  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
  const related: Post[] = [];

  for (
    let i = 0;
    i < sameCategory.length - 1 && related.length < limit;
    i++
  ) {
    const candidate = sameCategory[(startIndex + i) % sameCategory.length];
    if (candidate.id !== post.id) {
      related.push(candidate);
    }
  }

  return related;
}

export function getContextualRelatedPosts(
  post: Post,
  limit: number = 3
): Post[] {
  const sameCategory = posts.filter((p) => p.category === post.category);
  if (sameCategory.length <= 1) return [];

  const currentIndex = sameCategory.findIndex((p) => p.id === post.id);
  const startIndex = currentIndex >= 0 ? currentIndex + 5 : 4;
  const related: Post[] = [];

  for (
    let i = 0;
    i < sameCategory.length - 1 && related.length < limit;
    i++
  ) {
    const candidate = sameCategory[(startIndex + i) % sameCategory.length];
    if (candidate.id !== post.id) {
      related.push(candidate);
    }
  }

  return related;
}

export function getAllCategories(): Category[] {
  return [...categories].sort((a, b) => b.count - a.count);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getPostUrl(post: Post): string {
  return `/${post.category}/${post.slug}/`;
}

export function getCategoryUrl(
  category: Category | { slug: string } | string
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

export interface AirlineRule {
  id: string;
  name: string;
  cabinSize: string;
  cabinWeight: string;
  personalItem: string;
  notes: string;
  guideUrl: string;
}

export const AIRLINE_RULES: AirlineRule[] = [
  {
    id: "iberia",
    name: "Iberia",
    cabinSize: "56 x 40 x 25 cm",
    cabinWeight: "10 kg",
    personalItem: "40 x 30 x 15 cm",
    notes:
      "Incluye ruedas y asas. El bolso o mochila personal debe colocarse debajo del asiento delantero.",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "ryanair",
    name: "Ryanair",
    cabinSize: "55 x 40 x 20 cm",
    cabinWeight: "10 kg (Con Prioridad)",
    personalItem: "40 x 20 x 25 cm (Gratis)",
    notes:
      "La tarifa estándar incluye sin costo una pieza pequeña bajo el asiento (40 x 20 x 25 cm).",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "latam",
    name: "LATAM Airlines",
    cabinSize: "55 x 35 x 25 cm",
    cabinWeight: "10 kg a 12 kg",
    personalItem: "45 x 35 x 20 cm",
    notes:
      "Revisa según tu tarifa si tienes incluida la maleta de cabina en el compartimento superior.",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "avianca",
    name: "Avianca",
    cabinSize: "55 x 35 x 25 cm",
    cabinWeight: "10 kg",
    personalItem: "45 x 35 x 25 cm",
    notes:
      "El artículo personal está incluido en todas las tarifas; la maleta de mano depende de la categoría del boleto.",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "vueling",
    name: "Vueling",
    cabinSize: "55 x 40 x 20 cm",
    cabinWeight: "10 kg",
    personalItem: "40 x 20 x 30 cm",
    notes:
      "Todas las tarifas permiten llevar gratis una pieza debajo del asiento de hasta 40 x 20 x 30 cm.",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "air-europa",
    name: "Air Europa",
    cabinSize: "55 x 35 x 25 cm",
    cabinWeight: "10 kg (Turista) / 14 kg (Business)",
    personalItem: "40 x 30 x 15 cm",
    notes:
      "Tanto la maleta de cabina como el accesorio personal están incluidos en las tarifas estándar.",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "american",
    name: "American Airlines",
    cabinSize: "56 x 36 x 23 cm",
    cabinWeight: "Sin límite fijo de peso",
    personalItem: "45 x 35 x 20 cm",
    notes:
      "Permite 1 maleta de mano + 1 artículo personal gratis en cabina para todas las tarifas principales.",
    guideUrl: "/reglas-de-equipaje/",
  },
  {
    id: "klm",
    name: "KLM",
    cabinSize: "55 x 35 x 25 cm",
    cabinWeight: "12 kg (peso combinado)",
    personalItem: "40 x 30 x 15 cm",
    notes:
      "El peso máximo combinado entre maleta de mano y accesorio personal es de 12 kg en clase económica.",
    guideUrl: "/reglas-de-equipaje/",
  },
];
