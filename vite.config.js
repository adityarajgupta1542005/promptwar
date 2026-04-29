import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://asia-south1-votesmart-ai-494317.cloudfunctions.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    // Target modern browsers — allows smaller output (no legacy transpilation)
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        // Aggressively remove dead code
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
      },
      mangle: { safari10: true },
    },
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        // Fine-grained manual chunks: keeps each vendor separate so they cache independently
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          // All remaining node_modules go into a separate vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        // Use content-hash file names for long-lived caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Tree-shaking: mark no side-effects in our source
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    // Increase timeout for async hook tests that simulate AI delays
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      include: [
        'src/components/**/*.jsx',
        'src/contexts/**/*.jsx',
        'src/hooks/**/*.js',
        'src/utils/**/*.js',
        'src/services/**/*.js',
      ],
      exclude: [
        'src/components/__tests__/**',
        'src/hooks/__tests__/**',
        'src/services/__tests__/**',
        'src/utils/__tests__/**',
        'src/test/**',
      ],
    },
  },
})
