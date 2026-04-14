import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": Path.join(__dirname, "./src")
        }
    }
});