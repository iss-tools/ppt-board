import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({ 
  base: './',
  resolve: {
    alias: {
      '@iss-ai/plugin-menu': resolve(__dirname, '../../plugins/plugin-menu/src/index.ts'),
      '@iss-ai/plugin-my-library': resolve(__dirname, '../../plugins/plugin-my-library/src/index.ts'),
      '@iss-ai/plugin-search': resolve(__dirname, '../../plugins/plugin-search/src/index.ts'),
      '@iss-ai/plugin-storage': resolve(__dirname, '../../plugins/plugin-storage/src/index.ts'),
      '@iss-ai/plugin-style-props': resolve(__dirname, '../../plugins/plugin-style-props/src/index.ts'),
      '@iss-ai/plugin-ai': resolve(__dirname, '../../plugins/plugin-ai/src/index.ts'),
      '@iss-ai/plugin-cooperation': resolve(__dirname, '../../plugins/plugin-cooperation/src/index.ts'),
      '@iss-ai/ppt-board': resolve(__dirname, '../src/index.ts'),
    }
  },
  plugins: [
    UnoCSS(),
    vue()
  ] 
});