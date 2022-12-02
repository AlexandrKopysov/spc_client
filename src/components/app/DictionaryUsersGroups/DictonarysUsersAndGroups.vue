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
import { defineComponent } from 'vue';
import IMenuItem from '@/components/Shared/Models/IMenuItem';
import routerMenuMap from '@/services/routerMenuMap.service';

export default defineComponent({
  name: 'DictonarysUsersAndGroups',
  data() {
    return {
      menuArray: [] as IMenuItem[],
    };
  },
  mounted() {
    this.menuArray = routerMenuMap(
      [...this.$router.options.routes],
      'mainLayout',
      'usersAndGroups',
    );
  },

  props: {},
});
</script>

<style scoped lang="less"></style>
