import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "equipajeordenado.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      // Legacy WordPress Sitemaps -> Next.js Sitemap
      {
        source: "/wp-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap/:path*",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // WordPress category pagination & category URL compatibility
      {
        source: "/category/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      // Legacy WordPress author, tag, and feed archives
      {
        source: "/author/:path*",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comments/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comments/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:category/:slug/feed/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug/feed",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      // Legacy WordPress media uploads -> local optimized /images/
      {
        source: "/wp-content/uploads/:year(\\d{4})/:month(\\d{2})/:file*",
        destination: "/images/:file*",
        permanent: true,
      },
      // Evergreen slug redirects (past year removal)
      {
        source:
          "/:category/guia-actualizada-del-equipaje-de-mano-en-jetblue-2025/",
        destination:
          "/reglas-de-equipaje/guia-actualizada-del-equipaje-de-mano-en-jetblue/",
        permanent: true,
      },
      {
        source:
          "/:category/guia-completa-del-equipaje-de-mano-en-british-airways-2024/",
        destination:
          "/reglas-de-equipaje/guia-completa-del-equipaje-de-mano-en-british-airways/",
        permanent: true,
      },
      {
        source:
          "/:category/guia-practica-sobre-el-equipaje-de-mano-de-spirit-airlines-en-2025/",
        destination:
          "/reglas-de-equipaje/guia-practica-sobre-el-equipaje-de-mano-de-spirit-airlines/",
        permanent: true,
      },
      {
        source:
          "/:category/medidas-y-peso-del-equipaje-de-mano-en-delta-airlines-2025/",
        destination:
          "/reglas-de-equipaje/medidas-y-peso-del-equipaje-de-mano-en-delta-airlines/",
        permanent: true,
      },
      {
        source:
          "/:category/politica-de-equipaje-de-mano-de-easyjet-en-2025-que-puedes-llevar-gratis/",
        destination:
          "/reglas-de-equipaje/politica-de-equipaje-de-mano-de-easyjet-que-puedes-llevar-gratis/",
        permanent: true,
      },
      {
        source:
          "/:category/todo-sobre-el-equipaje-de-mano-en-air-france-para-2025/",
        destination:
          "/reglas-de-equipaje/todo-sobre-el-equipaje-de-mano-en-air-france/",
        permanent: true,
      },
      // Numbered WordPress duplicate clones (-2 .. -99) -> canonical base article
      {
        source: "/:category/:slug-:num(\\d{1,2})/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug-:num(\\d{1,2})",
        destination: "/:category/:slug/",
        permanent: true,
      },
      // Common legal & contact aliases
      {
        source: "/privacy-policy/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-de-privacidad/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-de-privacidad",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/contacto/",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/1280-2/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/1280-2",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
