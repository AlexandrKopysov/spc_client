import { EShewhartCriterialType, IShewhartNoGroupPointDTO } from '@/api';

export class IPoint {
  templateTooltip: string;
  templateHeader: string;
  idnex?: number;
  color?: string;
  x: number;
  y?: number;
  existCriterions?: EShewhartCriterialType[];
  existPoints: СExistPoints[];
  marker: СPointMarker;
}

export class СPointMarker {
  enabled: boolean;
  radius: number;
  symbol: string;
  states: СMarkerState;
}

export class СMarkerState {
  hover: {
    fillColor: string;
  };
}

export class СExistPoints {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [key: string]: any;
  // specialReasonUid?: string;
  // uniqId: PointIdentitiType;
  // value: number;
  // date: Date;
  // name_: string;
  // typeOf_: string;

  constructor(
    public name: string,
    public typeOf: string,
    public originObj: IShewhartNoGroupPointDTO,
  ) {}

  // static createFromDto(
  //   objDto: ShewhartNoGroupPointDTO,
  //   name: string,
  //   typeOf: string,
  // ): IExistPoints {
  //   const obj = new IExistPoints();
  //   Object.assign(obj, objDto);
  //   obj.name_ = name;
  //   obj.typeOf_ = typeOf;
  //   return obj;
  // }

  // setName(name: string): IExistPoints {
  //   this.name = name;
  //   return this;
  // }
  // setTypeOf(typeOf: string): IExistPoints {
  //   this.typeOf = typeOf;
  //   return this;
  // }
  // [key: string]: any;
  // specialReasonUid?: string;
  // uniqId: PointIdentitiType;
  // value: number;
  // date: Date;
  // constructor({
  //    name: string,
  //    typeOf: string,
  //    uniqId: PointIdentitiType,
  //    value: number,
  //    date: Date,
  //    specialReasonUid?: string,
  // }
  // ) {
  //   this.name = '';
  //   this.typeOf = '';
  // }
}
// export class IExistPoints extends QueryPointDTO {
//   name: string;
//   typeOf: string;
// }
