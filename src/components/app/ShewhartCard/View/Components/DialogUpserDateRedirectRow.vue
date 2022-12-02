<template>
  <Dialog
    :visible="showDialogUpserRowProp"
    class="p-fluid spc"
    :style="{ width: '450px' }"
    :modal="true"
    :closable="false"
  >
    <div class="grid">
      <div class="col-12">
        <label>Причина перерасчета</label>
        <div>
          <Textarea v-model="editingRows.comment" rows="3" cols="54" />
        </div>
      </div>
      <div class="col-12">
        <label>Дата перерасчета</label>
        <div>
          <Calendar
            id="time24"
            v-model="editingRows.date"
            :showTime="true"
            :showSeconds="false"
          ></Calendar>
        </div>
      </div>
      <div class="col-6">
        <InputNumber
          mode="decimal"
          placeholder="НГД"
          v-model="editingRows.tehMinLimit"
          :minFractionDigits="0"
          :maxFractionDigits="10"
        />
      </div>
      <div class="col-6">
        <InputNumber
          mode="decimal"
          placeholder="ВГД"
          v-model="editingRows.tehMaxLimit"
          :minFractionDigits="0"
          :maxFractionDigits="10"
        />
      </div>

      <div class="col-6">
        <Button label="Сохранить" class="button-add" @click="okEditRow(editingRows)" />
      </div>
      <div class="col-6">
        <Button label="Отмена" class="button-error mb-2" @click="offEdit(editingRows)" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import IDateRedirect from '../../Model/IDateRedirect';

type DateRedirectUI = IDateRedirect & {
  isNew?: boolean;
};

export default defineComponent({
  name: 'DialogUpserDateRedirectRow',
  emits: ['okEdit', 'offEdit'],
  props: {
    editingRowsProp: {} as PropType<DateRedirectUI>,
    showDialogUpserRowProp: Boolean,
  },
  data() {
    return {
      editingRows: {} as DateRedirectUI,
      showDialog: {} as boolean,
    };
  },
  methods: {
    okEditRow(row: DateRedirectUI) {
      this.$emit('okEdit', row);
    },
    offEdit(row: DateRedirectUI) {
      this.$emit('offEdit', row);
    },
  },
  mounted() {
    this.showDialog = this.showDialogUpserRowProp;
    this.editingRows = this.editingRowsProp;
  },
  watch: {
    editingRowsProp(newValue) {
      this.editingRows = newValue;
    },
  },
});
</script>

<style scoped lang="less"></style>
