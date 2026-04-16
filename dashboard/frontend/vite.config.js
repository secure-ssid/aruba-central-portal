import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression for production builds
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files larger than 1KB
    }),
    // Brotli compression (better compression ratio)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  server: {
    port: 1344,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'esbuild', // Use esbuild for faster minification
    cssMinify: true, // Minify CSS
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and smaller initial load
        manualChunks: {
          // Core React runtime — cached long-term, rarely changes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // MUI component library + Emotion runtime
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Charting library (only needed by pages with graphs)
          'vendor-charts': ['recharts'],
          // Data-fetching layer
          'vendor-query': ['@tanstack/react-query'],
          // Syntax highlighting (API Explorer, Troubleshoot)
          'vendor-syntax': ['react-syntax-highlighter'],
        },
        // Chunk file naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // Warn if chunk exceeds 1MB
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
  optimizeDeps: {
    exclude: ['@imgly/background-removal'], // Exclude from pre-bundling
  },
})
