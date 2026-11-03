import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories, SITE_URL } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const nowIso = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: nowIso,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/hola-hablamos/`,
      lastModified: nowIso,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/politica-privacidad/`,
      lastModified: nowIso,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/aviso-legal/`,
      lastModified: nowIso,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politica-de-cookies/`,
      lastModified: nowIso,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}/`,
    lastModified: nowIso,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${post.category}/${post.slug}/`,
    lastModified: nowIso,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryEntries, ...postEntries];
}
