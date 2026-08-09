import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'plugin-menu': resolve(__dirname, '../plugins/plugin-menu/src/index.ts'),
      'plugin-my-library': resolve(__dirname, '../plugins/plugin-my-library/src/index.ts'),
      'plugin-search': resolve(__dirname, '../plugins/plugin-search/src/index.ts'),
      'plugin-storage': resolve(__dirname, '../plugins/plugin-storage/src/index.ts'),
      'plugin-style-props': resolve(__dirname, '../plugins/plugin-style-props/src/index.ts'),
      'plugin-ai': resolve(__dirname, '../plugins/plugin-ai/src/index.ts'),
    }
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
      name: '$utils',
      fileName: (format) => `index.${format === 'es' ? 'esm' : (format === 'cjs' ? 'cjs' : format === 'iife' ? 'min' : format)}.js`,
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      external: ["vue", "naive-ui", "@iss-ai/vue-canvas-core", "animate.css", "dexie", "vfonts"],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
          'react-dom': 'ReactDOM',
          svelte: 'Svelte',
          'solid-js': 'Solid',
        }
      }
    }
  }
});