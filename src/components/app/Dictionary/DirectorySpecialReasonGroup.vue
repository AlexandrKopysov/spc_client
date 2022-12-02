<template>
  <div class="spc flex flex-column">
    <div class="spc-table-header">
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
        :totalRecords="totalRecords"
        :value="rows"
        :lazy="true"
        :paginator="true"
        :rows="rowsCountForVisible"
        :rowsPerPageOptions="[10, 20, 50]"
        :globalFilterFields="['name', 'description']"
        :scrollable="true"
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
          style="width: 25%"
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
          style="width: 50%"
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
        <Column field="specialReasonUids" header="Типы особых причин" style="width: 22%">
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              <div class="grid">
                <div class="col-12" v-for="spcUid in data[field]" :key="spcUid">
                  {{ allSpecialReasonTypeDict[spcUid]?.name }}
                </div>
              </div>
              <template #editor>
                <MultiSelect
                  v-model="editingRows[data.uid][field]"
                  optionLabel="name"
                  optionValue="uid"
                  placeholder="Выберите особые причины"
                  class="changeColumn multiselect-custom"
                  selectedItemsLabel="{} Строк выбрано"
                  optionDisabled="isRemoved"
                  :maxSelectedLabels="2"
                  :filter="true"
                  :options="allSpecialReasonType"
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
              @click-ok="okEditRow(toDoEditRowModel(editingRows[data.uid]), index)"
              @click-cancel="canselEdit(editingRows[data.uid], index)"
            ></ColumnButtonsTemplate> </template
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { ISpecialReasonDTO, ISpecialReasonGroupDTO, IEntityBase } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { FilterMatchMode } from 'primevue/api';
import { DataTableFilterMeta } from 'primevue/datatable';
import { defineComponent } from 'vue';
import { dictMixis } from '@/components/Shared/Models/dictionary.mixin';

type SpecialReasonGroupUI = ISpecialReasonGroupDTO & {
  isNew?: boolean;
};

export default defineComponent({
  name: 'DirectorySpecialReason',
  mixins: [dictMixis<SpecialReasonGroupUI>()],
  setup() {
    return {
      storeActoinUpsertRow: 'specialReasonGroupState/upsert',
      storeActoinDeleteRow: 'specialReasonGroupState/delete',
    };
  },
  data() {
    return {
      allSpecialReasonType: [] as ISpecialReasonDTO[],
      allSpecialReasonTypeDict: {} as Record<string, IEntityBase>,
      rows: [] as SpecialReasonGroupUI[],
      editingRows: {} as Record<string, SpecialReasonGroupUI>,
      selectionsRowData: [] as SpecialReasonGroupUI[],
      visibleProgressBar: true,
      filters: {
        name: { value: '', matchMode: FilterMatchMode.CONTAINS },
        description: { value: '', matchMode: FilterMatchMode.CONTAINS },
      } as DataTableFilterMeta,
      lazyParams: {
        first: 10,
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
    getNewObj(): SpecialReasonGroupUI {
      return {
        uid: uuidv4(),
        name: null,
        description: null,
        isNew: true,
        specialReasonUids: [],
      };
    },
    toDoEditRowModel(editRow) {
      return {
        description: editRow.description,
        isRemoved: editRow.isRemoved,
        name: editRow.name,
        specialReasonUids: editRow.specialReasonUids,
        uid: editRow.uid,
      } as ISpecialReasonGroupDTO;
    },

    loadSpecialReasonType() {
      this.$store.dispatch('specialReasonTypeState/getDict').then((response) => {
        this.allSpecialReasonType = response;
        this.allSpecialReasonTypeDict = response.reduce((a: Record<string, IEntityBase>, b) => {
          a[b.uid] = b;
          return a;
        }, {});
      });
    },
    loadLazyData() {
      this.loading = true;
      this.$store
        .dispatch('specialReasonGroupState/getLazy', this.lazyParams)
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
    this.loadSpecialReasonType();
  },
  beforeRouteLeave(to, from, next) {
    this.checkGuardValidate(next);
  },
});
</script>

<style scoped lang="less">
@import url('./dictionarys.style.less');
</style>
