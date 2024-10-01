import { comlink } from "vite-plugin-comlink";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import path from "path";
const manifestForPlugin: Partial<VitePWAOptions> = {
    // registerType: "prompt",
    // includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
    manifest: {
        name: "Pack4Print",
        short_name: "Pack4Print",
        description:
            "Print smart, print green: effortlessly organize diverse images on paper for optimal results.",
        icons: [
            {
                src: "pwa-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },

            {
                src: "pwa-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            // {
            //     src: "maskable-icon-512x512.png",
            //     sizes: "512x512",
            //     type: "image/png",
            //     purpose: "maskable",
            // },
            {
                src: "maskable-icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "apple-touch-icon-180x180.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "any",
            },
        ],
        theme_color: "#134e4a",
        background_color: "#1e293b",
        display: "standalone",
    },
};
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [comlink(), react(), VitePWA(manifestForPlugin)],
    worker: {
        plugins: () => [comlink()],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
