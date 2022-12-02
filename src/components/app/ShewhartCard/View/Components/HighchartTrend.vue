<template>
  <div>Trend</div>
</template>

<script lang="ts">
import accessibility from 'highcharts/modules/accessibility';
import histogramBellcurve from 'highcharts/modules/histogram-bellcurve';
import { DebounceTimer } from '@/services/Timer.helper';
import { defineComponent } from 'vue';
import jStat from 'jStat';
import HighCharts, {
  Options,
  SeriesLineOptions,
  SeriesScatterOptions,
  XAxisOptions,
} from 'highcharts';
import { IShewhartCardDTO } from '@/api';

histogramBellcurve(HighCharts);
accessibility(HighCharts);

/**
 * пример для тренда: https://www.highcharts.com/blog/tutorials/calculating-and-drawing-a-linear-regression-using-highcharts/
 */

/*
серия для точек
 */
const scatterSeria: SeriesScatterOptions = {
  name: 'Точки',
  type: 'scatter',
  id: 's1',
  marker: {
    radius: 2,
  },
};

/**
 * Серия для тренда
 */
const lineSeria: SeriesLineOptions = {
  type: 'line',
  name: 'Тренд',
  data: [],
  color: '#333333',
  marker: {
    enabled: false,
  },
  enableMouseTracking: false,
  lineWidth: 2,
};

// const hisogramSeriaID = 'hisogramSeriaID';
const xAxisFromPoint: XAxisOptions = {
  title: { text: 'Данные' },
  alignTicks: false,
  plotLines: [],
};

const xAxisFromHistogramm: XAxisOptions = {
  alignTicks: false,
  opposite: true,
  plotLines: [],
};

/**
 * опции графика
 */
const option: Options = {
  title: {
    text: '',
  },
  xAxis: [xAxisFromPoint, xAxisFromHistogramm],
  yAxis: [
    {
      title: { text: '' },
    },
  ],
  plotOptions: {},
  series: [scatterSeria, lineSeria],
};

export default defineComponent({
  name: 'HighchartTrend',
  setup() {
    return {
      debounce: new DebounceTimer(),
      chart: null as HighCharts.Chart,
    };
  },
  data() {
    return {};
  },
  methods: {
    redraw() {
      this.chart?.destroy();
      scatterSeria.data = this.shewhartCard?.groupPoints.map((p) => p.x.value);
      lineSeria.data = this.getPlotLine();
      this.chart = HighCharts.chart(this.$el, option);
    },
    view() {
      this.redraw();
    },
    getPlotLine() {
      const arrY = this.shewhartCard?.groupPoints.map((p) => p.x.value);
      const arrX = Array.from(arrY.keys());
      const r = jStat.corrcoeff(arrX, arrY);
      const sy = jStat.stdev(arrY);
      const sx = jStat.stdev(arrX);
      const meanY = jStat(arrY).mean();
      const meanX = jStat(arrX).mean();
      const b = r * (sy / sx);
      const a = meanY - meanX * b;
      const x1: number = jStat.min(arrX);
      const x2: number = jStat.max(arrX);
      const y1: number = a + b * x1;
      const y2: number = a + b * x2;
      return [
        [x1, y1],
        [x2, y2],
      ];
    },
  },
  props: {
    shewhartCard: Object as () => IShewhartCardDTO,
  },
  mounted() {
    this.view();
  },
  watch: {
    shewhartCard() {
      this.debounce.exec(() => {
        this.redraw();
      }, 200);
    },
  },
});
</script>

<style scoped lang="less"></style>
