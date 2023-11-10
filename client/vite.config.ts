import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "../API/wwwroot",
        emptyOutDir: true,
    },
    server: {
        port: 3000,
    },
    plugins: [react(), splitVendorChunkPlugin()],
});
