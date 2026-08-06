<template>
  <n-config-provider :theme-overrides="themeOverrides" style="width: 100%; height: 100%;">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <CanvasEditor ref="editorRef" v-bind="$attrs">
            <!-- Pass down all slots to the core editor -->
            <template v-for="(_, name) in $slots" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps || {}"></slot>
            </template>
          </CanvasEditor>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  type GlobalThemeOverrides
} from 'naive-ui';
import { CanvasEditor } from '@iss-ai/vue-canvas-core';

const props = defineProps<{
  plugins?: any[];
}>();

// Provide basic theme overrides if needed, allow plugins or users to override
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a'
  }
};

const editorRef = ref<InstanceType<typeof CanvasEditor> | null>(null);

onMounted(() => {
  if (props.plugins && editorRef.value) {
    props.plugins.forEach(plugin => {
      // Pass the plugin to the core CanvasEditor
      editorRef.value?.usePlugin(plugin);
    });
  }
});

// Expose the underlying CanvasEditor methods via Proxy to act as a transparent wrapper
defineExpose(
  new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'getCoreEditor') return () => editorRef.value;
        return editorRef.value?.[prop as keyof typeof editorRef.value];
      },
      has(_target, prop) {
        return prop === 'getCoreEditor' || (editorRef.value ? Reflect.has(editorRef.value, prop) : false);
      },
      ownKeys() {
        return editorRef.value
          ? ['getCoreEditor', ...Reflect.ownKeys(editorRef.value)]
          : ['getCoreEditor'];
      },
      getOwnPropertyDescriptor(_target, prop) {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    }
  ) as unknown as InstanceType<typeof CanvasEditor> & {
    getCoreEditor: () => InstanceType<typeof CanvasEditor> | null;
  }
);
</script>

<style scoped>
/* Any editor specific global styles can go here */
</style>
