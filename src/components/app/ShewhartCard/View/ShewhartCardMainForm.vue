<template>
  <div class="spc flex flex-column">
    <div class="grid spc-card-view">
      <div class="col-10 card-header">
        <div class="card-label">{{ shewhartName }}</div>
      </div>
      <div class="col-2 card-header">
        <div class="card-parameters">
          <div class="parameter" v-if="spcReason">
            <span class="spc-i-process-nonstable parameter-icon"></span>
            <span class="nonstable">Особые причины</span>
          </div>
          <div class="parameter" v-else>
            <span class="spc-i-process-stable parameter-icon"></span>
            <span class="stable">Особые причины</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-menu">
      <TabMenu :model="menuArray" />
    </div>
    <div class="flex-grow-1 content-table">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { EShewhartCriterialType, EShewhartType, EZoneName, IResultShewhartDTO } from '@/api';
import { defineComponent } from 'vue';
import { ICriterial } from '../Model/HighchartFacade';
import IMenuItem from '@/components/Shared/Models/IMenuItem';

export default defineComponent({
  name: 'ShewhartCardMainForm',
  setup() {
    return {
      shewhartAPI: 'shewhartCardState',
      EZoneName: EZoneName,
    };
  },
  data() {
    return {
      spcReason: false,
      shewhartData: null as IResultShewhartDTO<EShewhartType>,
      shewhartName: '',
      criterials: {} as Array<ICriterial>,
      menuArray: [
        { label: 'График', to: '/viewShewhartCard/graphics/' + this.$route.params.cardUid },
        { label: 'Гистограммы', to: '/viewShewhartCard/histogram/' + this.$route.params.cardUid },
      ] as IMenuItem[],
    };
  },
  methods: {
    getCriterials(newCard: IResultShewhartDTO<EShewhartType>) {
      this.criterials = Object.keys(newCard.criterials).map((criterial) => {
        return {
          label: criterial as EShewhartCriterialType,
          isActive: false,
          disabled: !newCard.criterials[criterial],
        };
      });
      this.spcReason = this.criterials?.some((crit) => {
        return !crit.disabled;
      });
    },
    loadShewhartView(newCard: IResultShewhartDTO<EShewhartType>) {
      this.shewhartName = newCard.nameCalc;
      this.getCriterials(newCard);
    },
  },
  watch: {
    '$store.state.shewhartCardState.shewhartCard'(newCard: IResultShewhartDTO<EShewhartType>) {
      this.loadShewhartView(newCard);
    },
  },
});
</script>

<style scoped lang="less">
@import url(./shewhard-card-style.less);
@import url(../../../../style-ui-cit/table.less);
</style>
