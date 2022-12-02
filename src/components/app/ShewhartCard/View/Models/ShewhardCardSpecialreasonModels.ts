import { IQueryPointDTO, IShewhartSpecialReasonDTO, IShewhartSpecialReasonUpsertDTO } from '@/api';

export interface ISpecialReason extends Partial<IShewhartSpecialReasonDTO> {
  idnex?: number;
  isNew?: boolean;
  exclude?: boolean;
}

export class CSpecialReasonUpsert {
  upsertData: ISpecialReason;
  constructor(public shewhartUID: string, editData: ISpecialReason, points: Array<IQueryPointDTO>) {
    this.upsertData = {
      uid: editData.uid,
      comment: editData.comment,
      events: editData.events,
      exclude: editData.exclude,
      shewhartCriterialType: editData.shewhartCriterialType,
      specialReasonUid: editData.specialReasonUid,
      points: points,
    } as IShewhartSpecialReasonUpsertDTO;
  }
}

export interface IExludeOption {
  label: string;
  value: boolean;
}
export const storeActoinUpsertRow = 'shewhartCardState/specialReasonUpsert';
export const storeActoinDeleteRow = 'shewhartCardState/specialReasonDelete';
export const storeSelectedPoints = {
  getters: {
    getSelectedPoints: 'selectedPointsState/getSelectedPoints',
    getSelectedPointsByUpsert: 'selectedPointsState/getSelectedPointsByUpsert',
  },
  actions: {
    clear: 'selectedPointsState/clear',
    setPoints: 'selectedPointsState/setPoints',
  },
};

export const storeSpecialReasonGroup = {
  actions: {
    get: 'specialReasonGroupState/get',
  },
};

export const storeSpecialReasonType = {
  actions: {
    get: 'specialReasonTypeState/get',
  },
};

export const storeToastMessage = {
  actions: {
    success: 'toastMessageState/success',
  },
};

export const exludeOptions: IExludeOption[] = [
  { label: 'Исключить из расчета', value: true },
  { label: 'Не исключать из расчета', value: false },
];
