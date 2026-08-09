<template>
  <div class="editor-container">
    <div class="floating-actions">
      <!-- <n-dropdown v-if="!isPreviewing" trigger="hover" :options="previewOptions" @select="handlePreviewSelect">
        <button class="icon-btn play-btn" title="Preview Options">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </n-dropdown> -->
      <!-- <a class="icon-btn agent-btn" v-if="!isPreviewing" href="./AGENT.md" download="AGENT.md"
        title="Download AI Prompt">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
      </a>
      <button class="icon-btn import-btn" v-if="!isPreviewing" @click="showImportModal = true" title="Import JSON">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
        </svg>
      </button>
      <button class="icon-btn close-btn" v-if="isPreviewing" @click="exitPreview" title="Back to Editor">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button> -->
    </div>

    <VueCanvasEditor v-if="!isPreviewing" ref="editorRef" :plugins="activePlugins" />
    <Preview v-else ref="previewRef" />

    <n-modal v-model:show="showImportModal" preset="card" style="width: 600px" title="Import JSON Data">
      <n-tabs type="segment">
        <n-tab-pane name="upload" tab="Upload JSON File">
          <n-upload accept=".json" :default-upload="false" @change="handleFileUpload">
            <n-button>Select JSON File</n-button>
          </n-upload>
        </n-tab-pane>
        <n-tab-pane name="paste" tab="Paste JSON String">
          <n-input v-model:value="jsonPastedText" type="textarea" rows="10" placeholder="Paste JSON here..." />
          <n-button type="primary" style="margin-top: 12px" @click="handlePasteImport">Import</n-button>
        </n-tab-pane>
      </n-tabs>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NDropdown, NModal, NTabs, NTabPane, NUpload, NButton, NInput } from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { Preview } from '@iss-ai/vue-canvas-core';
import { VueCanvasEditor } from '@iss-ai/ppt-board';
import testPptData from './data/test-ppt.json';
import introPptData from './data/intro.json';

import { MenuPlugin } from 'plugin-menu';
import { MyLibraryPlugin } from 'plugin-my-library';
import { SearchPlugin } from 'plugin-search';
import { StoragePlugin } from 'plugin-storage';
import { StylePropsPlugin } from 'plugin-style-props';
import { AIPlugin } from 'plugin-ai';

const activePlugins = [
  MenuPlugin,
  MyLibraryPlugin,
  SearchPlugin,
  StoragePlugin,
  StylePropsPlugin,
  AIPlugin
];

const editorRef = ref<InstanceType<typeof VueCanvasEditor> | null>(null);
const previewRef = ref<InstanceType<typeof Preview> | null>(null);
const isPreviewing = ref(false);
onMounted(() => {
  // const data = editorRef.value?.getData();
  // const isEmpty = !data || (data.slides && data.slides.length === 0) || (data.slides && data.slides.length === 1 && (!data.slides[0].elements || data.slides[0].elements.length === 0));
  // editorRef.value?.loadData(isEmpty ? testPptData : data);
})
const previewOptions = [
  { label: 'Preview Current Data', key: 'current' },
  { label: 'Preview Rich Example', key: 'example' },
  { label: 'Preview Vue Canvas Intro', key: 'intro' }
];

const handlePreviewSelect = (key: string) => {
  isPreviewing.value = true;
  // Use timeout to ensure Preview is mounted before calling methods
  setTimeout(() => {
    if (previewRef.value) {
      if (key === 'current') {
        const data = editorRef.value?.getData();
        if (data) previewRef.value.loadData(data);
      } else if (key === 'intro') {
        previewRef.value.loadData(introPptData as any);
      } else {
        previewRef.value.loadData(testPptData as any);
      }
      previewRef.value.play(true); // play with auto-advance / multi-slide support
    }
  }, 100);
};

const exitPreview = () => {
  isPreviewing.value = false;
};

const showImportModal = ref(false);
const jsonPastedText = ref('');

const loadAndClose = (data: any) => {
  if (editorRef.value) {
    editorRef.value.loadData(data);
    showImportModal.value = false;
    alert('Import successful!');
  }
};

const handlePasteImport = () => {
  try {
    const data = JSON.parse(jsonPastedText.value);
    loadAndClose(data);
  } catch (e) {
    alert('Invalid JSON string');
  }
};

const handleFileUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }) => {
  const file = options.file.file;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const data = JSON.parse(text);
      loadAndClose(data);
    } catch (e) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
};
</script>


<style lang="scss" scoped>
.editor-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.floating-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  &.play-btn {
    background: linear-gradient(135deg, #42b883, #3b9b70);
  }

  &.close-btn {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
  }

  &.agent-btn {
    background: linear-gradient(135deg, #9b59b6, #8e44ad);
  }

  &.import-btn {
    background: linear-gradient(135deg, #f39c12, #d35400);
  }
}
</style>