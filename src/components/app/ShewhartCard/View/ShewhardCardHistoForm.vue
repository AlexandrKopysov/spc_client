<template>
  <div
    class="grid grid-nogutter"
    v-for="(shewhartCard, index) in shewhartData?.shewhartCards.reverse()"
    :key="shewhartCard.dateRedirectUID"
  >
    <div class="col-12">
      <label v-if="!!index" class="page-sublabel">
        С {{ new Date(shewhartCard?.groupPoints[0].datePoint).toLocaleString() }} по
        {{ new Date(shewhartCard.dateRedirect).toLocaleString() }}</label
      >
      <label v-else class="page-sublabel"
        >Актуальные данные с
        {{ new Date(shewhartData?.shewhartCards[0]?.groupPoints[0]?.datePoint).toLocaleString() }}
      </label>
    </div>
    <div class="col-8">
      <HighchartTrend
        v-if="!!shewhartData"
        id="Trend"
        header="Тренд"
        :shewhart-card="shewhartCard"
      />
      <div v-else class="w-full h-full flex-center">
        <h4>Нет данных для графика</h4>
      </div>
    </div>
    <div class="col-4">
      <Histogram
        v-if="!!shewhartData"
        id="'Histo'"
        header="Гистограмма"
        :shewhart-card="shewhartCard"
        :max-limit="shewhartCard?.tehMaxLimit"
        :min-limit="shewhartCard?.tehMinLimit"
      />
      <div v-else class="w-full h-full flex-center">
        <h4>Нет данных для графика</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EShewhartType, IResultShewhartDTO } from '../../../../../../web-api';
import Histogram from './Components/Histogram.vue';
import HighchartTrend from './Components/HighchartTrend.vue';

export default defineComponent({
  name: 'ShewhardCardHistoForm',
  components: { Histogram, HighchartTrend },
  setup() {
    return { shewhartAPI: 'shewhartCardState' };
  },
  data() {
    return {
      shewhartData: null as IResultShewhartDTO<EShewhartType>,
    };
  },
  methods: {
    loadShewhartView(uid) {
      this.$store
        .dispatch(`${this.shewhartAPI}/getView`, uid)
        .then((response: IResultShewhartDTO<EShewhartType>) => {
          this.shewhartData = response;
        });
    },
    changeModel() {
      if (this.$route.params.cardUid) {
        this.loadShewhartView(this.$route.params.cardUid);
      }
    },
  },
  mounted() {
    this.changeModel();
  },
});
</script>
