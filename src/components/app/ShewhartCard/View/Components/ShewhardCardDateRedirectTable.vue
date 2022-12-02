<template>
  <div class="grid h-full grid-nogutter">
    <div class="col-12 p-0">
      <div class="spc-table-header p-0 pb-2">
        <label class="page-sublabel">Границы пересчета</label>
      </div>
      <DataTable
        class="p-datatable-sm spc-table-body"
        :value="rows"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
      >
        <Column field="date" header="Дата перерасчета">
          <template #body="{ data, field }">
            {{ new Date(data[field]).toLocaleString() }}
          </template>
        </Column>
        <Column field="comment" header="Причина перерасчета">
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              {{ data[field] }}
            </ColumnTemplate>
          </template>
        </Column>
        <Column field="tehMinLimit" header="НГД">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="tehMaxLimit" header="ВГД">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="cp" header="Сp">
          <template #body="{ data, field }">
            {{ getRoundData(data[field]) }}
          </template>
        </Column>
        <Column field="cpk" header="Сpk">
          <template #body="{ data, field }">
            {{ getRoundData(data[field]) }}
          </template>
        </Column>
        <Column field="P3Sigm" header="+3Sigm">
          <template #body="{ data, field }">
            {{ getRoundData(data[field]) }}
          </template>
        </Column>
        <Column field="AVG" header="Среднее">
          <template #body="{ data, field }">
            {{ getRoundData(data[field]) }}
          </template>
        </Column>
        <Column field="M3Sigm" header="-3Sigm">
          <template #body="{ data, field }">
            {{ getRoundData(data[field]) }}
          </template>
        </Column>
        <Column
          style="width: auto; min-width: 5rem"
          class="actions"
          v-if="checkResponsibles(responsibles)"
        >
          <template #body="{ data, index }">
            <div v-if="!editingRows[data.uid]">
              <Button
                icon="spc spc-i-pencil"
                class="p-button-rounded p-button-text pencil-hover"
                @click="editRow(data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text"
                @click="confirmDeleteSelected(data, index)"
              />
            </div>
            <div v-if="!!editingRows[data.uid]">
              <Button
                icon="pi pi-check"
                class="p-button-rounded p-button-text"
                @click="okEditRow(editingRows[data.uid])"
              />
              <Button
                icon="pi pi-times"
                class="p-button-rounded p-button-text"
                @click="canselEdit(editingRows[data.uid], index)"
              />
            </div>
          </template>
          ></Column
        >
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
        <span>Вы точно хотите удалить строку,</span>
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
    <DialogUpserDateRedirectRow
      :editingRowsProp="editingRows"
      :showDialogUpserRowProp="showDialogUpserRow"
      @ok-edit="okEditRow(editingRows)"
      @off-edit="showDialogUpserRow = false"
    />
    <Toast position="bottom-right" group="br" />
  </div>
</template>

<script lang="ts">
import { IShewhartCardDTO, IDateRedirectUpsertDTO, IUserBaseDTO, EZoneName } from '@/api';
import { CToastMessage } from '../../../../../model/IToastMessage';
import { v4 as uuidv4 } from 'uuid';
import IDateRedirect from '../../Model/IDateRedirect';
import { defineComponent } from 'vue';
import DialogUpserDateRedirectRow from './DialogUpserDateRedirectRow.vue';

type DateRedirectUI = IDateRedirect & {
  isNew?: boolean;
};

