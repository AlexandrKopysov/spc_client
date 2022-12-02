<template>
  <div class="grid container spc-table-body">
    <div class="col-12">
      <div class="grid" v-for="point in selectedPoints" :key="point.uniqId">
        <div class="col-10">
          <span>{{ point.uniqId }}</span>
          <p>x - {{ new Date(point.date).toLocaleString() }}</p>
          <p>y - {{ point.value }}</p>
        </div>
        <div class="col-2 p-3">
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text"
            @click="removeStorePoints(point)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IQueryPointDTO } from '@/api';
export default defineComponent({
  name: 'SRPoints',
  data() {
    return {
      selectedPoints: this.getStoreSelectedPoints() as IQueryPointDTO[],
    };
  },
  methods: {
    /**Вернуть все выбранные точки */
    getStoreSelectedPoints(): Array<IQueryPointDTO> {
      return this.$store.getters['selectedPointsState/getSelectedPoints'];
    },
    /**Убрать point из store */
    removeStorePoints(groupPoint: IQueryPointDTO) {
      this.$store.dispatch('selectedPointsState/pointRemove', groupPoint);
    },
  },
});
</script>
<style scoped lang="less">
.container {
  overflow-x: hidden;
  p {
    margin: 0;
  }
}
</style>
