<template>
  <div class="h-full"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { EShewhartType, IResultShewhartDTO } from '@/api';
import { ICriterial, HighchartFacade, IHighchartSeriaPoint } from '../../Model/HighchartFacade';
// import debounce from '@/services/debounceTimer.service';
import { actualHeightScreen } from '@/const-variable';
import { DebounceTimer } from '@/services/Timer.helper';

export interface IShewhartHighchartApi {
  clickCriterial?(criterial: ICriterial): void;
  clearColor?(): void;
  redraw?(): void;
  oneResize?(): void;
}

export default defineComponent({
  name: 'ShewhartHighchart',
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickXRPoint: (point: IHighchartSeriaPoint) => true,
  },
  setup() {
    return {
      highchartFacade: null as HighchartFacade,
      debounce: new DebounceTimer(),
    };
  },
  data() {
    return {
      chart: null,
      windowHeigh: window.outerHeight,
    };
  },
  props: {
    shewhartResult: Object as PropType<IResultShewhartDTO<EShewhartType>>,
  },
  methods: {
    clickCriterial(criterial: ICriterial) {
      this.highchartFacade?.setColor(criterial);
    },
    clearColor() {
      this.highchartFacade?.clearColor();
    },
    initGraph() {
      this.highchartFacade?.destroy();
      this.highchartFacade = new HighchartFacade(this.shewhartResult, this.$el, {
        clickXRPoint: (point) => {
          this.$emit('clickXRPoint', point);
        },
      });
    },
    resizeHighchartContainer() {
      const shewhartCardHighchartsHeight = actualHeightScreen();
      const chartsContainer = this.getHTMLElement<HTMLElement>('highcharts-container');
      if (chartsContainer) {
        chartsContainer.style.height = `${shewhartCardHighchartsHeight}px`;
      }
      const svgViewBox = this.getHTMLElement<SVGMarkerElement>('highcharts-root');
      if (svgViewBox) {
        svgViewBox.style.height = `${shewhartCardHighchartsHeight}px`;
        svgViewBox.viewBox.baseVal.height = shewhartCardHighchartsHeight;
      }
    },
    oneResize() {
      this.debounce.exec(() => {
        this.resizeHighchartContainer();
        this.highchartFacade.redraw();
      }, 200);
    },

    getHTMLElement<T extends Element>(className: string): T {
      try {
        let elements = document.getElementsByClassName(className);
        if (elements.length) {
          return elements[0] as T;
        } else {
          throw 'HTMLElements - Элементы не найдены (getHTMLElementByClassName)';
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.initGraph();
    window.addEventListener('resize', this.oneResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.oneResize);
  },

  watch: {
    shewhartResult() {
      this.initGraph();
    },
  },
});
</script>
<style scoped lang="less"></style>
