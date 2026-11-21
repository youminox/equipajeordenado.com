#!/usr/bin/env python3
"""
SEO audit / pruning generator for equipajeordenado.com.

Inputs:
  - data/posts.json                 (all WordPress-migrated posts)
  - data/gsc/paginas-*.csv          (Search Console "Páginas" export, latest file wins)

Outputs:
  - data/seo-index.json             (consumed by src/lib/data.ts)
      * noindex:  slugs that stay online but get <meta robots="noindex,follow">
                  and are removed from sitemap, listings and internal widgets
      * merges:   slug -> absolute path (301). Merged posts are removed from the
                  site and redirected to the canonical article/page.
  - data/gsc/seo-audit-report.md    (human readable summary)
  - data/gsc/duplicate-candidates.csv (possible cannibalisation to review by hand)

Rules (see plan_seo_equipajeordenado.md, Fase 1):
  * Off-topic categories (hotels, restaurants, cities, Africa, Asia, beaches,
    nature getaways) are set to noindex UNLESS the post had impressions in GSC
    or its title/slug is explicitly about luggage/packing.
  * Curated cannibalisation clusters are merged with 301 into one winner.
  * "-en-mi-ultimo-viaje" / "-experiencia-real" clone pairs are merged.

Re-run whenever a new GSC export is added:  python3 scripts/seo-audit.py
"""
import csv
import glob
import json
import os
import re
from collections import defaultdict
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_PATH = os.path.join(ROOT, "data", "posts.json")
OUT_PATH = os.path.join(ROOT, "data", "seo-index.json")
REPORT_PATH = os.path.join(ROOT, "data", "gsc", "seo-audit-report.md")
DUPES_PATH = os.path.join(ROOT, "data", "gsc", "duplicate-candidates.csv")
EDITORIAL_DIR = os.path.join(ROOT, "data", "editorial")
CATEGORIES_PATH = os.path.join(ROOT, "data", "categories.json")
SEARCH_INDEX_PATH = os.path.join(ROOT, "public", "search-index.json")

OFF_TOPIC_CATEGORIES = {
    "hoteles-en-europa",
    "hoteles-en-america",
    "restaurantes-de-america",
    "viaje-en-ciudades",
    "afrika",
    "asia",
    "destinos",
    "escapadas-a-la-naturaleza",
}

# Posts inside off-topic categories that are still about luggage/packing stay indexed.
LUGGAGE_RE = re.compile(
    r"equipaje|maleta|mochila|empacar|empaque|que-llevar|qué llevar|carry-on|cabina",
    re.I,
)

# Curated cannibalisation clusters: loser slug -> winner path.
CURATED_MERGES = {
    # "Qué se considera equipaje de mano"
    "que-se-considera-equipaje-de-mano-en-los-aviones": "/curiosidades/que-se-considera-como-equipaje-de-mano/",
    "que-se-considera-maleta-de-mano": "/curiosidades/que-se-considera-como-equipaje-de-mano/",
    # Líquidos
    "cuantos-liquidos-se-pueden-llevar-en-el-equipaje-de-mano": "/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/",
    "como-manejar-liquidos-en-el-equipaje-de-mano-para-evitar-problemas": "/regulaciones/que-liquidos-estan-permitidos-en-el-equipaje-de-mano/",
    "como-empacar-liquidos-y-cremas-en-el-equipaje-de-mano": "/regulaciones/como-empacar-liquidos-en-el-equipaje-de-mano/",
    # Peso
    "cual-es-el-peso-maximo-permitido-para-el-equipaje-de-mano": "/regulaciones/cuales-son-las-restricciones-de-peso-para-el-equipaje-de-mano/",
    # Robos
    "como-evitar-el-robo-de-tu-equipaje-de-mano-durante-el-viaje": "/seguridad/como-asegurar-tu-equipaje-de-mano-contra-robos/",
    "como-evitar-el-robo-de-tu-equipaje-de-mano-en-el-aeropuerto": "/seguridad/como-asegurar-tu-equipaje-de-mano-contra-robos/",
    # Seguro de equipaje -> nueva guía específica
    "que-tipos-de-seguros-de-viaje-cubren-el-equipaje-de-mano": "/seguridad/seguro-para-maletas-de-viaje/",
    # Equipaje abierto / manipulado sin autorización (mismo tema)
    "que-hacer-si-tu-equipaje-de-mano-es-abierto-sin-autorizacion": "/seguridad/que-hacer-si-tu-equipaje-de-mano-es-manipulado-sin-autorizacion/",
    # Misma aerolínea, misma intención (medidas/peso de cabina)
    "jetsmart-tamano-y-peso-del-equipaje-de-mano-permitido": "/reglas-de-equipaje/que-medidas-acepta-jetsmart-sin-pagar-equipaje-adicional/",
    "cual-es-el-tamano-de-equipaje-de-mano-permitido-en-sky-peru": "/reglas-de-equipaje/que-tamano-de-equipaje-de-mano-acepta-sky-airline/",
    "puedo-llevar-carry-on-y-mochila-con-latam": "/reglas-de-equipaje/cuales-son-las-medidas-del-equipaje-de-mano-en-latam/",
    "que-tan-estricta-es-ryanair-con-el-equipaje-de-mano": "/reglas-de-equipaje/equipaje-de-mano-permitido-en-ryanair-medidas-y-peso/",
    # Políticas por aerolínea -> tabla de medidas
    "cuales-son-las-politicas-de-equipaje-de-mano-de-las-principales-aerolineas": "/medidas-equipaje-de-mano/",
}

