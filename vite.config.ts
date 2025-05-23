// Vite and React dependencies
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Node.js path module for file/directory operations
import path from 'path';

// Tailwind CSS plugin for Vite
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    // Carregar variáveis de ambiente
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: parseInt(env.VITE_PORT) || 5173,
            // Adicionar host apenas em desenvolvimento
            ...(env.VITE_ENV === 'development' && {
                host: env.VITE_HOST || 'localhost',
            }),
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
    };
});
