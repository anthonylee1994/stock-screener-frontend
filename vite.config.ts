import React from "@vitejs/plugin-react";
import TailwindCss from "@tailwindcss/vite";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [React(), TailwindCss()],
});
