export { default as VueCanvasEditor } from './components/VueCanvasEditor.vue';

// Re-export everything from core so plugins only need to depend on this package
export * from '@iss-ai/vue-canvas-core';
export * from './db/EasyDexieStore.js';
export * from './db/types.js';
