import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "index",
      fileName: (format) => `index.${format}.js`,
    },
  },
});
