// Vite and React dependencies
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Node.js path module for file/directory operations
import path from 'path';

// Tailwind CSS plugin for Vite
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5175,
        host: '192.168.1.128',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        minify: 'esbuild',
        cssMinify: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },
});
