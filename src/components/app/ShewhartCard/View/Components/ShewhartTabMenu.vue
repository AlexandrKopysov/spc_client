<template>
  <div class="grid grid-nogutter tab-menu">
    <div class="head">
      <div class="grid">
        <div class="col-12 body-action">
          <Label>Основные данные</Label>
          <div class="parameter">
            <div>
              <span>Cp:</span>
              {{ parameter.cp }}
            </div>
            <div>
              <span>Cpk:</span>
              {{ parameter.cpk }}
            </div>
          </div>
          <div class="parameter">
            <div>
              <span>-3Sigm:</span>
              {{ parameter.m3sigm }}
            </div>
            <div>
              <span>AVG:</span>
              {{ parameter.avg }}
            </div>
            <div>
              <span>+3Sigm</span>
              {{ parameter.p3sigm }}
            </div>
          </div>
          <div class="parameter">
            <div>
              <span>НГД:</span>
              {{ parameter.ngd }}
            </div>
            <div>
              <span>ВГД:</span>
              {{ parameter.vgd }}
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-2"><Label>Настройки графика</Label></div>
          <div v-if="checkResponsibles(shewhartDataProp.responsibleUsers)">
            <div class="grid action">
              <div class="col-6">
                <div v-if="openChooseProp">
                  <Button
                    label="Закончить выбор"
                    icon="pi pi-times"
                    class="button-warn"
                    @click="$emit('closeSpecialReasonEmit')"
                  />
                </div>
                <div v-else>
                  <Button
                    label="Добавить особую причину"
                    icon="pi pi-plus"
                    class="button-add w-12"
                    @click="$emit('openSpecialreasonEmit')"
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="icon-href">
                  <span class="spc-i-info" style="verticel-align: middle"></span>
                  <a href="#SpecialReasonTable">Посмотреть особые причины</a>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="col-12">
              <a href="#SpecialReasonTable" class="spc-i-info">Посмотреть особые причины</a>
            </div>
          </div>
        </div>
        <div class="col-12">
          <Label>Критерии</Label>
        </div>
        <div
          :class="classColumn"
          class="p-2"
          v-for="criterial in criterialsProp"
          :key="criterial.label"
        >
          <Button
            icon="pi"
            class="button-criterial"
            v-bind:class="{
              'button-warn': !criterial.disabled && criterial.isActive,
              'button-error': !criterial.disabled && !criterial.isActive,
              'button-add': criterial.disabled,
            }"
            :label="criterialLabel[criterial.label]"
            :disabled="criterial.disabled"
            @click="$emit('clickCriterial', criterial)"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
          <div class="mb-2"><Label>Границы пересчета</Label></div>
          <div v-if="checkResponsibles(shewhartDataProp.responsibleUsers)">
            <div class="grid action">
              <div class="col-6">
                <Button
                  label="Добавить границу пересчета"
                  icon="pi pi-plus"
                  class="button-add w-12"
                  @click="$emit('addDateRedirect')"
                />
              </div>
              <div class="col-6">
                <div class="icon-href">
                  <span class="spc-i-history"></span>
                  <a href="#DateRedirectTable">Границы пересчета</a>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="col-12">
              <div class="icon-href">
                <span class="spc-i-history"></span>
                <a href="#DateRedirectTable">Границы пересчета</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IResultShewhartDTO, EShewhartType, EZoneName, CRITERIAL_DESCRIPTION } from '@/api';
import { ICriterial } from '../../Model/HighchartFacade';
import { actualWifthScreen } from '../../../../../const-variable';

export default defineComponent({
  name: 'ShewhartTabMenu',
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickCriterial: (criterial: ICriterial) => true,
    openSpecialreasonEmit: () => true,
    closeSpecialReasonEmit: () => true,
    addDateRedirect: () => true,
  },
  props: {
    openChooseProp: Boolean,
    shewhartDataProp: null as PropType<IResultShewhartDTO<EShewhartType>>,
    criterialsProp: null as PropType<Array<ICriterial>>,
  },
  setup() {
    return {
      EZoneName: EZoneName,
      classColumn: actualWifthScreen() > 1280 ? 'col-4' : 'col-6',
    };
  },
  data() {
    return {
      parameter: {
        cp: null as string,
        cpk: null as string,
        m3sigm: null as string,
        avg: null as string,
        p3sigm: null as string,
        ngd: null as number,
        vgd: null as number,
      },
      shewhartData: null as IResultShewhartDTO<EShewhartType>,
      criterial: null as Array<ICriterial>,
      criterialLabel: CRITERIAL_DESCRIPTION,
    };
  },
  methods: {
    setParameter() {
      const lastShewhart =
        this.shewhartDataProp?.shewhartCards[this.shewhartDataProp?.shewhartCards.length - 1];
      debugger;
      this.parameter.cp = lastShewhart.cp?.toFixed(3);
      this.parameter.cpk = lastShewhart.cpk?.toFixed(3);
      this.parameter.m3sigm = lastShewhart.xParam.zoneValue[EZoneName.A].LCL?.toFixed(3);
      this.parameter.avg = lastShewhart.xParam.AVG?.toFixed(3);
      this.parameter.p3sigm = lastShewhart.xParam.zoneValue[EZoneName.A].UCL?.toFixed(3);
      this.parameter.ngd = lastShewhart.tehMinLimit;
      this.parameter.vgd = lastShewhart.tehMaxLimit;
    },
  },
  mounted() {
    this.setParameter();
  },
});
</script>

<style scoped lang="less">
.action {
  display: flex;
  align-items: center;
}
.action-href {
  display: flex;
}

label {
  font-weight: 900;
  font-size: 16px;
}

@media screen and (max-width: 1281px) {
  .body-action {
    font-size: 12px;
  }
}

.parameter {
  display: flex;
  margin-top: 8px;
  & > div {
    margin-right: 25px;
  }
}

.icon-href {
  display: flex;
  justify-content: left;
  align-items: center;
  height: 100%;
  span {
    margin-right: 5px;
  }
}

.tab-menu {
  font-size: 14px;
  width: 100%;
  height: 100%;
  & > .head {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  Button {
    font-size: 12px;
  }

  .button-criterial {
    width: 100%;
    height: 100%;
  }
}
</style>
