<template>
  <div class="h-full flex flex-column">
    <div class="w-full spc-table-header flex flex-column">
      <label class="page-label">{{ $router.currentRoute.value.meta?.label }}</label>
      <div class="w-full spc-table-header">
        <div>
          <Button
            label="Добавить"
            class="button-add mr-3"
            @click="createShewhart()"
            v-if="checkUserRoleEntry(ESRole.Admin, ESRole.Analyst)"
          />
          <Dropdown
            v-model="selectedFilter"
            optionLabel="name"
            placeholder="Выберите фильтр"
            :options="generalFilter"
            @change="selectFilter(selectedFilter.value.value)"
          />
        </div>
      </div>
    </div>

    <div class="w-full flex-grow-1 content-table">
      <DataTable
        class="p-datatable-sm spc-table-body"
        responsiveLayout="scroll"
        filterMode="lenient"
        filterDisplay="row"
        scrollHeight="flex"
        dataKey="uid"
        selectionMode="single"
        :lazy="true"
        :rows="10"
        :paginator="true"
        :scrollable="true"
        :value="rows"
        :selection="selectedRow"
        :rowsPerPageOptions="[10, 20, 50]"
        :totalRecords="totalRecords"
        v-if="dropdownMenu"
        @rowSelect="onRowSelect($event.data.uid)"
        @page="onPage($event)"
        @sort="onSort($event)"
        @filter="onFilter()"
      >
        <Column field="type" header="Тип" class="column-color-black button-filter-none">
          <template #filter="{}">
            <MultiSelect
              v-model="dropdownMenu.typeSelect"
              :options="dropdownMenu.type"
              class="changeColumn multiselect-custom w-full"
              selectedItemsLabel="{} Строк выбрано"
              :maxSelectedLabels="2"
              :filter="true"
              @change="onFilter()"
            >
            </MultiSelect> </template
        ></Column>
        <Column
          field="production"
          header="Производство"
          class="column-color-black button-filter-none"
        >
          <template #filter="{}">
            <MultiSelect
              v-model="dropdownMenu.productionSelect"
              :options="dropdownMenu.production"
              class="changeColumn multiselect-custom w-full"
              selectedItemsLabel="{} Строк выбрано"
              :maxSelectedLabels="2"
              :filter="true"
              @change="onFilter()"
            >
            </MultiSelect>
          </template>
        </Column>
        <Column field="product" header="Изделие" class="column-color-black button-filter-none">
          <template #filter="{}">
            <MultiSelect
              v-model="dropdownMenu.productSelect"
              :options="dropdownMenu.product"
              class="changeColumn multiselect-custom w-full"
              selectedItemsLabel="{} Строк выбрано"
              :maxSelectedLabels="2"
              :filter="true"
              @change="onFilter()"
            >
            </MultiSelect>
          </template>
        </Column>
        <Column field="process" header="Процесс" class="column-color-black button-filter-none">
          <template #filter="{}">
            <MultiSelect
              v-model="dropdownMenu.processSelect"
              :options="dropdownMenu.process"
              class="changeColumn multiselect-custom w-full"
              selectedItemsLabel="{} Строк выбрано"
              :maxSelectedLabels="2"
              :filter="true"
              @change="onFilter()"
            >
            </MultiSelect> </template
        ></Column>
        <Column field="operation" header="Операция" class="column-color-black button-filter-none">
          <template #filter="{}">
            <MultiSelect
              v-model="dropdownMenu.operationSelect"
              :options="dropdownMenu.operation"
              class="changeColumn multiselect-custom w-full"
              selectedItemsLabel="{} Строк выбрано"
              :maxSelectedLabels="2"
              :filter="true"
              @change="onFilter()"
            >
            </MultiSelect> </template
        ></Column>
        <Column field="parameter" header="Параметр" class="column-color-black button-filter-none">
          <template #filter="{}">
            <MultiSelect
              v-model="dropdownMenu.parameterSelect"
              :options="dropdownMenu.parameter"
              class="changeColumn multiselect-custom w-full"
              selectedItemsLabel="{} Строк выбрано"
              :maxSelectedLabels="2"
              :filter="true"
              @change="onFilter()"
            >
            </MultiSelect> </template
        ></Column>
        <Column field="cp" header="Cp" class="column-color-black">
          <template #body="{ data }">
            {{ data.cp ? Number(data.cp).toFixed(3) : '' }}
          </template>
        </Column>
        <Column field="cpk" header="Cpk" class="column-color-black">
          <template #body="{ data }">
            {{ data.cp ? Number(data.cpk).toFixed(3) : '' }}
          </template>
        </Column>
        <Column field="responsibleUsers" header="Ответственные">
          <template #body="{ data, field }">
            <div class="grid">
              <div class="col-12 p-0" v-for="fullName in data[field]" :key="fullName">
                {{ fullName }}
              </div>
            </div>
          </template>
        </Column>
        <Column field="dateCreate" header="Создание">
          <template #body="{ data, field }">
            {{ new Date(data[field]).toLocaleString() }}
          </template>
        </Column>
        <Column
          style="justify-content: end"
          v-if="checkUserRoleEntry(ESRole.Admin, ESRole.Analyst)"
        >
          <template #body="{ data, index }">
            <div class="actions">
              <Button
                icon="spc spc-i-pencil"
                class="p-button-rounded p-button-text pencil-hover"
                @click="upserRow(data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text"
                @click="confirmDeleteSelected(data, index)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="showDialogDelete"
      :style="{ width: '450px' }"
      header="Подтверждение"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Вы точно хотите удалить строку?</span>
      </div>
      <template #footer>
        <Button
          label="Нет"
          icon="pi pi-times"
          class="p-button-text"
          @click="showDialogDelete = false"
        />
        <Button label="Да" icon="pi pi-check" class="p-button-text" @click="deleteRow()" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { EUserRole, IShewardCardTableDTO } from '@/api';
