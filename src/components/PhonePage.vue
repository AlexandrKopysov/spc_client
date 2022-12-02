<template>
  <div class="w-full h-full flex align-items-center justify-content-center">
    <div class="nfp-container">
      <div class="content">К сожалению, просмотр на мобильных устройствах не доступен.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PhonePage',
  methods: {
    backHome() {
      this.$router.push('/');
    },
  },
});
</script>

<style scoped lang="less">
.nfp {
  &-container {
    width: 600px;
    .content {
      padding: 50px;
      font-size: 24px;
      line-height: 1.5rem;
      text-align: center;
    }
  }
}
</style>
