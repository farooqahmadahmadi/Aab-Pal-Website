import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0", // Localhost + LAN + Mobile
    port: 5173,
    strictPort: true, // if port busy can't redirect to other port

    cors: true, // dev CORS enable

    hmr: true,

    // {
    //   host: "localhost",
    // },
  },
});
