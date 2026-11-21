#!/usr/bin/env python3
"""
Evergreen pass: removes explicit years from titles and body copy.

- data/editorial/*.json   (titles, seoTitle, description, excerpt, content)
- data/posts.json         (curated rewrites of the few historical years)
- data/pages.json         (author page only; legal pages keep law references
                           such as "Reglamento (UE) 2016/679", which are legal
                           identifiers, not dates)

Then scans every live text field and fails if a year is still present.
Run: python3 scripts/remove-years.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
YEAR = re.compile(r"\b(19[5-9]\d|20[0-3]\d)\b")
LEGAL_PAGES = {"aviso-legal", "politica-privacidad", "politica-de-cookies", "1280-2"}

EDITORIAL = {
    "como-asegurar-tu-equipaje-de-mano-contra-robos": [
        ("Cómo proteger tu maleta de robos: guía antirrobo 2026", "Cómo proteger tu maleta de robos: guía antirrobo completa"),
        ("En 2022 hubo confusión con una aerolínea europea", "Hace un tiempo hubo confusión con una aerolínea europea"),
    ],
    "cuales-son-las-restricciones-de-peso-para-el-equipaje-de-mano": [
        ("límite máximo por aerolínea en 2026", "límite máximo por aerolínea"),
        ("Peso máximo maleta de mano 2026: tabla por aerolínea", "Peso máximo de la maleta de mano: tabla por aerolínea"),
        ("tabla 2026,", "tabla actualizada,"),
        ("Datos verificados en noviembre de 2026; confirma con tu aerolínea.", "Datos verificados en la web oficial de cada aerolínea; confirma con la tuya antes de volar."),
    ],
    "que-liquidos-estan-permitidos-en-el-equipaje-de-mano": [
        ("Líquidos en equipaje de mano 2026: 100 ml y excepciones", "Líquidos en el equipaje de mano: 100 ml y excepciones"),
        ("escáneres 3D en 2026.", "nuevos escáneres 3D."),
        ("La situación a finales de 2026, que debe tomarse", "La situación actual, que debe tomarse"),
        ("Situación a finales de 2026", "Situación actual"),
        ("Información revisada en noviembre de 2026.", "Información revisada con fuentes oficiales."),
    ],
    "que-se-considera-como-equipaje-de-mano": [
        ("Qué se considera equipaje de mano en 2026: guía clara", "Qué se considera equipaje de mano: guía clara y completa"),
        ("Datos revisados en noviembre de 2026.", "Datos revisados en las webs oficiales de cada aerolínea."),
    ],
    "seguro-para-maletas-de-viaje": [
        ("Seguro para maletas de viaje 2026: coberturas y precios", "Seguro para maletas de viaje: coberturas y precios"),
        ("Convenio de Montreal de 1999", "Convenio de Montreal"),
        ("Ese límite entró en vigor el 28 de diciembre de 2024 (antes era de 1.288 DEG)", "Este límite se revisa periódicamente (la cifra anterior era de 1.288 DEG)"),
    ],
}

POSTS = {
    "viajar-barato-a-addis-abeba": [("<b>Inaugurado en 2015</b>", "<b>De construcción reciente</b>")],
    "que-ver-en-kampala": [(", fundado en 1964, destaca", ", con décadas de trayectoria, destaca")],
    "museos-y-arquitectura-moderna-en-frankfurt": [
        ("La ampliación subterránea realizada en 2012, conocida", "La ampliación subterránea, conocida"),
        ("Inaugurado en 1991, el MMK", "Desde su inauguración, el MMK"),
    ],
    "ruta-cultural-por-abu-dhabi": [("Este museo, inaugurado en 2017, no sólo", "Este museo no sólo")],
    "como-moverse-por-berlin-como-mochilero": [("Tempelhof, cerrado en 2008, ha sido", "Tempelhof, ya clausurado como aeropuerto, ha sido")],
    "que-ver-en-china-en-7-dias": [("descubierto casualmente por agricultores en 1974, ha", "descubierto casualmente por agricultores, ha")],
    "museos-y-arquitectura-moderna-en-paris": [("la pirámide de cristal añadida en 1989 es", "la pirámide de cristal añadida en el siglo XX es")],
    "museos-y-arquitectura-moderna-en-londres": [("reubicado en Kensington en 2016, es", "reubicado en Kensington, es")],
    "se-puede-viajar-con-maquillaje-liquido": [("Desde 2006, la regla general", "Desde hace años, la regla general")],
    "descubre-el-kenneth-cole-reaction-out-of-bounds-equipaje-de-mano-ligero-con-ruedas-giratorias": [("Desde su fundación en 1982, Kenneth Cole", "Desde su fundación, Kenneth Cole")],
    "travelpro-maxlite-5-el-mejor-equipaje-de-mano-para-viajeros-exigentes": [("Fundada por un piloto de aerolínea en 1987, Travelpro", "Fundada por un piloto de aerolínea, Travelpro")],
    "que-reglas-existen-para-el-equipaje-de-mano-en-vuelos-a-europa": [("Desde 2006, las restricciones", "Desde hace años, las restricciones")],
}

PAGES = {
    "hola-hablamos": [("certificación ISO 9001 versión 2015", "certificación ISO 9001")],
}

TEXT_FIELDS = ("title", "seoTitle", "description", "excerpt", "content")


def apply(obj, rules):
    for old, new in rules:
        for k in TEXT_FIELDS:
            if isinstance(obj.get(k), str) and old in obj[k]:
                obj[k] = obj[k].replace(old, new)


def visible_years(text):
    """Years outside of URLs / image attributes."""
    stripped = re.sub(r'(src|href|srcset)="[^"]*"', "", text)
    stripped = re.sub(r"https?://\S+", "", stripped)
    return YEAR.findall(stripped)


def main():
    problems = []

    ed_dir = os.path.join(ROOT, "data", "editorial")
    for f in sorted(os.listdir(ed_dir)):
        if not f.endswith(".json"):
            continue
        path = os.path.join(ed_dir, f)
        e = json.load(open(path, encoding="utf-8"))
        apply(e, EDITORIAL.get(e["slug"], []))
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(e, fh, ensure_ascii=False, indent=2)
            fh.write("\n")
        for k in TEXT_FIELDS:
            if visible_years(e.get(k, "")):
                problems.append(f"editorial/{f}:{k}")

    posts_path = os.path.join(ROOT, "data", "posts.json")
    posts = json.load(open(posts_path, encoding="utf-8"))
    for p in posts:
        apply(p, POSTS.get(p["slug"], []))
    merges = json.load(open(os.path.join(ROOT, "data", "seo-index.json")))["merges"]
    for p in posts:
        if p["slug"] in merges:
            continue
        for k in ("title", "excerpt", "content"):
            if visible_years(p.get(k, "")):
                problems.append(f"posts/{p['slug']}:{k}")
    with open(posts_path, "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False, indent=2)

    pages_path = os.path.join(ROOT, "data", "pages.json")
    pages = json.load(open(pages_path, encoding="utf-8"))
    for p in pages:
        apply(p, PAGES.get(p["slug"], []))
        if p["slug"] not in LEGAL_PAGES:
            for k in ("title", "content"):
                if visible_years(p.get(k, "")):
                    problems.append(f"pages/{p['slug']}:{k}")
    with open(pages_path, "w", encoding="utf-8") as fh:
        json.dump(pages, fh, ensure_ascii=False, indent=2)

    if problems:
        print("Years still present:\n  " + "\n  ".join(problems))
        sys.exit(1)
    print("OK: no years left in titles/body (legal references excluded).")


if __name__ == "__main__":
    main()
