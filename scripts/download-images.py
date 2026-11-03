import json
import os
import re
import ssl
import socket
import http.client
import urllib.parse
import unicodedata
from io import BytesIO
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
IMAGES_DIR = os.path.join(ROOT_DIR, "public", "images")

os.makedirs(IMAGES_DIR, exist_ok=True)

HOST_IP = "147.79.79.137"
DOMAIN = "equipajeordenado.com"
SSL_CTX = ssl._create_unverified_context()


def clean_filename(url: str) -> str:
    raw = urllib.parse.unquote(url.split("/")[-1].split("?")[0])
    name, ext = os.path.splitext(raw)
    # Normalize accents (NFD) and strip combining marks
    norm = unicodedata.normalize("NFD", name)
    ascii_name = "".join(c for c in norm if unicodedata.category(c) != "Mn")
    # Replace non-alphanumeric (like ¿, ?, spaces) with hyphen
    ascii_name = re.sub(r"[^a-zA-Z0-9._-]+", "-", ascii_name)
    ascii_name = re.sub(r"-{2,}", "-", ascii_name).strip("-._")
    ext_clean = ext.lower() if ext.lower() in (".jpg", ".jpeg", ".png", ".webp", ".gif") else ".jpg"
    return f"{ascii_name or 'imagen'}{ext_clean}"


def fetch_from_origin(url: str, redirects: int = 0) -> bytes:
    if redirects > 3:
        raise RuntimeError("Too many redirects")
    parsed = urllib.parse.urlsplit(url)
    # Quote path safely (handle both already-quoted and unquoted paths)
    unquoted_path = urllib.parse.unquote(parsed.path)
    encoded_path = urllib.parse.quote(unquoted_path, safe="/%")

    raw_sock = socket.create_connection((HOST_IP, 443), timeout=20)
    ssl_sock = SSL_CTX.wrap_socket(raw_sock, server_hostname=DOMAIN)
    conn = http.client.HTTPSConnection(DOMAIN, 443, timeout=20, context=SSL_CTX)
    conn.sock = ssl_sock
    try:
        conn.request(
            "GET",
            encoded_path,
            headers={
                "Host": DOMAIN,
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "Accept": "image/*,*/*;q=0.8",
            },
        )
        resp = conn.getresponse()
        data = resp.read()
        status = resp.status
        loc = resp.getheader("Location")
    finally:
        conn.close()

    if status in (301, 302, 307, 308) and loc:
        return fetch_from_origin(loc, redirects + 1)
    if status != 200:
        raise RuntimeError(f"HTTP {status}")
    return data


def download_and_optimize(url: str):
    fname = clean_filename(url)
    dest = os.path.join(IMAGES_DIR, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 300:
        return url, f"/images/{fname}", True, "cached"

    for attempt in range(2):
        try:
            data = fetch_from_origin(url)
            if len(data) < 200:
                raise RuntimeError("Empty image")
            try:
                im = Image.open(BytesIO(data))
                max_w = 880
                if im.width > max_w:
                    new_h = int(im.height * (max_w / im.width))
                    im = im.resize((max_w, new_h), Image.Resampling.LANCZOS)
                if fname.endswith((".jpg", ".jpeg")):
                    im = im.convert("RGB")
                    im.save(dest, "JPEG", quality=80, optimize=True)
                elif fname.endswith(".png"):
                    im.save(dest, "PNG", optimize=True)
                elif fname.endswith(".webp"):
                    im.save(dest, "WEBP", quality=80)
                else:
                    with open(dest, "wb") as f:
                        f.write(data)
            except Exception:
                with open(dest, "wb") as f:
                    f.write(data)
            return url, f"/images/{fname}", True, "downloaded"
        except Exception as e:
            last_err = str(e)
    return url, f"/images/{fname}", False, last_err


def main():
    urls_path = os.path.join(DATA_DIR, "image-urls.json")
    posts_path = os.path.join(DATA_DIR, "posts.json")
    pages_path = os.path.join(DATA_DIR, "pages.json")

    with open(urls_path, "r", encoding="utf-8") as f:
        all_urls = json.load(f)

    print(f"🖼️  Downloading & optimizing {len(all_urls)} images from {HOST_IP} ({DOMAIN})...")

    url_to_local = {}
    ok = 0
    cached = 0
    failed = 0
    failures = []

    with ThreadPoolExecutor(max_workers=32) as ex:
        futures = {ex.submit(download_and_optimize, u): u for u in all_urls}
        for idx, fut in enumerate(as_completed(futures), 1):
            url, local_path, success, status = fut.result()
            url_to_local[url] = local_path
            if success:
                ok += 1
                if status == "cached":
                    cached += 1
            else:
                failed += 1
                failures.append((url, status))
            if idx % 200 == 0 or idx == len(all_urls):
                print(f"  ⏳ Progress: {idx}/{len(all_urls)} (ok={ok}, cached={cached}, failed={failed})")

    # Update posts.json and pages.json to use local /images/<clean_filename>
    def rewrite_wp_urls(html_str: str) -> str:
        def repl(m):
            u = m.group(0)
            return f"/images/{clean_filename(u)}"
        return re.sub(
            r"https?://equipajeordenado\.com/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)",
            repl,
            html_str,
            flags=re.I,
        )

    with open(posts_path, "r", encoding="utf-8") as f:
        posts = json.load(f)
    for p in posts:
        if p.get("featuredImageUrl"):
            p["featuredImageUrl"] = f"/images/{clean_filename(p['featuredImageUrl'])}"
        if p.get("content"):
            p["content"] = rewrite_wp_urls(p["content"])
    with open(posts_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    with open(pages_path, "r", encoding="utf-8") as f:
        pages = json.load(f)
    for p in pages:
        if p.get("featuredImageUrl"):
            p["featuredImageUrl"] = f"/images/{clean_filename(p['featuredImageUrl'])}"
        if p.get("content"):
            p["content"] = rewrite_wp_urls(p["content"])
    with open(pages_path, "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Images downloaded & optimized: {ok} (cached: {cached}), failed: {failed}")
    if failures:
        print("Sample failures:", failures[:5])
    print("✅ Updated posts.json and pages.json with local /images/ paths!")


if __name__ == "__main__":
    main()
