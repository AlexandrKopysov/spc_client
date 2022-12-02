/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  IShewhartGroupPointDTO,
  EShewhartCriterialType,
  IShewhartCardDTO,
  IShewhartNoGroupPointDTO,
  ISigmaDTO,
  IResultShewhartDTO,
  EZoneName,
  EShewhartType,
} from '@/api';
import StockCharts from 'highcharts/highstock';
import {
  DashStyleValue,
  LegendOptions,
  NavigatorOptions,
  Options,
  PointOptionsObject,
  RangeSelectorOptions,
  SeriesLineOptions,
  SeriesOptionsType,
  StockChart,
  TooltipOptions,
  XAxisOptions,
  XAxisPlotLinesOptions,
  YAxisOptions,
} from 'highcharts';
import { v4 as uuidv4 } from 'uuid';
import { ArrayHelper } from '@/services/Array.helper';
import offlineExporting from 'highcharts/modules/offline-exporting';
import accessibility from 'highcharts/modules/accessibility';
import exporting from 'highcharts/modules/exporting';
import { actualHeightScreen } from '@/const-variable';

exporting(StockCharts);
offlineExporting(StockCharts);
accessibility(StockCharts);
/**
 * дефолтный цвет точек
 */
export const POINT_COLOR_DEFAULT = '#808080';

/**
 * цвет выбранных точек в особых причинах
 */
export const POINT_COLOR_SELECTED = '#FF8428';

/**
 * цвет точек в особых причинах не исключённых из расчёта
 */
export const POINT_COLOR_SPECIAL_REASON = '#FF8428';

/**
 * цвет точек в особых причинах не исключённых из расчёта
 */
export const POINT_COLOR_CRITERIA = 'red';

/**
 * формат даты и времени в графике
 * см. тут https://api.highcharts.com/class-reference/Highcharts.Time#Time
 */
const DATE_TIME_FORMAT = '%Y-%m-%d %H:%M';

interface ILineSetting {
  color: string;
  dashStyle: DashStyleValue;
}

/**
 * линии сигм и их настройки
 */
const SIGMA_LINE_SETTING: Record<EZoneName, ILineSetting> = {
  [EZoneName.A]: {
    color: '#de7e6d',
    dashStyle: 'LongDash',
  },
  [EZoneName.B]: {
    color: '#FF8000',
    dashStyle: 'Dash',
  },
  [EZoneName.C]: {
    color: '#97cc2e',
    dashStyle: 'Dot',
  },
};

/**Параметры обычных линий */
const LINE_SETTINGS: Record<string, ILineSetting> = {
  standart: {
    color: '#333333',
    dashStyle: 'Solid',
  },
};

export interface ICriterial {
  label: EShewhartCriterialType;
  isActive: boolean;
  disabled?: boolean;
}

/**
 * типы графиков
 */
enum ETypeGraph {
  x = 'x',
  r = 'r',
}

/**
 * базовая модель для точки на графике
 */
export interface IBasePoint {
  existPoints: Array<IShewhartNoGroupPointDTO>;
  templateHeader: string;
  templateTooltip: string;
  existCriterion: Array<EShewhartCriterialType>;
}

/**
 * модель точки в серии
 */
export interface IHighchartSeriaPoint extends StockCharts.Point, Partial<IBasePoint> {}

/**
 * модель для графика
 */
interface IHighchartOptions extends Options {
  rangeSelector: RangeSelectorOptions;
  series: Array<SeriesOptionsType>;
  xAxis: XAxisOptions;
  yAxis: Array<YAxisOptions>;
  tooltip: TooltipOptions;
  navigator: NavigatorOptions;
  legend: LegendOptions;
}

interface ISeriaResult {
  xSeria: SeriesOptionsType;
  xSigmaSerias: Array<SeriesOptionsType>;
  rSeria: SeriesOptionsType;
  rSigmaSerias: Array<SeriesOptionsType>;
  rTehMaxLimit?: SeriesOptionsType;
  rTehMinLimit?: SeriesOptionsType;
  xAxisPlotLine: XAxisPlotLinesOptions;
}