# Slugs that are protected from noindex (editorial winners / pillars).
PROTECTED = set()

CLONE_SUFFIX_RE = re.compile(r"(-en-mi-ultimo-viaje|-experiencia-real)+$")


def latest_gsc_csv():
    files = sorted(glob.glob(os.path.join(ROOT, "data", "gsc", "paginas-*.csv")))
    return files[-1] if files else None


def load_impressions(path):
    impressions = defaultdict(int)
    clicks = defaultdict(int)
    if not path:
        return impressions, clicks
    with open(path, encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            url = row.get("Páginas principales") or list(row.values())[0]
            parts = [p for p in urlparse(url).path.split("/") if p]
            if len(parts) < 2:
                continue
            slug = parts[-1]
            base = re.sub(r"-\d{1,2}$", "", slug)
            imp = int(row.get("Impresiones", 0) or 0)
            clk = int(row.get("Clics", 0) or 0)
            for key in {slug, base}:
                impressions[key] += imp
                clicks[key] += clk
    return impressions, clicks


def tokens(text):
    stop = {
        "de", "la", "el", "en", "y", "para", "los", "las", "del", "con", "tu", "tus",
        "que", "a", "al", "un", "una", "por", "como", "guia", "completa", "definitiva",
        "actualizada", "practica", "mejor", "mejores", "equipaje", "mano", "maleta",
        "maletas", "cabina", "carry", "on", "mochila", "mochilas", "viaje", "viajes",
        "viajar", "viajero", "viajeros", "vuelo", "vuelos", "avion", "aviones",
        "aeropuerto", "aerolinea", "aerolineas", "llevar", "puedo", "puede", "pueden",
        "puedes", "se", "es", "son", "cual", "cuales", "tipo", "tipos", "opciones",
        "caracteristicas", "esenciales", "importantes", "recomendadas", "recomendados",
        "top", "modelo", "modelos", "elegir", "buscar", "considerar", "hacer", "si",
    }
    return {t for t in re.split(r"[^a-z0-9]+", text.lower()) if t and t not in stop}


def main():
    posts = json.load(open(POSTS_PATH, encoding="utf-8"))
    by_slug = {p["slug"]: p for p in posts}
    gsc_path = latest_gsc_csv()
    impressions, clicks = load_impressions(gsc_path)

    merges = {}
    for loser, target in CURATED_MERGES.items():
        if loser in by_slug:
            merges[loser] = target

    # Reviewed cannibalisation merges (data/manual-merges.json)
    manual_path = os.path.join(ROOT, "data", "manual-merges.json")
    if os.path.exists(manual_path):
        for loser, info in json.load(open(manual_path, encoding="utf-8")).items():
            target = info["to"] if isinstance(info, dict) else info
            if loser in by_slug and loser not in merges:
                merges[loser] = target

    # Clone pairs "-en-mi-ultimo-viaje" vs "-experiencia-real"
    groups = defaultdict(list)
    for p in posts:
        if CLONE_SUFFIX_RE.search(p["slug"]):
            groups[CLONE_SUFFIX_RE.sub("", p["slug"])].append(p)
    for base, members in groups.items():
        if len(members) < 2:
            continue
        members.sort(
            key=lambda p: (
                -impressions.get(p["slug"], 0),
                0 if p["slug"].endswith("-experiencia-real") else 1,
                len(p["slug"]),
            )
        )
        winner = members[0]
        for loser in members[1:]:
            merges[loser["slug"]] = f"/{winner['category']}/{winner['slug']}/"

    # Collapse redirect chains (A->B, B->C  =>  A->C)
    def final_target(path, seen=()):
        slug = path.strip("/").split("/")[-1]
        if slug in merges and slug not in seen:
            return final_target(merges[slug], seen + (slug,))
        return path
    merges = {k: final_target(v) for k, v in merges.items()}

    # Protect merge winners from noindex
    winner_slugs = {t.strip("/").split("/")[-1] for t in merges.values()}
    protected = PROTECTED | winner_slugs

    noindex = []
    kept_offtopic = []
    for p in posts:
        if p["slug"] in merges or p["slug"] in protected:
            continue
        if p["category"] not in OFF_TOPIC_CATEGORIES:
            continue
        has_impr = impressions.get(p["slug"], 0) > 0
        about_luggage = bool(LUGGAGE_RE.search(p["slug"]) or LUGGAGE_RE.search(p["title"]))
        if has_impr or about_luggage:
            kept_offtopic.append((p, "impresiones" if has_impr else "tema equipaje"))
        else:
            noindex.append(p["slug"])

    # Duplicate candidates for manual review (title token Jaccard within category)
    on_topic = [p for p in posts if p["slug"] not in merges and p["slug"] not in set(noindex)]
    by_cat = defaultdict(list)
    for p in on_topic:
        by_cat[p["category"]].append((p, tokens(p["slug"])))
    dupes = []
    for cat, items in by_cat.items():
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, ta = items[i]
                b, tb = items[j]
                if not ta or not tb:
                    continue
                jac = len(ta & tb) / len(ta | tb)
                if jac >= 0.6:
                    dupes.append((round(jac, 2), cat, a["slug"], b["slug"]))
    dupes.sort(reverse=True)

    out = {
        "generatedAt": __import__("datetime").date.today().isoformat(),
        "gscSource": os.path.basename(gsc_path) if gsc_path else None,
        "offTopicCategories": sorted(OFF_TOPIC_CATEGORIES),
        "noindex": sorted(noindex),
        "merges": dict(sorted(merges.items())),
    }
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)

    with open(DUPES_PATH, "w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["similitud", "categoria", "slug_a", "slug_b"])
        w.writerows(dupes)

    total = len(posts)
    indexable = total - len(noindex) - len(merges)
    cat_counts = defaultdict(lambda: [0, 0])
    for p in posts:
        cat_counts[p["category"]][0] += 1
        if p["slug"] in noindex:
            cat_counts[p["category"]][1] += 1
    lines = [
        "# Auditoría SEO: poda y consolidación",
        "",
        f"- Fuente GSC: `{out['gscSource']}`",
        f"- Posts totales: **{total}**",
        f"- Fusionados con 301: **{len(merges)}**",
        f"- Marcados `noindex`: **{len(noindex)}**",
        f"- Indexables tras la poda: **{indexable}**",
        f"- Off-topic conservados (impresiones o tema equipaje): **{len(kept_offtopic)}**",
        f"- Candidatos a canibalización para revisión manual: **{len(dupes)}** (`duplicate-candidates.csv`)",
        "",
        "## Por categoría (total / noindex)",
        "",
        "| Categoría | Total | noindex |",
        "|---|---|---|",
    ]
    for cat, (t, n) in sorted(cat_counts.items(), key=lambda x: -x[1][0]):
        lines.append(f"| {cat} | {t} | {n} |")
    lines += ["", "## Fusiones 301", ""]
    for k, v in sorted(merges.items()):
        lines.append(f"- `{k}` → `{v}`")
    lines += ["", "## Off-topic conservados", ""]
    for p, why in kept_offtopic:
        lines.append(f"- `{p['category']}/{p['slug']}` ({why}, {impressions.get(p['slug'], 0)} impr.)")
    with open(REPORT_PATH, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")

    # Client search index: only indexable posts (+ editorial new/rewritten ones)
    cat_names = {c["slug"]: c["name"] for c in json.load(open(CATEGORIES_PATH, encoding="utf-8"))}
    editorial = {}
    if os.path.isdir(EDITORIAL_DIR):
        for f in sorted(os.listdir(EDITORIAL_DIR)):
            if f.endswith(".json"):
                e = json.load(open(os.path.join(EDITORIAL_DIR, f), encoding="utf-8"))
                editorial[e["slug"]] = e
    noindex_set = set(noindex)
    index = []
    seen = set()
    for e in editorial.values():
        words = len(re.sub(r"<[^>]+>", " ", e["content"]).split())
        index.append({"t": e["title"], "s": e["slug"], "c": e["category"],
                      "n": cat_names.get(e["category"], e["category"]),
                      "r": f"{max(1, round(words / 220))} min"})
        seen.add(e["slug"])
    for p in posts:
        if p["slug"] in seen or p["slug"] in merges or p["slug"] in noindex_set:
            continue
        index.append({"t": p["title"], "s": p["slug"], "c": p["category"],
                      "n": p.get("categoryName", ""), "r": p.get("readTime", "")})
    with open(SEARCH_INDEX_PATH, "w", encoding="utf-8") as fh:
        json.dump(index, fh, ensure_ascii=False)

    print(f"search_index={len(index)}")
    print(f"posts={total} merges={len(merges)} noindex={len(noindex)} indexable={indexable} "
          f"kept_offtopic={len(kept_offtopic)} dupe_candidates={len(dupes)}")


if __name__ == "__main__":
    main()
