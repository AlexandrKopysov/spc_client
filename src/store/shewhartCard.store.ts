import axios from '@/services/axios.service';
import {
  IShewhartCardReqDTO,
  IUpdatePermissionUsersReqDTO,
  IResultShewhartDTO,
  IShewhartSpecialReasonDTO,
  IEntityBase,
  EConnectionType,
  EShewhartType,
} from '@/api';
import { Module } from 'vuex';

/**
 * Имя API команда
 */
const comandName = 'shewhard-card';
export interface IISShewhartCardStore {
  shewhartCard?: IShewhartCardReqDTO<EConnectionType, EShewhartType>;
  shewhartCards?: IShewhartCardReqDTO<EConnectionType, EShewhartType>[];
  dictList: Array<IEntityBase>;
}

export interface IISUpsertUsersPermission {
  rowUid: string;
  value: IUpdatePermissionUsersReqDTO;
}

interface ISFilter {
  name: { value: string; matchMode: string };
}

export interface ISpecialReasonUpsert extends IShewhartSpecialReasonDTO {
  shewhartUID?: string;
  upsertData: IShewhartSpecialReasonDTO;
}

interface ISLazyParams {
  first: number;
  rows: number;
  order: null;
  filters: ISFilter;
  sortField: string;
  sortOrder: number;
}

export const shewhartCardStoreModule: Module<IISShewhartCardStore, object> = {
  namespaced: true,
  state: () => ({
    shewhartCard: null,
    dictList: [],
  }),
  mutations: {
    setDictList(state, rows: Array<IEntityBase>) {
      state.dictList = rows || [];
    },
    setShewhardCard(state, newShewhardCard: IShewhartCardReqDTO<EConnectionType, EShewhartType>) {
      state.shewhartCard = newShewhardCard;
    },
    setShewhardCards(
      state,
      newShewhardCards: IShewhartCardReqDTO<EConnectionType, EShewhartType>[],
    ) {
      state.shewhartCards = newShewhardCards;
    },
  },
  getters: {
    GET_SHEWHARDCARD: (state) => {
      return state.shewhartCard;
    },
  },
  actions: {
    async get() {
      return await axios
        .get<IShewhartCardReqDTO<EConnectionType, EShewhartType>>(`${comandName}/all`, {})
        .then((response) => {
          return response.data;
        });
    },
    async getAllWithCredentions(state) {
      return await axios
        .get<IShewhartCardReqDTO<EConnectionType, EShewhartType>>(
          `${comandName}/allWidthCredentions`,
          {},
        )
        .then((response) => {
          state.commit('setShewhardCards', response.data);
          return response.data;
        });
    },

    async getAllWithCredentionsState(state) {
      if (state.state.shewhartCards) {
        return state.state.shewhartCards;
      } else {
        return this.dispatch('shewhartCardState/getAllWithCredentions');
      }
    },

    async getView(state, uid: string) {
      return await axios
        .get<IResultShewhartDTO<EShewhartType>>(`${comandName}/view/${uid}`, {})
        .then((response) => {
          state.commit('setShewhardCard', response.data);
          return response.data;
        });
    },

    async getByUid(state, uid: string) {
      return await axios
        .get<IShewhartCardReqDTO<EConnectionType, EShewhartType>>(`${comandName}/single/${uid}`, {})
        .then((response) => {
          return response.data;
        });
    },
    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<IShewhartCardReqDTO<EConnectionType, EShewhartType>>(
          `${comandName}/query?limit=${lazyParams.rows}&offset=${
            lazyParams.first
          }&filter=${JSON.stringify(lazyParams.filters)}${order}`,
          {},
        )
        .then((response) => {
          return response.data;
        });
    },
    async upsert(state, upsertRow: IShewhartCardReqDTO<EConnectionType, EShewhartType>) {
      return await axios
        .post<IShewhartCardReqDTO<EConnectionType, EShewhartType>>(
          `${comandName}/upsert`,
          upsertRow,
        )
        .then((response) => {
          return response.data;
        });
    },

    async upsertUsersPermission(state, updateObject: IISUpsertUsersPermission) {
      return await axios
        .post(`${comandName}/credention/${updateObject.rowUid}`, updateObject.value)
        .then((response) => {
          return response.data;
        });
    },
    async delete(state, deleteRow: IShewhartCardReqDTO<EConnectionType, EShewhartType>) {
      return await axios.delete(`${comandName}/remove/${deleteRow.uid}`).then((response) => {
        return response.data;
      });
    },
    async specialReasonUpsert(state, upsertSpecialReason: ISpecialReasonUpsert) {
      return await axios
        .post(
          `${comandName}/${upsertSpecialReason.shewhartUID}/special-point/upsert`,
          upsertSpecialReason.upsertData,
        )
        .then((response) => {
          return response;
        });
    },
    async specialReasonDelete(state, upsertSpecialReason: ISpecialReasonUpsert) {
      return await axios
        .delete(
          `${comandName}/${upsertSpecialReason.shewhartUID}/special-point/${upsertSpecialReason.upsertData.uid}`,
        )
        .then((response) => {
          return response;
        });
    },

    async getDicts(state) {
      return await axios
        .get<Array<IEntityBase>>(`${comandName}/dict`)
        .then((response) => {
          return response.data;
        })
        .then((rows) => {
          state.commit('setDictList', rows);
        });
    },
  },
};
