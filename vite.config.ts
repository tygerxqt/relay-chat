import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import million from "million/compiler";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [million.vite({ auto: true }), react()],
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		watch: {
			ignored: ["**/src-tauri/**"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
}));
