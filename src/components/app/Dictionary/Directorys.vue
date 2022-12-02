<template>
  <div class="spc flex flex-column">
    <div class="tab-menu">
      <TabMenu :model="menuArray" />
    </div>
    <div class="flex-grow-1 content-table">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import IMenuItem from '@/components/Shared/Models/IMenuItem';
import routerMenuMap from '@/services/routerMenuMap.service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Directorys',
  data() {
    return {
      menuArray: [] as IMenuItem[],
    };
  },
  mounted() {
    this.menuArray = routerMenuMap([...this.$router.options.routes], 'mainLayout', 'directorys');
  },
});
</script>

<style scoped lang="less">
@import url('./dictionarys.style.less');
</style>
