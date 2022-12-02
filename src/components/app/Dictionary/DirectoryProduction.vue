<template>
  <div class="flex flex-column h-full">
    <div class="flex spc-table-header">
      <Button label="Добавить" class="button-add" @click="addRow()" />
    </div>
    <div class="flex-grow-1 content-table">
      <DataTable
        editMode="row"
        v-model:selection="selectionsRowData"
        v-model:filters="filters"
        dataKey="uid"
        filterDisplay="row"
        class="p-datatable-sm spc-table-body"
        scrollHeight="flex"
        :scrollable="true"
        :value="rows"
        :lazy="true"
        :paginator="true"
        :rows="rowsCountForVisible"
        :totalRecords="totalRecords"
        :globalFilterFields="['name', 'description']"
        :rowsPerPageOptions="[10, 20, 50]"
        @page="onPage($event)"
        @sort="onSort($event)"
        @filter="onFilter()"
      >
        <template #empty> Данные не найдены </template>
        <template #loading> Загрузка </template>
        <Column
          field="name"
          filterField="name"
          header="Наименование"
          :sortable="true"
          class="button-filter-none"
        >
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Поиск по наименованию`"
              @keydown.enter="filterCallback()"
            />
          </template>
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              {{ data[field] }}
              <template #editor>
                <InputText v-model="editingRows[data.uid][field]" class="changeColumn" />
              </template>
            </ColumnTemplate>
          </template>
        </Column>
        <Column
          field="description"
          filterField="description"
          header="Описание"
          :sortable="true"
          class="button-filter-none"
        >
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Поиск по описанию`"
              @keydown.enter="filterCallback()"
            />
          </template>
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              {{ data[field] }}
              <template #editor>
                <InputText v-model="editingRows[data.uid][field]" class="changeColumn" />
              </template>
            </ColumnTemplate>
          </template>
        </Column>
        <Column style="width: 10%; min-width: 5rem; display: flex; justify-content: end">
          <template #body="{ data, index }">
            <ColumnButtonsTemplate
              v-bind:isEdit="!!editingRows[data.uid]"
              @click-edit="editRow(data)"
              @click-remove="confirmDeleteSelected(data, index)"
              @click-ok="okEditRow(editingRows[data.uid], index)"
              @click-cancel="canselEdit(editingRows[data.uid], index)"
            ></ColumnButtonsTemplate> </template
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { IProductionDTO } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { FilterMatchMode } from 'primevue/api';
import { DataTableFilterMeta } from 'primevue/datatable';
import { defineComponent } from 'vue';
import { dictMixis } from '@/components/Shared/Models/dictionary.mixin';

type ProductionUI = IProductionDTO & {
  isNew?: boolean;
};

export default defineComponent({
  name: 'DirectoryParameters',
  mixins: [dictMixis<ProductionUI>()],
  setup() {
    return {
      storeActoinUpsertRow: 'productionState/upsert',
      storeActoinDeleteRow: 'productionState/delete',
      storeActionGetLazyRows: 'productionState/getLazy',
    };
  },
  data() {
    return {
      rows: [] as ProductionUI[],
      editingRows: {} as Record<string, ProductionUI>,
      selectionsRowData: [] as ProductionUI[],
      visibleProgressBar: true,
      filters: {
        name: { value: '', matchMode: FilterMatchMode.CONTAINS },
        description: { value: '', matchMode: FilterMatchMode.CONTAINS },
      } as DataTableFilterMeta,
      lazyParams: {
        first: 0,
        rows: 0,
        order: null,
        filters: {} as DataTableFilterMeta,
      },
      totalRecords: 0,
      loading: false,
      rowsCountForVisible: 10,
    };
  },
  methods: {
    getNewObj(): ProductionUI {
      return {
        uid: uuidv4(),
        name: null,
        description: null,
        isNew: true,
      };
    },
    loadLazyData() {
      this.loading = true;
      this.$store
        .dispatch(this.storeActionGetLazyRows, this.lazyParams)
        .then((response) => {
          this.rows = response.rows;
          this.totalRecords = response.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onPage(event) {
      this.lazyParams = event;
      this.loadLazyData();
    },
    onSort(event) {
      this.lazyParams = event;
      this.loadLazyData();
    },
    onFilter() {
      this.lazyParams.filters = this.filters;
      this.loadLazyData();
    },
  },
  mounted() {
    this.loading = true;
    this.lazyParams = {
      first: 0,
      rows: this.rowsCountForVisible,
      order: null,
      filters: this.filters,
    };
    this.loadLazyData();
  },
  beforeRouteLeave(to, from, next) {
    this.checkGuardValidate(next);
  },
});
</script>

<style scoped lang="less">
@import url('./dictionarys.style.less');
</style>
