import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pyrok1nezyz.github.io",
  plugins: [react(), viteSingleFile()],
});
