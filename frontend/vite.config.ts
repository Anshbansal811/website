import { defineConfig } from "vite";
const react = require("@vitejs/plugin-react");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
