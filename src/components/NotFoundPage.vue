<template>
  <div class="w-full h-full flex align-items-center justify-content-center">
    <div class="nfp-container">
      <div class="header">404</div>
      <div class="content">Страница не найдена</div>
      <div class="content">
        Cтраница, на которую вы пытаетесь попасть, не существует или была удалены. Перейдите на
        <a href="#" v-on:click="backHome()">Главную страницу</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NotFoundPage',
  methods: {
    backHome() {
      this.$router.push('/');
    },
  },
});
</script>

<style scoped lang="less">
//not found page
.nfp {
  &-container {
    width: 600px;
    .header {
      font-size: 256px;
      height: 125px;
      text-align: center;
    }
    .content {
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