interface ICollbackEvent {
  clickXRPoint: (point: IHighchartSeriaPoint) => void;
}

const timeHelper = new StockCharts.Time({
  timezoneOffset: new Date().getTimezoneOffset(),
});

/**
 * модель для точки
 */
class PointOptionModel implements PointOptionsObject, IBasePoint {
  y: number;
  x: number;
  existPoints: Array<IShewhartNoGroupPointDTO> = [];
  templateHeader = '';
  templateTooltip = '';
  existCriterion: Array<EShewhartCriterialType> = [];
  specialReasons: Array<string> = [];
  color = '';

  constructor(
    point: IShewhartGroupPointDTO,
    index: number,
    shewhartResult: IResultShewhartDTO<EShewhartType>,
    typeGraph: ETypeGraph,
  ) {
    const shewhartPoint = typeGraph === ETypeGraph.x ? point.x : point.r;
    this.y = shewhartPoint?.value;
    this.x = new Date(point.datePoint).getTime() + index * 1000;
    this.existPoints = point.existPoints;
    if ([EShewhartType.XmRCard].includes(shewhartResult.type) && typeGraph === ETypeGraph.x) {
      this.existPoints = [this.existPoints[this.existPoints.length - 1]];
    }
    this.existCriterion = shewhartPoint?.existCriterions;

    this.specialReasons = this.existPoints
      .map((p) => p.specialReasonUid)
      .filter(ArrayHelper.onlyUnique)
      .map((sUid) => {
        return shewhartResult.specialReasons.find((s) => s.uid === sUid)?.createDate;
      })
      .filter((s) => !!s)
      .map((d) => new Date(d).toLocaleString())
      .reduce((a, b) => a.concat(b), []);
    this.templateHeader = `<strong>${timeHelper.dateFormat(DATE_TIME_FORMAT, this.x)}: ${
      this.y
    }</strong>`;
    this.templateTooltip = this.getBodyTooltip();
    if (this.specialReasons.length) {
      this.color = POINT_COLOR_SPECIAL_REASON;
    }
  }

  private getBodyTooltip(): string {
    let result = this.existPoints
      .map(
        (p) =>
          `${p.uniqId}/${timeHelper.dateFormat(DATE_TIME_FORMAT, new Date(p.date).getTime())}/${
            p.value
          }`,
      )
      .join('<br/>');
    if (this.specialReasons.length) {
      result += `<br/><strong>Особаые причины от:</strong><br/>`;
      result += this.specialReasons.join('<br/>');
    }
    return result;
  }
}

/**
 * фасад для графика
 */
export class HighchartFacade {
  private options: IHighchartOptions = {
    rangeSelector: {
      selected: 5,
    },
    series: [],
    xAxis: {
      plotLines: [],
    },
    yAxis: [
      {
        plotLines: [],
        resize: {
          enabled: true,
        },
        height: '50%',
      },
      { height: '50%', offset: 0, top: '50%' },
    ],
    tooltip: {
      backgroundColor: '#000000',
      borderWidth: 0,
      borderRadius: 3,
      style: {
        color: '#ffffff',
        opacity: 0.8,
      },
      padding: 4,
      shared: true,
      useHTML: true,
    },
    navigator: {
      enabled: true,
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      borderWidth: 0,
    },
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    exporting: {
      sourceWidth: 1200,
      sourceHeight: actualHeightScreen(),
    },
    chart: {
      height: actualHeightScreen(),
      spacingTop: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 20,
    },
  };
  private stockChart: StockChart;
  xrSeriaNames: Array<string> = [];
  redraw() {
    this.stockChart.chartHeight = actualHeightScreen();
    this.stockChart.redraw();
    this.stockChart.reflow();
  }
  constructor(
    private shewhartResult: IResultShewhartDTO<EShewhartType>,
    private el: HTMLElement,
    callbackEvent: ICollbackEvent,
  ) {
    const cards = this.shewhartResult.shewhartCards;
    const allPromises = [];
    cards?.forEach((dataRedirect, indexDate) => {
      allPromises.push(
        new HighcartSeriaFacade(
          cards[indexDate - 1],
          dataRedirect,
          cards[indexDate + 1],
          shewhartResult,
          callbackEvent,
        )
          .getSerias()
          .then((serias) => {
            this.options.series.push(
              serias.rSeria,
              serias.xSeria,
              serias.rTehMaxLimit,
              serias.rTehMinLimit,
              ...serias.rSigmaSerias,
              ...serias.xSigmaSerias,
            );
            this.xrSeriaNames.push(serias.rSeria.name, serias.xSeria.name);
            if (serias.xAxisPlotLine) {
              this.options.xAxis.plotLines.push(serias.xAxisPlotLine);
            }
          }),
      );
    });
    Promise.all(allPromises).then(() => {
      this.stockChart = StockCharts.stockChart(this.el, this.options);
    });
  }

