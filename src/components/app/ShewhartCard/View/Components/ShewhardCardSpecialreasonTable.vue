<template>
  <div class="grid h-full grid-nogutter">
    <div class="col-12 p-0">
      <div class="spc-table-header p-0 pb-2">
        <label class="page-sublabel">Особые причины</label>
      </div>
      <DataTable
        class="p-datatable-sm spc-table-body"
        responsiveLayout="scroll"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :value="rows"
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        :paginator="true"
        :scrollable="true"
      >
        <Column field="comment" header="Описание">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="events" header="Мероприятия">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="exclude" header="Действие над точками">
          <template #body="{ data, field }">
            {{ data[field] ? 'Исключены из расчета' : 'Включены в расчет' }}
          </template>
        </Column>
        <Column field="points" header="Точки">
          <template #body="{ data, field }">
            {{ data[field].length }}
          </template>
        </Column>
        <Column field="createDate" header="Дата создания">
          <template #body="{ data, field }">
            {{ new Date(data[field]).toLocaleString() }}
          </template>
        </Column>
        <Column field="creator" header="Создатель">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="updateDate" header="Дата изменения">
          <template #body="{ data, field }">
            {{ new Date(data[field]).toLocaleString() }}
          </template>
        </Column>
        <Column field="editor" header="Редактор">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column
          style="width: auto; min-width: 5rem"
          class="actions"
          v-if="checkResponsibles(responsibles)"
        >
          <template #body="{ data, index }">
            <div v-if="!upsertRow[data.uid]">
              <Button
                icon="spc spc-i-pencil"
                class="p-button-rounded p-button-text pencil-hover"
                @click="editRow(data, index)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text"
                @click="confirmDeleteSelected(data)"
              />
            </div>
          </template>
          ></Column
        >
      </DataTable>
    </div>
    <div class="col-12">
      <Dialog
        class="p-fluid spc"
        header="Особая причина"
        v-model:visible="showDiallogUpsertRow"
        :style="{ width: '950px' }"
        :modal="true"
        :closable="false"
      >
        <div class="grid dialog-special-reason">
          <div class="col-5">
            <div class="grid grid-nogutter">
              <div class="field col-12">
                <label>Описание</label>
                <div>
                  <Textarea v-model="upsertRow.comment" rows="3" cols="54" />
                </div>
              </div>
              <div class="field col-12">
                <label>Мероприятия</label>
                <div>
                  <Textarea v-model="upsertRow.events" rows="3" cols="54" />
                </div>
              </div>
              <div class="field col-12">
                <label>Критерий</label>
                <Dropdown
                  v-model="selectCriterial"
                  :options="allCriterials"
                  optionLabel="label"
                  placeholder="Выберите критерий"
                  @change="selectedCriterial(selectCriterial)"
                >
                  <template #option="data">
                    {{ data.option.label }}
                  </template>
                </Dropdown>
              </div>
              <div class="field col-12">
                <label>Действия над точками</label>
                <Dropdown
                  v-model="selectedExludeOptions"
                  optionLabel="label"
                  placeholder="Выберите действие"
                  :options="exludeOptions"
                  @change="selectExlude(selectedExludeOptions)"
                >
                  <template #option="data">
                    {{ data.option.label }}
                  </template>
                </Dropdown>
              </div>
              <div class="field col-12">
                <label>Группа особых причин</label>
                <Dropdown
                  v-model="selectSpecialReasonGroup"
                  optionLabel="name"
                  placeholder="Выберите группу"
                  :options="allSpecialReasonGroup"
                  @change="selectedSpecialReasonGroup(selectSpecialReasonGroup)"
                >
                  <template #option="data">
                    {{ data.option.name }}
                  </template>
                </Dropdown>
              </div>
              <div class="field col-12">
                <label>Тип особых причин</label>
                <Dropdown
                  v-model="selectSpecialReasonType"
                  optionLabel="name"
                  placeholder="Выберите тип"
                  :disabled="!selectSpecialReasonGroup.uid"
                  :options="specialReasonTypeInSelect"
                  @change="upsertRow.specialReasonUid = selectSpecialReasonType.uid"
                >
                  <template #option="data">
                    {{ data.option.name }}
                  </template>
                </Dropdown>
              </div>
              <div class="col-12">
                <Button label="Выбрать точки" class="button-add mb-2" @click="onSelectPoints()" />
              </div>
              <div class="col-12">
                <div class="grid">
                  <div class="col-6">
                    <Button
                      label="Сохранить"
                      class="button-add"
                      :disabled="
                        !selectSpecialReasonType?.uid || upsertRow.comment == '' || !selectCriterial
                      "
                      @click="okEditRow()"
                    />
                  </div>
                  <div class="col-6">
                    <Button
                      label="Отмена"
                      class="button-error mb-2"
                      @click="closeDialogUpsertRow()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-7">
            <SRPointsVue class="selected-points-list"></SRPointsVue>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IShewhartSpecialReasonDTO,
  ISpecialReasonDTO,
  ISpecialReasonGroupDTO,
  IQueryPointDTO,
  IUserBaseDTO,
  EShewhartCriterialType,
  CRITERIAL_DESCRIPTION,
} from '@/api';
import { v4 as uuidv4 } from 'uuid';
import deepCopy from '../../../../../services/deepCopy.service';
import { defineComponent, PropType } from 'vue';
import IRequestMessage from '../../../../../model/IToastMessage';
import SRPointsVue from './SRPoints.vue';
import {
  storeActoinUpsertRow,
  storeActoinDeleteRow,
  exludeOptions,
  storeSelectedPoints,
  storeSpecialReasonType,
  storeSpecialReasonGroup,
  ISpecialReason,
  IExludeOption,
  CSpecialReasonUpsert,
  storeToastMessage,
} from '../Models/ShewhardCardSpecialreasonModels';

