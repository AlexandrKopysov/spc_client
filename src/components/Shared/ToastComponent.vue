<template>
  <div><Toast position="bottom-right" group="br" /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IToastMessage from '..//../model/IToastMessage';
export default defineComponent({
  name: 'ToastComponent',
  computed: {
    message() {
      return this.$store.getters['toastMessageState/getMessage'];
    },
  },
  watch: {
    message(newValue: IToastMessage) {
      this.$toast.add({
        severity: newValue.severity,
        summary: newValue.summary,
        detail: newValue.detail,
        group: newValue?.group || null,
        life: newValue?.life || 3000,
      });
    },
  },
});
</script>
<style scoped lang="less"></style>
