import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({ 
  base: './',
  resolve: {
    alias: {
      'plugin-menu': resolve(__dirname, '../../plugins/plugin-menu/src/index.ts'),
      'plugin-my-library': resolve(__dirname, '../../plugins/plugin-my-library/src/index.ts'),
      'plugin-search': resolve(__dirname, '../../plugins/plugin-search/src/index.ts'),
      'plugin-storage': resolve(__dirname, '../../plugins/plugin-storage/src/index.ts'),
      'plugin-style-props': resolve(__dirname, '../../plugins/plugin-style-props/src/index.ts'),
      'plugin-ai': resolve(__dirname, '../../plugins/plugin-ai/src/index.ts'),
      'plugin-cooperation': resolve(__dirname, '../../plugins/plugin-cooperation/src/index.ts'),
      '@iss-ai/ppt-board': resolve(__dirname, '../src/index.ts'),
    }
  },
  plugins: [
    UnoCSS(),
    vue()
  ] 
});