export default defineComponent({
  name: 'ShewhardCardSpecialreasonTable',
  setup(props) {
    const propCriterials = Object.keys(props.criterials);
    const allCriterials: Array<{ value: EShewhartCriterialType; label: string }> = Object.keys(
      CRITERIAL_DESCRIPTION,
    )
      .filter((crit) => {
        return propCriterials.includes(crit);
      })
      .map((key) => ({
        value: key as EShewhartCriterialType,
        label: CRITERIAL_DESCRIPTION[key],
      }));

    return {
      allCriterials,
      storeActoinUpsertRow,
      storeActoinDeleteRow,
      exludeOptions,
      storeSelectedPoints,
      storeSpecialReasonType,
      storeSpecialReasonGroup,
    };
  },
  data() {
    return {
      selectCriterial: {} as { value: EShewhartCriterialType; label: string },
      showDialogDeleteRow: false,
      openChoose: this.choose,
      showDiallogUpsertRow: this.show,
      rows: [] as ISpecialReason[],
      upsertRow: {} as ISpecialReason,
      selectedExludeOptions: {} as IExludeOption,
      specialReasonGroupInSelect: [] as ISpecialReasonGroupDTO[],
      allSpecialReasonGroup: [] as ISpecialReasonGroupDTO[],
      selectSpecialReasonGroup: {} as ISpecialReasonGroupDTO,
      specialReasonTypeInSelect: [] as ISpecialReasonDTO[],
      allSpecialReasonType: [] as ISpecialReasonDTO[],
      selectSpecialReasonType: {} as ISpecialReasonDTO,
      oldSelectedPoints: [] as Array<IQueryPointDTO>,
    };
  },
  components: {
    SRPointsVue: SRPointsVue,
  },
  props: {
    specialReasons: Array as PropType<Array<IShewhartSpecialReasonDTO>>,
    shewhartUID: String,
    criterials: Object as PropType<Partial<Record<EShewhartCriterialType, boolean>>>,
    show: Boolean,
    choose: Boolean,
    responsibles: Array<IUserBaseDTO>,
  },
  emits: ['update:show', 'update:choose'],
  methods: {
    getNewObj(): ISpecialReason {
      return {
        isNew: true,
        shewhartCriterialType: null,
        points: [],
        specialReasonUid: '',
        comment: '',
        uid: uuidv4(),
        exclude: false,
      };
    },
    editRow(editRow: ISpecialReason, index?: number) {
      this.upsertRow = deepCopy(editRow);
      this.upsertRow.idnex = index;
      this.selectedExludeOptions = this.exludeOptions.find((exclude) => {
        return exclude.value == editRow.exclude;
      });
      this.selectCriterial = this.allCriterials.find((crit) => {
        return crit.value == editRow.shewhartCriterialType;
      });
      // Все группа в селекте
      this.specialReasonGroupInSelect = this.allSpecialReasonGroup;
      // Выбранная группа в селекте
      this.selectSpecialReasonGroup = this.allSpecialReasonGroup.find((reasonGroup) => {
        return reasonGroup.uid == editRow.specialReasonGroupUid;
      });
      // Все типы в селекте
      this.specialReasonTypeInSelect = this.allSpecialReasonType.filter((srType) => {
        return this.selectSpecialReasonGroup.specialReasonUids.includes(srType.uid);
      });
      // Выбранный тип в селекте
      this.selectSpecialReasonType = this.specialReasonTypeInSelect.find((srTypeInSel) => {
        return srTypeInSel.uid == editRow.specialReasonUid;
      });
      Object.assign(this.oldSelectedPoints, editRow.points);
      this.setStoreGroupPoints(this.oldSelectedPoints);
      this.showDiallogUpsertRow = true;
    },

    /**Добавление строки */
    addSpecialReason() {
      const newObj = this.getNewObj();
      this.upsertRow = { ...newObj };
    },

    selectExlude(selectData: IExludeOption) {
      this.upsertRow.exclude = selectData.value;
    },

    selectedCriterial(selectData) {
      this.upsertRow.shewhartCriterialType = selectData.value;
    },
    selectedSpecialReasonGroup(selectData: ISpecialReasonGroupDTO) {
      this.selectSpecialReasonType = null;
      this.specialReasonTypeInSelect = this.allSpecialReasonType.filter((srType) => {
        return srType.specialReasonGroupUId == selectData.uid;
      });
    },
    selectedSpecialReasonType(selectData: ISpecialReasonDTO) {
      this.upsertRow.specialReasonUid = selectData.uid;
    },

    /**
     * Преобразуем редактируемую/добавляемую/удаляемую строку в обьект с UID карты шухарта
     */
    mapEditingRowForUpsertData(editData: ISpecialReason) {
      return new CSpecialReasonUpsert(
        this.shewhartUID,
        editData,
        this.getStoreSelectedPointsByUpsert(),
      );
    },

    okEditRow() {
      this.$store
        .dispatch(this.storeActoinUpsertRow, this.mapEditingRowForUpsertData(this.upsertRow))
        .then((response) => {
          const message: IRequestMessage = { detail: '' };
          if (this.upsertRow.isNew) {
            this.rows.push(response.data);
            message.detail = 'Строка добавлена';
          } else {
            this.upsertRow.points = this.getSelectedPoints();
            this.rows[this.upsertRow.idnex] = this.upsertRow;
            message.detail = 'Строка изменена';
          }
          this.$store.dispatch('toastMessageState/success', message);
        })
        .finally(() => {
          this.closeDialogUpsertRow();
        });
    },

    cancelationExtention() {
      this.selectSpecialReasonGroup = {};
      this.selectSpecialReasonType = {};
      this.selectCriterial = null;
      this.selectedExludeOptions = null;
      this.upsertRow = {};
    },

    confirmDeleteSelected(editData: ISpecialReason) {
      this.upsertRow = editData;
      this.$confirm.require({
        message: 'Вы точно хотите удалить строку?',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: () => {
          this.deleteRow();
        },
      });
    },

    closeUpsertDialog() {
      this.showDiallogUpsertRow = false;
      this.$emit('update:show', this.showDiallogUpsertRow);
    },

    closeDialogUpsertRow() {
      this.cancelationExtention();
      this.closeUpsertDialog();
      this.$store.dispatch(this.storeSelectedPoints.actions.clear);
      this.oldSelectedPoints = [];
    },

    /**Удаление строки */
    deleteRow() {
      this.$store
        .dispatch(this.storeActoinDeleteRow, this.mapEditingRowForUpsertData(this.upsertRow))
        .then(() => {
          const message: IRequestMessage = { detail: 'Строка удалена' };
          this.rows = this.rows.filter((row) => {
            return row.uid != this.upsertRow.uid;
          });
          this.$store.dispatch(storeToastMessage.actions.success, message);
        })
        .finally(() => {
          this.upsertRow = {};
        });
    },

    setStoreGroupPoints(points: Array<IQueryPointDTO>) {
      this.$store.dispatch(this.storeSelectedPoints.actions.setPoints, points);
    },

    getSelectedPoints(): Array<IQueryPointDTO> {
      return this.$store.getters[this.storeSelectedPoints.getters.getSelectedPoints];
    },

    getSpecialReasonTable(specialReasons: Array<IShewhartSpecialReasonDTO>) {
      this.rows = specialReasons;
    },

    getStoreSelectedPointsByUpsert(): Array<IQueryPointDTO> {
      return this.$store.getters[this.storeSelectedPoints.getters.getSelectedPointsByUpsert];
    },

    loadSpecialReasonType() {
      this.$store.dispatch(this.storeSpecialReasonType.actions.get).then((response) => {
        this.allSpecialReasonType = response;
      });
    },

    loadSpecialReasonGroup() {
      this.$store.dispatch(this.storeSpecialReasonGroup.actions.get).then((response) => {
        this.allSpecialReasonGroup = response;
      });
    },

    onSelectPoints() {
      this.closeUpsertDialog();
      this.$emit('update:choose', true);
    },
  },
  mounted() {
    this.loadSpecialReasonGroup();
    this.loadSpecialReasonType();
    this.rows = this.specialReasons;
  },
  watch: {
    show(value) {
      this.showDiallogUpsertRow = value;
    },
  },
});
</script>

<style scoped lang="less">
@import url(../../../../../style-ui-cit/table.less);
@import url(../shewhard-card-style.less);
</style>
