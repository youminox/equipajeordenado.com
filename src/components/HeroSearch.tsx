"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface SearchItem {
  t: string; // title
  s: string; // slug
  c: string; // category slug
  n: string; // category name
  r: string; // readTime
}

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadIndex = useCallback(async () => {
    if (searchIndex || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch("/search-index.json");
      const data: SearchItem[] = await res.json();
      setSearchIndex(data);
      return data;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [searchIndex, isLoading]);

  const doSearch = useCallback((q: string, index: SearchItem[]) => {
    if (!q || q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const terms = q
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/);
    const matches = index
      .filter((item) => {
        const title = item.t
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return terms.every((term) => title.includes(term));
      })
      .slice(0, 8);

    setResults(matches);
    setIsOpen(matches.length > 0);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    let index = searchIndex;
    if (!index) {
      index = (await loadIndex()) || null;
    }
    if (index) {
      doSearch(val, index);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    let index = searchIndex;
    if (!index) {
      index = (await loadIndex()) || null;
    }
    if (index) {
      doSearch(trimmed, index);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-2xl">
      <form onSubmit={handleSearch}>
        <div className="relative flex items-center">
          <svg
            className="absolute left-5 h-5 w-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Busca medidas de Iberia, líquidos en cabina, maletas Samsonite, destinos..."
            value={query}
            onChange={handleChange}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            autoComplete="off"
            className="w-full rounded-2xl border-0 bg-white py-4 pr-32 pl-13 text-sm sm:text-base text-gray-900 shadow-xl placeholder:text-gray-400 focus:ring-4 focus:ring-sky-400/30 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark cursor-pointer"
          >
            Buscar
          </button>
        </div>
      </form>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl text-left max-h-[420px] overflow-y-auto">
          <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-2.5 text-xs font-semibold text-gray-500">
            Resultados encontrados ({results.length})
          </div>
          {results.map((item, i) => (
            <Link
              key={`${item.c}-${item.s}-${i}`}
              href={`/${item.c}/${item.s}/`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-3 border-b border-gray-50 px-5 py-3.5 transition hover:bg-light-bg last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary mb-1">
                  {item.n}
                </span>
                <p className="truncate text-sm font-bold text-gray-900">
                  {item.t}
                </p>
              </div>
              <span className="text-xs font-medium text-gray-400 shrink-0">
                ⏱️ {item.r}
              </span>
            </Link>
          ))}
        </div>
      )}

      {isLoading && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 bg-white px-5 py-4 text-center text-sm text-gray-500 shadow-2xl">
          Buscando en 2,722 guías...
        </div>
      )}
    </div>
  );
}
