import { Module } from 'vuex';
import { IQueryPointDTO } from '@/api';

export interface IPointsArray {
  selectedPoints: Array<IQueryPointDTO>;
}

export const selectedPointsModule: Module<IPointsArray, IQueryPointDTO> = {
  namespaced: true,
  state: () => ({
    selectedPoints: [],
    choosePermission: false,
  }),
  mutations: {
    POINTS_CLEAR(state) {
      state.selectedPoints = [];
    },
    POINTS_ADD(state, points: Array<IQueryPointDTO>) {
      state.selectedPoints = state.selectedPoints.concat(points);
    },
    POINTS_REMOVE(state, points: Array<IQueryPointDTO>) {
      const pointsIds = points.map((p) => p.uniqId);
      state.selectedPoints = state.selectedPoints.filter((p) => !pointsIds.includes(p.uniqId));
    },

    GROUP_POINT_ADD(state, points: Array<IQueryPointDTO>) {
      state.selectedPoints = points;
    },

    POINT_REMOVE(state, point: IQueryPointDTO) {
      state.selectedPoints.splice(state.selectedPoints.indexOf(point), 1);
    },
  },
  getters: {
    getSelectedPoints(state) {
      return state.selectedPoints;
    },
    getSelectedPointsByUpsert(state) {
      return state.selectedPoints.map((point) => {
        return {
          uniqId: point.uniqId,
          date: point.date,
          value: point.value,
        } as IQueryPointDTO;
      });
    },
  },

  actions: {
    setPoints(state, points: Array<IQueryPointDTO>) {
      state.commit('GROUP_POINT_ADD', points);
    },
    groupPointAdd(state, points: Array<IQueryPointDTO>) {
      state.commit('POINTS_ADD', points);
    },
    groupPointRemove(state, points: Array<IQueryPointDTO>) {
      state.commit('POINTS_REMOVE', points);
    },
    pointRemove(state, points: IQueryPointDTO) {
      state.commit('POINT_REMOVE', points);
    },
    clear(state) {
      state.commit('POINTS_CLEAR');
    },
  },
};