  /**
   * очистить цвета в графике
   */
  public clearColor() {
    this.stockChart.series
      .filter((s) => this.xrSeriaNames.includes(s.name))
      .forEach((s) => {
        s.data.forEach((p) => (p.color = POINT_COLOR_DEFAULT));
      });
    this.redraw();
  }

  /**
   * установить цвета в зависиости от критерия
   */
  public setColor(criterial: ICriterial) {
    this.stockChart.series
      .filter((s) => this.xrSeriaNames.includes(s.name))
      .forEach((s) => {
        s.data.forEach((p) => (p.color = POINT_COLOR_DEFAULT));
        s.data
          .filter((p: IHighchartSeriaPoint) => p.existCriterion?.includes(criterial.label))
          .forEach((p) => {
            p.color = POINT_COLOR_CRITERIA;
          });
      });
    this.redraw();
  }

  public destroy() {
    this.stockChart?.destroy();
    this.stockChart = undefined;
  }
}

/**
 * фасад для серий по дате перерасчёта
 * (для каждой даты свой экземпляр)
 */

export class HighcartSeriaFacade {
  /** точки для X серии */
  private higchartXPoint: Array<PointOptionModel> = [];

  /** точки для R серии */
  private higchartRPoint: Array<PointOptionModel> = [];

  /** даты для сигм линий */
  private dateFromLine: Array<number> = [];

  /** тип карты Шухарта */
  private typeCard: EShewhartType;

  constructor(
    private previewDateRedirect: IShewhartCardDTO,
    private dataRedirect: IShewhartCardDTO,
    private nextDataRedirect: IShewhartCardDTO,
    shewhartResult: IResultShewhartDTO<EShewhartType>,
    private callbackEvent: ICollbackEvent,
  ) {
    this.typeCard = shewhartResult.type;
    this.higchartXPoint = dataRedirect.groupPoints.map(
      (p, index) => new PointOptionModel(p, index, shewhartResult, ETypeGraph.x),
    );
    this.higchartRPoint = dataRedirect.groupPoints.map(
      (p, index) => new PointOptionModel(p, index, shewhartResult, ETypeGraph.r),
    );
    this.dateFromLine = this.higchartXPoint.map((p) => p.x);
  }

  /**
   * получить все необходимые серии для графика
   */
  public async getSerias(): Promise<ISeriaResult> {
    const result: ISeriaResult = {
      xSeria: await this.getXPointSeria(),
      xSigmaSerias: await this.getSigmaSerias(this.dataRedirect.xParam.zoneValue),
      rSeria: await this.getRPointSeria(),
      rSigmaSerias: (await this.getSigmaSerias(this.dataRedirect.rParam.zoneValue)).map((s) => {
        s.yAxis = 1;
        return s;
      }),
      rTehMaxLimit: await this.getTehLimitLine(this.dataRedirect.tehMaxLimit),
      rTehMinLimit: await this.getTehLimitLine(this.dataRedirect.tehMinLimit),
      xAxisPlotLine: undefined,
    };
    if (this.nextDataRedirect) {
      result.xAxisPlotLine = await this.getXplotLine();
    }
    return result;
  }

