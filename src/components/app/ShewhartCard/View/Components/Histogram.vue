<template>
  <div class="x-bar"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HighCharts, {
  Options,
  Series,
  SeriesHistogramOptions,
  SeriesLineOptions,
  SeriesScatterOptions,
  XAxisOptions,
} from 'highcharts';
import accessibility from 'highcharts/modules/accessibility';
import histogramBellcurve from 'highcharts/modules/histogram-bellcurve';
import { DebounceTimer } from '@/services/Timer.helper';
import jStat from 'jStat';
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
  visible: false,
  marker: {
    radius: 1,
  },
};

const hisogramSeriaID = 'hisogramSeriaID';
/**
 * серия для гистограммы
 */
const histoSeria: SeriesHistogramOptions = {
  name: 'Гистограмма',
  type: 'histogram',
  xAxis: 1,
  yAxis: 1,
  baseSeries: 's1',
  color: '#376FFF',
  zIndex: -1,
  tooltip: {
    pointFormat:
      '<span style="font-size: 10px">{point.x} - {point.x2}</span><br/><span style="color:{point.color}">●</span> Точек: <b>{point.y}</b><br/>',
  },
  id: hisogramSeriaID,
};

const xAxisFromPoint: XAxisOptions = {
  title: { text: 'Данные' },
  alignTicks: false,
  plotLines: [],
};

const xAxisFromHistogramm: XAxisOptions = {
  title: { text: '' },
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
  xAxis: [xAxisFromHistogramm, xAxisFromPoint],
  yAxis: [
    {
      title: { text: 'Данные' },
    },
    {
      title: { text: 'Гистограмма' },
      opposite: true,
    },
  ],
  plotOptions: {},
  series: [scatterSeria, histoSeria],
};

const getVericalLine = ({ value, name, maxCountPoint }): SeriesLineOptions => ({
  type: 'line',
  name,
  data: [
    [value, 0],
    [value, maxCountPoint * 1.1],
  ],
  color: '#000000',
  marker: {
    enabled: false,
  },
  lineWidth: 2,
  dashStyle: 'Dash',
  xAxis: 1,
  yAxis: 1,
});

export default defineComponent({
  name: 'Histo',
  setup() {
    return {
      debounce: new DebounceTimer(),
      chart: null as HighCharts.Chart,
    };
  },
  data() {
    return {};
  },
  props: {
    shewhartCard: Object as () => IShewhartCardDTO,
    minLimit: Number,
    maxLimit: Number,
  },
  methods: {
    redraw() {
      this.chart?.destroy();
      scatterSeria.data = this.shewhartCard?.groupPoints.map((p) => p.x.value);
      this.chart = HighCharts.chart(this.$el, option);
      const histoValues = this.chart.get(hisogramSeriaID) as Series;
      const maxCountPoint = jStat.max(histoValues.data.map((p) => p.y));
      [
        { name: 'Тех. мин', value: this.minLimit, maxCountPoint },
        { name: 'Тех. макс', value: this.maxLimit, maxCountPoint },
      ]
        .filter((v) => typeof v.value === 'number')
        .map(getVericalLine)
        .forEach((s) => this.chart.addSeries(s));
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
<style lang="less"></style>
