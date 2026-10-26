import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        admin: new URL("./admin.html", import.meta.url).pathname,
      },
    },
  },
});
