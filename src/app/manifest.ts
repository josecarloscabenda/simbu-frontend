// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Simbu — Campanhas SMS & Email",
    short_name: "Simbu",
    description: "Plataforma para criação e gestão de campanhas SMS e Email.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00C3AD",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
