<template>
  <div class="col-12 content-table" v-if="localData && localData.length > 0">
    <DataTable
      class="p-datatable-sm spc-table-body"
      responsiveLayout="scroll"
      paginatorTemplate="PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :value="localData"
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      :paginator="true"
      :scrollable="true"
      scrollHeight="flex"
    >
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
        :sortable="true"
      ></Column>
    </DataTable>
  </div>
  <div class="col-12 text-center" v-else>
    <h4>Нет данных</h4>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DynamicTable',
  data() {
    return {
      localData: [],
      rowsCountForVisible: 10,
      columns: [],
    };
  },
  props: {
    rows: Array,
  },
  methods: {
    initColumns(row) {
      this.columns.length = 0;
      for (const field in row) {
        this.columns.push({
          field: field,
          header: field,
        });
      }
    },
  },
  watch: {
    rows() {
      this.localData = this.rows;
    },
    localData(newValue: Array<unknown>) {
      if (newValue && newValue.length) {
        this.initColumns(this.localData[0]);
      }
    },
  },
  created() {
    this.localData = this.rows;
  },
});
</script>

<style scoped></style>
