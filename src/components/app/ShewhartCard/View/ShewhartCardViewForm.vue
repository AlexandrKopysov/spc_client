<template>
  <div class="grid spc m-0" v-if="shewhartData">
    <div
      class="col-12"
      v-bind:class="{
        'shewhart-sidebar-close': !showAtributDialog,
        'shewhart-sidebar-open': showAtributDialog,
      }"
    >
      <div class="side-left">
        <ShewhartHighchart
          :shewhartResult="shewhartData"
          ref="highchartCompRef"
          @clickXRPoint="clickXRPoint($event)"
        ></ShewhartHighchart>
      </div>
      <div class="side-right">
        <div class="button" @click="changeWindowOption()">
          <i
            class="pi pi-chevron-down"
            v-bind:class="{
              'pi-chevron-up': !showAtributDialog,
              'pi-chevron-down': showAtributDialog,
            }"
          />
          <div class="ml-2">Настройки</div>
        </div>
        <div class="content">
          <ShewhartTabMenu
            v-if="shewhartData"
            :shewhartDataProp="shewhartData"
            :criterials-prop="criterials"
            :openChooseProp="openChoose"
            @click-criterial="selectCriterial($event)"
            @open-specialreason-emit="showDialogAddSpecialReasonTable = true"
            @close-special-reason-emit="
              showDialogAddSpecialReasonTable = true;
              openChoose = false;
            "
            @add-date-redirect="addDateRedirect = true"
          ></ShewhartTabMenu>
        </div>
      </div>
    </div>
    <div class="col-12 other" id="SpecialReasonTable">
      <SpecialReasonTable
        v-model:show="showDialogAddSpecialReasonTable"
        v-model:choose="openChoose"
        :specialReasons="shewhartData.specialReasons"
        :shewhartUID="($route.params.cardUid as string)"
        :criterials="shewhartData.criterials"
        :responsibles="shewhartData.responsibleUsers"
      ></SpecialReasonTable>
    </div>
    <div class="col-12 other" id="DateRedirectTable">
      <DateRedirectTable
        v-model:addRow="addDateRedirect"
        ref="DateRedirectTableRef"
        :shewhartCard="shewhartData.shewhartCards"
        :dateRedirects="shewhartData.dateRedirects"
        :shewhartUID="($route.params.cardUid as string)"
        :responsibles="shewhartData.responsibleUsers"
        :tehMaxLimit="shewhartData.tehMaxLimit"
        :tehMinLimit="shewhartData.tehMinLimit"
        @change-event="$emit('pageReload')"
      ></DateRedirectTable>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IResultShewhartDTO,
  IQueryPointDTO,
  EZoneName,
  EShewhartCriterialType,
  EShewhartType,
  CRITERIAL_DESCRIPTION,
} from '@/api';
import deepCopy from '@/services/deepCopy.service';
import {
  ICriterial,
  IHighchartSeriaPoint,
  POINT_COLOR_DEFAULT,
  POINT_COLOR_SELECTED,
} from '../Model/HighchartFacade';
import DateRedirectTable from './Components/ShewhardCardDateRedirectTable.vue';
import SpecialReasonTable from './Components/ShewhardCardSpecialreasonTable.vue';
import ShewhartHighchart, { IShewhartHighchartApi } from './Components/ShewhartHighchart.vue';
import { defineComponent, PropType } from 'vue';
import ShewhartTabMenu from './Components/ShewhartTabMenu.vue';

/**Класс зон для горизонтальных линий внутри серии */

interface IDateRedirect {
  dateRedirectUID: string;
  dateRedirect: Date;
  comment: string;
  cp: number;
  cpk: number;
  P3Sigm: number;
  M3Sigm: number;
  AVG: number;
}

