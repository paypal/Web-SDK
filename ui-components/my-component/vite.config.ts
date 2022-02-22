import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "v1/child/",
  build: {
    outDir: "../../asset-server/dist/v1/child/",
  },
});
