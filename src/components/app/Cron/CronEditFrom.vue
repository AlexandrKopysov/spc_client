<template>
  <div class="grid">
    <div class="col-6 controls">
      <div class="grid">
        <div class="col-12 field">
          <label>Имя</label>
          <InputText type="text" class="p-column-filter" v-model="cronEdit.name" />
        </div>
        <div class="col-12 field">
          <label>Маска</label>
          <InputText type="text" class="p-column-filter" v-model="cronEdit.mask" />
        </div>
        <div class="col-12 field">
          <label>Описание</label>
          <Textarea v-model="cronEdit.description" :autoResize="true" rows="5" cols="30" />
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="grid">
        <div class="col-12 multiselect field">
          <label>Карты Шухарта</label>
          <MultiSelect
            v-model="cronEdit.shewhartCardUids"
            :options="cards"
            :filter="true"
            optionLabel="name"
            optionValue="uid"
            placeholder="Карты Шухарта"
          >
            <template #option="slotProps">
              <div class="w-full" v-bind:class="{ 'card-removed': slotProps.option.isRemoved }">
                {{ slotProps.option.name }}
              </div>
            </template>
          </MultiSelect>
        </div>
        <div class="col-12">
          <DataTable :value="existCards" responsiveLayout="scroll">
            <Column field="name" header="Имя" :sortable="true">
              <template #body="slotProps">
                <span class="w-full" v-bind:class="{ 'row-removed': slotProps.data.isRemoved }">
                  {{ slotProps.data.name }}</span
                >
              </template>
            </Column>
            <Column field="isRemoved" header="Удалена" :sortable="true">
              <template #body="slotProps">
                <span class="w-full" v-bind:class="{ 'row-removed': slotProps.data.isRemoved }">{{
                  slotProps.data.isRemoved ? 'да' : 'нет'
                }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
    <div class="col-12 actions">
      <div class="grid">
        <div class="col-6">
          <SelectButton
            optionLabel="name"
            optionValue="value"
            v-model="cronEdit.disable"
            :options="options"
          />
        </div>
        <div class="col-6 text-right">
          <Button
            label="Cancel"
            icon="pi pi-times"
            @click="$emit('closeEdit')"
            class="p-button-text"
          />
          <Button label="Ok" icon="pi pi-check" @click="$emit('okEdit', cronEdit)" autofocus />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import deepCopy from '@/services/deepCopy.service';
import { defineComponent, PropType } from 'vue';
import { IUICronDTO } from '@/store/cron.store';
import SelectButton from 'primevue/selectbutton';
import { IEntityBase } from '@/api';

export default defineComponent({
  name: 'CronEditFrom',
  components: {
    SelectButton,
  },
  props: {
    cron: null as PropType<IUICronDTO>,
  },
  emits: {
    closeEdit: () => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    okEdit: (cron: IUICronDTO) => true,
  },
  data() {
    return {
      cronEdit: deepCopy(this.cron),
      options: [
        { name: 'Отключить', value: true },
        { name: 'Включить', value: false },
      ],
      existCards: [] as Array<IEntityBase>,
    };
  },
  computed: {
    cards() {
      return this.$store.state.shewhartCardState.dictList;
    },
  },
  watch: {
    cron(newValue: IUICronDTO) {
      this.cronEdit = deepCopy(newValue);
    },
    'cronEdit.shewhartCardUids'() {
      this.updateExistCards();
    },
  },
  created() {
    this.updateExistCards();
  },
  methods: {
    updateExistCards() {
      this.existCards = (this.cards || []).filter((c) =>
        this.cronEdit.shewhartCardUids.includes(c.uid),
      );
    },
  },
});
</script>
<style scoped lang="less">
.field > label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.field .p-inputtext {
  width: 100%;
}
.row-removed {
  opacity: 0.8;
}
.card-removed {
  opacity: 0.6;
}
.multiselect {
  .p-multiselect.p-component {
    width: 100%;
  }
}
.controls {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: rgba(32, 150, 243, 0.2);
  }
}
</style>