import { FilterMatchMode } from 'primevue/api';
import { CToastMessage } from '../../model/IToastMessage';
import { defineComponent } from 'vue';
import { LocationQuery } from 'vue-router';
import { DropdownShewhardCardFilter } from '../../model/ShewhardCardQueryFilter';
import { FILTERS } from '../../services/testFilterService';

interface IFilterSelect {
  name: string;
  value: IFIlter;
}

interface IFIlter {
  value: string;
  matchMode: string;
}

export default defineComponent({
  name: 'Home',
  components: {
    // ColumnButtonsTemplate,
  },
  setup() {
    return {
      nameColumn: [
        'type',
        'production',
        'product',
        'process',
        'operation',
        'parameter',
        'responsibleUsers',
      ],
    };
  },
  data() {
    return {
      dropdownMenu: null as DropdownShewhardCardFilter,
      generalFilter: [
        { name: 'Все', value: {} },
        {
          name: 'Ответственный',
          value: {
            value: this.$store.getters['user/GET_FULLNAME'],
            matchMode: FilterMatchMode.CONTAINS,
          },
        },
      ] as IFilterSelect[],
      selectedFilter: null as IFilterSelect,
      ESRole: EUserRole,
      selectDeleteRow: {
        index: null,
        entity: {} as IShewardCardTableDTO,
      },
      /** Параметры ленивой загрузки */
      lazyParams: {
        first: 0,
        rows: 10,
        order: null,
        filters: null as DropdownShewhardCardFilter,
      },

      selectedRow: {} as IShewardCardTableDTO,
      totalRows: [] as IShewardCardTableDTO[],
      rows: [] as IShewardCardTableDTO[],
      selectionRows: [] as IShewardCardTableDTO[],
      showDialogDelete: false,
      totalRecords: 0,
      loading: false,
      rowsCountForVisible: 10,
    };
  },
  methods: {
    createShewhart() {
      this.$router.push('/createShewhartCard');
    },
    upserRow(data) {
      this.$router.push(`/createShewhartCard/${data.uid}`);
    },

    onRowSelect(uid: string) {
      this.$router.push(`/viewShewhartCard/graphics/${uid}`);
    },

    selectFilter(newValue: string) {
      this.dropdownMenu.responsibleUsersSelect = newValue ? [newValue] : [];
      this.onFilter();
    },

    confirmDeleteSelected(data, index) {
      this.selectDeleteRow = {
        index,
        entity: data,
      };
      this.$confirm.require({
        message: 'Вы точно хотите удалить строку?',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: () => {
          this.deleteRow();
        },
      });
    },

    deleteRow() {
      this.$store
        .dispatch('shewhartCardState/delete', this.selectDeleteRow.entity)
        .then(() => {
          this.totalRows = this.totalRows.filter((row) => {
            return row.uid != this.selectDeleteRow.entity.uid;
          });
          this.$store.dispatch(
            'toastMessageState/success',
            new CToastMessage('Данные успешно удалены'),
          );
        })
        .finally(() => {
          this.selectDeleteRow = null;
        });
    },

    loadLazyData() {
      this.loading = true;
      // const shewhartState =
      this.$store
        .dispatch('shewhartCardState/getAllWithCredentionsState')
        .then((response: IShewardCardTableDTO[]) => {
          this.fillingDropdownFilter(response);
          this.totalRows = response.filter((row) => {
            return FILTERS.reduce((res, f) => {
              return res && f.execute(row, this.dropdownMenu);
            }, true);
          });
          this.rows = this.getPageRows(this.lazyParams.first, this.lazyParams.rows);
          this.totalRecords = response.length;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onPage(event) {
      this.lazyParams = event;
      this.loadLazyData();
    },

    getPageRows(first: number, count: number): IShewardCardTableDTO[] {
      return this.totalRows.filter((r, index) => index >= first && index <= first + count);
    },

    onSort(event) {
      this.lazyParams = event;
      this.loadLazyData();
    },

    toUniqByKeyArr(object: IShewardCardTableDTO[], field: string) {
      return Array.from(
        new Set(
          object.map((row) => {
            return row[field];
          }),
        ),
      );
    },

    fillingDropdownFilter(newRows: IShewardCardTableDTO[]) {
      this.nameColumn.forEach((key) => {
        this.dropdownMenu[key] = this.toUniqByKeyArr(newRows, key);
      });
    },

    onFilter() {
      this.$router.push({
        path: '/',
        query: {
          type: this.dropdownMenu.typeSelect,
          production: this.dropdownMenu.productionSelect,
          product: this.dropdownMenu.productSelect,
          process: this.dropdownMenu.processSelect,
          operation: this.dropdownMenu.operationSelect,
          parameter: this.dropdownMenu.parameterSelect,
          responsibleUsers: this.dropdownMenu.responsibleUsersSelect,
        },
      });
      this.loadLazyData();
    },

    createFilter(filter: LocationQuery) {
      this.dropdownMenu = new DropdownShewhardCardFilter(
        filter.type as string[],
        filter.production as string[],
        filter.product as string[],
        filter.process as string[],
        filter.operation as string[],
        filter.parameter as string[],
        filter.responsibleUsers as string[],
      );
      this.selectedFilter =
        this.dropdownMenu.responsibleUsersSelect.length != 0
          ? this.generalFilter.find((row) => {
              return this.dropdownMenu.responsibleUsersSelect.indexOf(row.value.value) > -1;
            })
          : ({ name: 'Все', value: {} } as IFilterSelect);
    },
  },
  mounted() {
    this.loading = true;

    this.lazyParams = {
      first: 0,
      rows: this.rowsCountForVisible,
      order: null,
      filters: this.dropdownMenu,
    };

    this.createFilter(this.$route.query);
    this.loadLazyData();
    // this.fillingDropdownFilter(this.totalRows);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.checkUserRoleEntry(EUserRole.User);
  },
});
</script>

<style scoped lang="less">
.spc-table-header {
  justify-content: space-between;
}
</style>
