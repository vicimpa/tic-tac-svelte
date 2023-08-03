import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  base: './',
  build: {
    outDir: '../dist'
  },
  plugins: [
    svelte({ configFile: '../svelte.config.js' }),
    paths()
  ],
});