export default defineComponent({
  name: 'ShewhartCardViewForm',
  components: {
    DateRedirectTable,
    SpecialReasonTable,
    ShewhartHighchart,
    ShewhartTabMenu,
  },
  emits: ['pageReload'],
  setup() {
    return {
      shewhartAPI: 'shewhartCardState',
      EZoneName: EZoneName,
    };
  },
  props: {
    // shewhartDataProp: null as PropType<IResultShewhartDTO<EShewhartType>>,
  },
  data() {
    return {
      /*Открытие бокового меню*/
      showAtributDialog: true,

      shewhartData: null as IResultShewhartDTO<EShewhartType>,
      rHistoOptions: null,

      // Даты пересчета
      datesRedirect: [] as IDateRedirect[],
      editingВatesRedirect: {} as Record<string, IDateRedirect>,

      // Стили
      isActiveCriterial: false,

      spcReason: false,
      criterials: {} as Array<ICriterial>,
      criterialLabel: CRITERIAL_DESCRIPTION,
      selectedCriterials: [] as ICriterial[],
      selectedPoints: [] as IQueryPointDTO[],
      choosePermissionPoints: false,
      showDialogAddSpecialReasonTable: false,
      addDateRedirect: false,
      openChoose: false,
    };
  },
  computed: {
    highchartCompRef(): IShewhartHighchartApi {
      return this.$refs['highchartCompRef'];
    },
  },

  methods: {
    changeWindowOption() {
      this.showAtributDialog = !this.showAtributDialog;
      this.highchartCompRef.oneResize();
    },

    setTitle() {
      document.title = [this.$route.meta?.title, this.shewhartData.nameCalc]
        .filter(Boolean)
        .join(': ');
    },

    /**При выборе критерия прроверяем вхождение в массив критериев, если нет, то добавляем и наоборот  */
    selectCriterial(inputCriterial: ICriterial) {
      this.highchartCompRef.clearColor();
      if (!inputCriterial.isActive) {
        this.highchartCompRef.clickCriterial(inputCriterial);
        this.criterials.forEach((c) => (c.isActive = false));
        inputCriterial.isActive = true;
      } else {
        this.criterials.forEach((c) => (c.isActive = false));
      }
    },
    //**Событие при клике на точку */
    clickXRPoint(point: IHighchartSeriaPoint) {
      if (!this.openChoose) {
        return;
      }

      let sotreSelectedPoints = this.getSelectedPoints();
      let intersection = point.existPoints.filter((exPoint) =>
        sotreSelectedPoints.some((point) => {
          return point.uniqId === exPoint.uniqId;
        }),
      );
      let difference = point.existPoints.filter(
        (exPoint) =>
          !sotreSelectedPoints.some((point) => {
            return point.uniqId === exPoint.uniqId;
          }),
      );
      this.removeStorePoints(intersection);
      this.addStorePoints(difference);

      point.color = POINT_COLOR_DEFAULT;

      if (difference.length) {
        point.color = POINT_COLOR_SELECTED;
      }
      this.highchartCompRef.redraw;
    },

    getCriterials(response: IResultShewhartDTO<EShewhartType>) {
      this.criterials = Object.keys(response.criterials).map((criterial) => {
        return {
          label: criterial as EShewhartCriterialType,
          isActive: false,
          disabled: !response.criterials[criterial],
        };
      });
      this.spcReason = this.criterials?.some((crit) => {
        return !crit.disabled;
      });
    },
    loadShewhartView(uid) {
      this.$store
        .dispatch(`${this.shewhartAPI}/getView`, uid)
        .then((response: IResultShewhartDTO<EShewhartType>) => {
          this.shewhartData = response;
          this.getCriterials(response);
        });
    },
    changeModel() {
      if (this.$route.params.cardUid) {
        this.loadShewhartView(this.$route.params.cardUid);
      }
    },
    pageReload() {
      this.loadShewhartView(this.$route.params.cardUid);
    },

    /**Добавить выделеную point в store */
    addStorePoints(groupPoint: Array<IQueryPointDTO>) {
      this.$store.dispatch('selectedPointsState/groupPointAdd', groupPoint);
    },
    /**Убрать point из store */
    removeStorePoints(groupPoint: Array<IQueryPointDTO>) {
      this.$store.dispatch('selectedPointsState/groupPointRemove', groupPoint);
    },
    /**Вернуть все выбранные точки */
    getSelectedPoints(): Array<IQueryPointDTO> {
      return this.$store.getters['selectedPointsState/getSelectedPoints'];
    },
    /**Вернуть разрешение на выбор точек */
    getChoosePermission(): boolean {
      return this.$store.getters['selectedPointsState/getChoosePermission'];
    },
  },
  watch: {
    shewhartDataProp(newValue: IResultShewhartDTO<EShewhartType>) {
      this.shewhartData = deepCopy(newValue);
      this.getCriterials(newValue);
      this.setTitle();
    },
  },

  mounted() {
    this.changeModel();
  },

  created() {
    this.selectedPoints = this.getSelectedPoints();
  },
});
</script>

<style scoped lang="less">
@import url(./shewhard-card-style.less);
@import url(../../../../style-ui-cit/table.less);
</style>
