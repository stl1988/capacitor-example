import path from "node:path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/{vite,eslint}.config.*',
      '.agents/**',
    ],
    onConsoleLog(log) {
      return !log.includes("React Router Future Flag Warning");
    },
    env: {
      DEBUG_PRINT_LIMIT: '0', // Suppress DOM output that exceeds AI context windows
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Capacitor v8 plugins depend on @capacitor/synapse, an internal package
  // that has no browser-compatible entry point and breaks Rolldown (Vite 8's
  // bundler) when it tries to pre-bundle or tree-shake through it.
  //
  // The fix is two-part:
  //  1. optimizeDeps.exclude — stop Vite from pre-bundling Capacitor packages
  //     during dev (they lazy-load their native bridges themselves).
  //  2. build.rollupOptions.external — tell Rolldown to treat @capacitor/synapse
  //     as external at build time. It is never actually imported in a browser
  //     bundle; Capacitor plugins only reference it for internal type wiring
  //     that tree-shakes away on native builds.
  optimizeDeps: {
    exclude: [
      '@capacitor/core',
      '@capacitor/app',
      '@capacitor/filesystem',
      '@capacitor/haptics',
      '@capacitor/keyboard',
      '@capacitor/share',
      'capacitor-secure-storage-plugin',
    ],
  },
  build: {
    rollupOptions: {
      external: [
        '@capacitor/synapse',
      ],
    },
  },
}));