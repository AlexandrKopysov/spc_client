import axios from '@/services/axios.service';
import { IAuthReqDto, IAuthResDto } from '@/api';
import { Module } from 'vuex';

export interface IUserState {
  user?: IAuthResDto;
}

export const localStorageUserKey = 'userRes';

export const userStoreModule: Module<IUserState, object> = {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem(localStorageUserKey) || '{}'),
  }),
  mutations: {
    setUser(state, payload: IAuthResDto) {
      state.user = payload;
    },
  },
  getters: {
    authTocken(state) {
      return state.user?.access_token;
    },
    GET_ROLE(state) {
      return state.user?.role;
    },
    GET_UID(state) {
      return state.user.uid;
    },
    GET_FULLNAME(state) {
      return state.user.fullName;
    },
  },
  actions: {
    async logIn(state, user: IAuthReqDto) {
      return await axios
        .post<IAuthResDto>('auth/login', {
          username: user.username,
          password: user.password,
        })
        .then((response) => {
          if (!response.data) {
            throw {
              response,
            };
          }
          return response.data;
        })
        .then((user) => {
          state.commit('setUser', user);
          localStorage.setItem(localStorageUserKey, JSON.stringify(user));
          axios.defaults.headers['Authorization'] = `Bearer ${user.access_token}`;
          return user;
        });
    },
    logOut(state) {
      state.commit('setUser', {});
      localStorage.removeItem(localStorageUserKey);
      delete axios.defaults.headers['Authorization'];
    },
  },
};
