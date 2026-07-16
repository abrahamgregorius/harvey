import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "icons.svg"],
            manifest: {
                name: "Harvey DSS Alokasi Irigasi",
                short_name: "Harvey",
                theme_color: "#2e7d32",
                background_color: "#ffffff",
                display: "standalone",
                lang: "id",
                icons: [
                    {
                        src: "icons.svg",
                        sizes: "any",
                        type: "image/svg+xml",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
});