  private getPointLine(data: Array<PointOptionModel>): Promise<SeriesLineOptions> {
    return this.getBaseLine(data, 1).then((s) => {
      s.showInNavigator = false;
      s.id = uuidv4();
      s.name = uuidv4();
      s.tooltip = {};
      s.tooltip = {
        pointFormat: '<div>{point.templateHeader}<br>{point.templateTooltip}</div>',
        xDateFormat: DATE_TIME_FORMAT,
      };
      s.turboThreshold = 0;
      s.events = {
        click: ({ point }) => {
          this.callbackEvent.clickXRPoint(point);
        },
      };
      return s;
    });
  }

  private getTehLimitLine(tehLimit: number): Promise<SeriesOptionsType> {
    return this.getLineSeria(
      this.dateFromLine.map((d) => [d, tehLimit]),
      LINE_SETTINGS.standart.color,
      LINE_SETTINGS.standart.dashStyle,
    );
  }

  private getXPointSeria(): Promise<SeriesLineOptions> {
    return this.getPointLine(this.higchartXPoint).then((s) => {
      s.showInNavigator = true;
      return s;
    });
  }

  private getRPointSeria(): Promise<SeriesLineOptions> {
    return this.getPointLine(this.higchartRPoint).then((s) => {
      s.yAxis = 1;
      if (this.typeCard !== EShewhartType.XmRCard) {
        s.tooltip.pointFormat = 'R: {point.y}';
      }
      return s;
    });
  }

  private getLineSeria(
    data: Array<[number, number]>,
    color: string,
    dashStyle: DashStyleValue = 'ShortDash',
  ): Promise<SeriesLineOptions> {
    return this.getBaseLine(data, 1).then((s) => {
      s.marker = {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      };
      s.dashStyle = dashStyle;
      s.tooltip.pointFormat = '';
      s.color = color;
      return s;
    });
  }

  private getBaseLine(
    data: Array<PointOptionModel | [number, number]>,
    lineWidth: number,
  ): Promise<SeriesLineOptions> {
    return Promise.resolve({
      type: 'line',
      dataGrouping: { enabled: false },
      turboThreshold: 3000,
      data,
      marker: {
        enabled: true,
        symbol: 'circle',
        radius: 2,
        color: POINT_COLOR_DEFAULT,
      },
      color: '#808080',
      lineWidth: lineWidth,
      accessibility: {
        enabled: false,
      },
      tooltip: {},
    });
  }

  private async getSigmaSerias(
    zones: Record<EZoneName, ISigmaDTO>,
  ): Promise<Array<SeriesOptionsType>> {
    const result: Array<SeriesLineOptions> = [];
    await Object.keys(SIGMA_LINE_SETTING).map(async (key) => {
      result.push(
        await this.getLineSeria(
          this.dateFromLine.map((d) => [d, zones[key].UCL]),
          SIGMA_LINE_SETTING[key].color,
          SIGMA_LINE_SETTING[key].dashStyle,
        ),
      );
    });

    if (zones[EZoneName.C].LCL) {
      await Object.keys(SIGMA_LINE_SETTING).map(async (key) => {
        result.push(
          await this.getLineSeria(
            this.dateFromLine.map((d) => [d, zones[key].LCL]),
            SIGMA_LINE_SETTING[key].color,
            SIGMA_LINE_SETTING[key].dashStyle,
          ),
        );
      });
    }
    return result;
  }

  private getXplotLine(): XAxisPlotLinesOptions {
    return {
      color: '#FF0000',
      zIndex: 3,
      value: new Date(this.dataRedirect.dateRedirect).getTime(),
      dashStyle: 'ShortDash',
      width: 2,
      label: {
        text: this.dataRedirect.comment,
        align: 'right',
        y: 150,
        x: 10,
      },
    };
  }
}