export default defineComponent({
  components: {
    DialogUpserDateRedirectRow,
  },
  setup() {
    return {
      storeActoinUpsertRow: 'dateRedirectState/upsert',
      storeActoinDeleteRow: 'dateRedirectState/delete',
    };
  },
  props: {
    shewhartCard: Array<IShewhartCardDTO>,
    dateRedirects: Array<IDateRedirect>,
    showUpserRow: Boolean,
    shewhartUID: String,
    addRow: Boolean,
    responsibles: Array<IUserBaseDTO>,
    tehMaxLimit: Number,
    tehMinLimit: Number,
  },
  emits: ['changeEvent', 'update:addRow'],
  data() {
    return {
      selectRowDelete: {
        index: null as number,
        entity: {} as DateRedirectUI,
      },
      showDialogDelete: false,
      showDialogUpserRow: this.showUpserRow,
      editTechLimit: false,
      rows: [] as DateRedirectUI[],
      editingRows: {} as DateRedirectUI,
      ngd: 0 as number,
      vgd: 0 as number,
    };
  },
  methods: {
    getRoundData(data: number, round = 3) {
      return data?.toFixed(round);
    },
    getNewObj(): DateRedirectUI {
      return {
        isNew: true,
        shewhardUID: this.shewhartUID,
        date: new Date(),
        tehMaxLimit: null,
        tehMinLimit: null,
        comment: '',
        uid: uuidv4(),
      };
    },
    //   //Действия над строками
    editRow(row: DateRedirectUI) {
      this.editingRows = { ...row };
      this.showDialogUpserRow = true;
    },

    canselEdit(row: DateRedirectUI, index: number) {
      if (row.isNew) {
        this.rows.splice(index, 1);
      }
      delete this.editingRows[row.uid];
    },
    /**Т.к. получаемые от сервера данные и данные в таблице различаются, необходимо подставить новые данные в старую модель, используемую в таблице */
    setNewData(response: IDateRedirectUpsertDTO) {
      if (
        this.rows.some((row) => {
          return row.uid == response.uid;
        })
      ) {
        this.rows
          .filter((row) => {
            return row.uid == response.uid;
          })
          .map((row) => {
            row.comment = response.comment;
            row.date = response.date;
          });
      }
    },

    okEditRow(row: DateRedirectUI) {
      if (row.date > new Date()) {
        this.$store.dispatch(
          'toastMessageState/error',
          new CToastMessage('Дата пересчета не может быть больше текущей даты'),
        );
        return;
      }
      this.$store.dispatch(this.storeActoinUpsertRow, row).then((srvObj) => {
        this.setNewData(srvObj);
        delete this.editingRows;
        row.isNew = false;
        this.showDialogUpserRow = false;
        this.$store.dispatch(
          'toastMessageState/success',
          new CToastMessage('Строка добавлена/Изменена'),
        );
        this.$emit('changeEvent');
      });
    },
    /**Добавление строки */
    addDateRedirect() {
      const newObj = this.getNewObj();
      this.editRow(newObj);
    },

    confirmDeleteSelected(data: DateRedirectUI, index) {
      this.selectRowDelete = {
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

    /**Удаление строки */
    deleteRow() {
      this.selectRowDelete.entity;
      this.$store
        .dispatch(this.storeActoinDeleteRow, this.selectRowDelete.entity)
        .then(() => {
          this.rows.splice(this.selectRowDelete.index, 1);
          this.$store.dispatch('toastMessageState/success', new CToastMessage('Строка удалена'));
          this.$emit('changeEvent');
        })
        .finally(() => {
          this.selectRowDelete = null;
        });
    },

    getDateRedirectForTable(shewhartCards) {
      this.rows = shewhartCards
        .map((redirect: IShewhartCardDTO) => {
          const dr = this.dateRedirects?.find((dr) => {
            return dr.uid == redirect.dateRedirectUID;
          });
          return {
            uid: redirect.dateRedirectUID,
            shewhardUID: this.shewhartUID,
            date: new Date(redirect.dateRedirect),
            comment: redirect.comment,
            cp: redirect.cp,
            cpk: redirect.cpk,
            M3Sigm: redirect?.xParam?.zoneValue[EZoneName.A].LCL || 0,
            AVG: redirect?.xParam?.AVG,
            P3Sigm: redirect?.xParam?.zoneValue[EZoneName.A].UCL || 0,
            tehMinLimit: dr?.tehMinLimit,
            tehMaxLimit: dr?.tehMaxLimit,
          } as IDateRedirect;
        })
        .slice(0, shewhartCards.length - 1);
    },
  },
  mounted() {
    this.getDateRedirectForTable(this.shewhartCard);
  },
  watch: {
    addRow(value) {
      if (value) {
        this.addDateRedirect();
        this.$emit('update:addRow', false);
      }
    },
    shewhartCard() {
      this.getDateRedirectForTable(this.shewhartCard);
    },
  },
});
</script>

<style scoped lang="less">
@import url(../../../../../style-ui-cit/table.less);
</style>
