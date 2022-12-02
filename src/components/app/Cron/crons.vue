<template>
  <div class="spc flex flex-column">
    <div class="spc-table-header">
      <div class="align-items-center">
        <div class="page-label">{{ $router.currentRoute.value.meta?.label }}</div>
        <Button label="Добавить" class="button-add" @click="editRow()" />
      </div>
    </div>
    <div class="flex-grow-1 content-table">
      <DataTable
        class="p-datatable-sm spc-table-body"
        scrollHeight="flex"
        dataKey="uid"
        filterDisplay="row"
        v-model:filters="filters"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        :paginator="true"
        :scrollable="true"
        :loading="loading"
        :value="crons"
      >
        <template #empty> Задачи не найдены </template>
        <template #loading> Загрузка задач по расписанию </template>
        <Column field="name" filterField="name" header="Наименование" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              class="p-column-filter"
              placeholder="фильтр по имени"
              v-model="filterModel.value"
              @keydown.enter="filterCallback()"
            />
          </template>
        </Column>
        <Column field="description" filterField="description" header="Описание" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              placeholder="фильтр по описанию"
              v-model="filterModel.value"
              @keydown.enter="filterCallback()"
              class="p-column-filter"
            />
          </template>
        </Column>
        <Column field="mask" filterField="mask" header="Маска" :sortable="true">
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              placeholder="фильтр по маске"
              v-model="filterModel.value"
              @keydown.enter="filterCallback()"
              class="p-column-filter"
            />
          </template>
        </Column>
        <Column field="shewhartLength" header="Количество карт" :sortable="true"> </Column>
        <Column field="disable" header="Состояние" :sortable="true">
          <template #body="slotProps">
            {{ slotProps.data.disable ? 'Отключен' : 'Работает' }}
          </template>
        </Column>
        <Column style="width: 10%; min-width: 5rem; display: flex; justify-content: end">
          <template #body="{ data, index }">
            <ColumnButtonsTemplate
              v-bind:isEdit="!!editingRows[data.uid]"
              @click-edit="editRow(data)"
              @click-remove="confirmDeleteSelected(data, index)"
            ></ColumnButtonsTemplate> </template
        ></Column>
      </DataTable>
    </div>
    <Dialog
      header="Редакитрование задачи"
      v-model:visible="isEdit"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
    >
      <CronEditFrom
        :cron="rowToEdit"
        @close-edit="closeEdit"
        @ok-edit="okEditRow($event)"
      ></CronEditFrom>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { ICronDTO } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { defineComponent } from 'vue';
import { dictMixis } from '@/components/Shared/Models/dictionary.mixin';
import { DataTableFilterMeta } from 'primevue/datatable';
import { FilterMatchMode } from 'primevue/api';
import CronEditFrom from './CronEditFrom.vue';
import { IUICronDTO } from '@/store/cron.store';

export default defineComponent({
  name: 'Cron',
  components: { CronEditFrom },
  setup() {
    return {
      storeActoinUpsertRow: 'cron/upsert',
      storeActoinDeleteRow: 'cron/remove',
    };
  },
  mixins: [dictMixis<ICronDTO>()],
  data() {
    this.$store.dispatch('cron/getAll');
    this.$store.dispatch('shewhartCardState/getDicts');
    return {
      loading: false,
      filters: {
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        mask: { value: null, matchMode: FilterMatchMode.CONTAINS },
      } as DataTableFilterMeta,
      isEdit: false,
      rowToEdit: null as IUICronDTO,
    };
  },
  computed: {
    crons() {
      return this.$store.state.cron.crons;
    },
  },
  methods: {
    closeEdit() {
      this.isEdit = false;
    },
    okEditRow(cron: IUICronDTO) {
      this.$store.dispatch(this.storeActoinUpsertRow, cron).then(() => {
        this.isEdit = false;
        this.showSucessToastMessage('Сохранение/Изменение прошло успешно');
      });
    },
    editRow(row?: IUICronDTO) {
      this.rowToEdit = row || this.getNewObj();
      this.isEdit = true;
    },
    getNewObj(): IUICronDTO {
      return {
        mask: '* * * * * *',
        uid: uuidv4(),
        shewhartCardUids: [],
        name: null,
        description: null,
        isNew: true,
      };
    },
    deleteRow() {
      this.$store
        .dispatch(this.storeActoinDeleteRow, this.selectRowDelete.entity.uid)
        .then(() => this.showSucessToastMessage('Удаление прошло успешно'))
        .then(() => (this.showDialogDelete = false));
    },
  },
});
</script>
<style scoped lang="less">
@import url('./crons.style.less');
</style>
