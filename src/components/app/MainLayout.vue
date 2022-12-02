<template>
  <div class="spc flex flex-column h-display">
    <div class="header pb-0">
      <HeaderMenu></HeaderMenu>
    </div>
    <div class="progress-bar pt-0 pb-3">
      <ProgressBar
        mode="indeterminate"
        style="height: 0.5em"
        v-if="$store.state.progressBarState.value"
      />
    </div>
    <div class="flex-grow-1 content px-4">
      <router-view />
    </div>
    <ToastComponent position="bottom-right" group="br" />
  </div>
</template>

<script lang="ts">
import HeaderMenu from './Header/Header.vue';
import { IAuthResDto } from '@/api';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  components: { HeaderMenu },
  data() {
    return {
      userRes: {} as IAuthResDto,
    };
  },
  beforeCreate() {
    this.$router.afterEach((to) => {
      document.title = (to.meta?.title as string) || document.title;
    });
    document.title = (this.$route.meta?.title as string) || document.title;
  },
});
</script>

<style scoped lang="less">
.h-display {
  height: 100vh;
  padding-bottom: 1rem;
}
</style>
