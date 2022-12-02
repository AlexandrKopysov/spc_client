<template>
  <div class="flex flex-column h-full">
    <div class="w-full spc-table-header">
      <Button label="Добавить" class="button-add" @click="addRow()" />
    </div>
    <div class="w-full flex-grow-1 content-table">
      <DataTable
        editMode="row"
        v-model:selection="selectionsRowData"
        v-model:filters="filters"
        dataKey="uid"
        filterDisplay="row"
        class="p-datatable-sm spc-table-body"
        scrollHeight="flex"
        :globalFilterFields="['name', 'description', 'decNumber', 'kodOzm']"
        :scrollable="true"
        :value="rows"
        :lazy="true"
        :paginator="true"
        :rows="rowsCountForVisible"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[10, 20, 50]"
        @page="onPage($event)"
        @sort="onSort($event)"
        @filter="onFilter()"
      >
        <template #empty> Параметры не найдены </template>
        <template #loading> Загрузка параметров изделия </template>
        <Column
          field="name"
          filterField="name"
          header="Наименование"
          class="button-filter-none"
          :sortable="true"
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
          class="button-filter-none"
          :sortable="true"
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
        <Column
          field="decNumber"
          filterField="decNumber"
          header="Децимальный номер"
          class="button-filter-none"
          :sortable="true"
        >
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Поиск по децимальному номеру`"
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
          field="kodOzm"
          filterField="kodOzm"
          header="Код ОЗМ"
          class="button-filter-none"
          :sortable="true"
        >
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              {{ data[field] }}
              <template #editor>
                <InputNumber v-model="editingRows[data.uid][field]" class="changeColumn" />
              </template>
            </ColumnTemplate>
          </template>
        </Column>
        <Column
          field="paramUids"
          filterField="paramUids"
          header="Параметры"
          class="button-filter-none"
        >
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              <div class="grid">
                <div class="col-12" v-for="paramUid in data[field]" :key="paramUid">
                  {{ allParamsDict[paramUid]?.name }}
                </div>
              </div>
              <template #editor>
                <MultiSelect
                  v-model="editingRows[data.uid][field]"
                  optionLabel="name"
                  optionValue="uid"
                  placeholder="Выберите параметры"
                  class="changeColumn multiselect-custom"
                  selectedItemsLabel="{} Строк выбрано"
                  :maxSelectedLabels="2"
                  :filter="true"
                  :options="allParams"
                >
                  <template #option="data">
                    {{ data.option.name }}
                  </template>
                </MultiSelect>
              </template>
            </ColumnTemplate>
          </template>
        </Column>

        <Column style="width: 5%; min-width: 5rem; display: flex; justify-content: end">
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
import { IEntityBase, IProductDTO } from '@/api';
import { FilterMatchMode } from 'primevue/api';
import { v4 as uuidv4 } from 'uuid';
import { DataTableFilterMeta } from 'primevue/datatable';
import { defineComponent } from 'vue';
import { dictMixis } from '@/components/Shared/Models/dictionary.mixin';

type ProductUI = IProductDTO & {
  isNew?: boolean;
};

export default defineComponent({
  name: 'DirectoryParameters',
  mixins: [dictMixis<ProductUI>()],
  setup() {
    return {
      storeActoinUpsertRow: 'productState/upsert',
      storeActoinDeleteRow: 'productState/delete',
    };
  },
  data() {
    return {
      allParams: [] as IEntityBase[],
      allParamsDict: {} as Record<string, IEntityBase>,

      rows: [] as ProductUI[],
      editingRows: {} as Record<string, ProductUI>,

      selectionsRowData: [] as ProductUI[],
      visibleProgressBar: true,
      filters: {
        name: { value: '', matchMode: FilterMatchMode.CONTAINS },
        description: { value: '', matchMode: FilterMatchMode.CONTAINS },
        decNumber: { value: '', matchMode: FilterMatchMode.CONTAINS },
        kodOzm: { value: '', matchMode: FilterMatchMode.CONTAINS },
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
    getNewObj(): ProductUI {
      return {
        decNumber: '',
        kodOzm: null,
        name: '',
        description: '',
        isNew: true,
        paramUids: [],
        uid: uuidv4(),
      };
    },
    loadParams() {
      this.$store.dispatch('parameterState/getDict').then((response: Array<IEntityBase>) => {
        this.allParams = response;
        this.allParamsDict = response.reduce((a: Record<string, IEntityBase>, b) => {
          a[b.uid] = b;
          return a;
        }, {});
      });
    },
    loadLazyData() {
      this.loading = true;
      this.$store
        .dispatch('productState/getLazy', this.lazyParams)
        .then((response) => {
          this.rows = response.rows;
          this.totalRecords = response.totalCount;
        })
        .finally(() => {
          this.visibleProgressBar = false;
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
    this.loadParams();
  },
  beforeRouteLeave(to, from, next) {
    this.checkGuardValidate(next);
  },
});
</script>

<style scoped lang="less">
@import url('./dictionarys.style.less');
</style>
