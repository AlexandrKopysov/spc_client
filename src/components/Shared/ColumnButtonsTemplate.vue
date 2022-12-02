<template>
  <div class="actions">
    <template v-if="!isEdit">
      <Button
        icon="spc spc-i-pencil"
        class="p-button-rounded p-button-text pencil-hover"
        @click="$emit('clickEdit')"
      />
      <Button
        icon="pi pi-trash"
        class="p-button-rounded p-button-text"
        @click="$emit('clickRemove')"
      />
    </template>
    <template v-else>
      <Button icon="pi pi-check" class="p-button-rounded p-button-text" @click="$emit('clickOk')" />
      <Button
        icon="pi pi-times"
        class="p-button-rounded p-button-text"
        @click="$emit('clickCancel')"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    isEdit: Boolean,
  },
  emits: ['clickEdit', 'clickRemove', 'clickOk', 'clickCancel'],
});
</script>
<style scoped lang="less">
@import url(../../style-ui-cit/table.less);
</style>
