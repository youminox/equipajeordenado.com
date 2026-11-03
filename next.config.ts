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
        source: "/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
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
