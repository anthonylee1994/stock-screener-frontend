import React from "@vitejs/plugin-react";
import TailwindCss from "@tailwindcss/vite";
import {fileURLToPath, URL} from "node:url";
import {defineConfig} from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("node_modules")) {
                        return undefined;
                    }

                    if (id.includes("@heroui") || id.includes("@react-aria") || id.includes("@react-stately")) {
                        return "heroui";
                    }

                    if (id.includes("lucide-react")) {
                        return "icons";
                    }

                    if (id.includes("react-router")) {
                        return "router";
                    }

                    if (id.includes("react") || id.includes("scheduler")) {
                        return "react";
                    }

                    return "vendor";
                },
            },
        },
    },
    plugins: [React(), TailwindCss()],
});
