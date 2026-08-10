import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({ 
  base: './',
  resolve: {
    alias: {
      
    }
  },
  plugins: [
    UnoCSS(),
    vue()
  ] 
});