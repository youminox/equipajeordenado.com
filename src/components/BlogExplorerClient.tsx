"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post, Category } from "@/lib/types";
import { getPostUrl, getImageUrl } from "@/lib/data";

interface BlogExplorerProps {
  initialPosts: Post[];
  categories: Category[];
}

export default function BlogExplorerClient({
  initialPosts,
  categories,
}: BlogExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCat =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div>
      {/* Search + Category Filter Pills (Dinamica.pe style) */}
      <div className="mb-10 space-y-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Filtrar guías por palabra clave (ej. Samsonite, líquidos, Europa)..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <svg
              className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setVisibleCount(12);
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Destacados ({initialPosts.length})
          </button>
          {categories.slice(0, 12).map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                setVisibleCount(12);
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid — Dinamica.pe Card Style */}
      {displayedPosts.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No se encontraron guías para tu filtro actual.
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <Link
                key={post.id}
                href={getPostUrl(post)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                  <img
                    src={getImageUrl(post.featuredImageUrl)}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white shadow">
                    {post.categoryName}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span>⏱️ {post.readTime} de lectura</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-semibold">
                      ✓ Guía Verificada
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Leer guía completa
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < filteredPosts.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-800 shadow-xs transition hover:border-primary hover:text-primary cursor-pointer"
              >
                Mostrar más guías ({filteredPosts.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
