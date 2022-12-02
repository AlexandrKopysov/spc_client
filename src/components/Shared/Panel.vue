<template>
  <div class="grid grid-nogutter p-3 tile">
    <div class="col-12">
      <div v-if="tile.header" class="mb-3 tile__header">{{ tile.header }}</div>
      <div class="grid" v-for="data in tile.data" :key="data.key">
        <div class="col-4">{{ data.key }}:</div>
        <div class="col-8">{{ data.value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Panel',
  props: {
    tile: Object,
  },
});
</script>
<style lang="less" scoped>
.tile {
  background-color: #f2f2f2;
  border-radius: 5px;
  border: 1px solid #989898;
  height: 200px;
  .tile__header {
    font-weight: 600;
  }
}
</style>
