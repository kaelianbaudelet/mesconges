import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EduPlanner",
    short_name: "EduPlanner",
    description:
      "EPSI EduPlanner est une version améliorée et non officielle de l'emploi du temps de l'EPSI, conçue pour une organisation claire et efficace, adaptée aux besoins des étudiants",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#36B6D4",
    icons: [
      {
        src: "/favicon/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon/favicon-196x196.png",
        sizes: "196x196",
        type: "image/png",
      },
      {
        src: "/favicon/favicon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "/favicon/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
