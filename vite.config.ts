import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
const manifestForPlugin: Partial<VitePWAOptions> = {
    // registerType: "prompt",
    // includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
    manifest: {
        name: "SciMeet ",
        short_name: "SciMeet",
        description:
            "SciMeet: Bridging the Distance with Every Message. Your Ultimate Chat, Video, and Group Calling App",
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
        theme_color: "#14b8a6",
        background_color: "#1e293b",
        display: "standalone",
    },
};
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugin)],
});
