import type { MetadataRoute } from "next";
import {
  getIndexablePosts,
  getIndexableCategories,
  toIsoDate,
  SITE_URL,
} from "@/lib/data";
import { AIRLINE_RULES_VERIFIED_AT } from "@/lib/airlines";

/**
 * Only indexable URLs go in the sitemap, with their REAL last-modified date.
 * (Previously every URL used `new Date()`, which teaches Google to ignore
 * our lastmod signal.) Noindexed / merged posts and legal pages are excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getIndexablePosts();
  const categories = getIndexableCategories();

  const latestByCategory = new Map<string, string>();
  let latestOverall = "";
  for (const p of posts) {
    const iso = toIsoDate(p.modified) || toIsoDate(p.date) || "";
    if (iso > (latestByCategory.get(p.category) || "")) {
      latestByCategory.set(p.category, iso);
    }
    if (iso > latestOverall) latestOverall = iso;
  }
  const airlinesIso = AIRLINE_RULES_VERIFIED_AT
    ? new Date(`${AIRLINE_RULES_VERIFIED_AT}T00:00:00Z`).toISOString()
    : latestOverall;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: latestOverall, priority: 1.0 },
    { url: `${SITE_URL}/equipaje-de-mano/`, lastModified: latestOverall, priority: 0.9 },
    { url: `${SITE_URL}/medidas-equipaje-de-mano/`, lastModified: airlinesIso, priority: 0.9 },
    { url: `${SITE_URL}/hola-hablamos/`, priority: 0.5 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.count > 0)
    .map((cat) => ({
      url: `${SITE_URL}/${cat.slug}/`,
      lastModified: latestByCategory.get(cat.slug),
      priority: 0.7,
    }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${post.category}/${post.slug}/`,
    lastModified: toIsoDate(post.modified) || toIsoDate(post.date),
    priority: post.editorial ? 0.8 : 0.6,
  }));

  return [...staticPages, ...categoryEntries, ...postEntries];
}
