<template>
  <template v-if="!isEdit">
    <slot></slot>
  </template>
  <template v-else>
    <slot name="editor"></slot>
  </template>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    isEdit: Boolean,
  },
});
</script>
