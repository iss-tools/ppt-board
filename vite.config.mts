import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
  envPrefix: ['VITE_', 'ABLY_', 'CHANNEL_'],
  optimizeDeps: {
  },
  resolve: {
    alias: {}
  },
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    outDir: 'lib',
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: './src/index.ts',
      name: 'PptBoard',
      fileName: (format) => `index.${format === 'es' ? 'esm' : (format === 'cjs' ? 'cjs' : format === 'iife' ? 'min' : format)}.js`,
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      external: ["vue", "naive-ui", "@iss-ai/vue-canvas-core", "animate.css", "dexie", "vfonts"],
      output: {
        globals: {
          vue: 'Vue',
          '@iss-ai/vue-canvas-core': 'VueCanvasCore',
          'naive-ui': 'naive',
          'dexie': 'Dexie'
        }
      }
    }
  }
});