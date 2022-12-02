/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '@/store';
import axios from 'axios';
import IRequestMessage from '../model/IToastMessage';
axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

axios.interceptors.request.use(function (request) {
  store.dispatch('progressBarState/setProgressBar', true);
  return request;
});

axios.interceptors.response.use(
  (response) => {
    store.dispatch('progressBarState/setProgressBar', false);
    return response;
  },
  (error) => {
    store.dispatch('progressBarState/setProgressBar', false);
    if (error.response?.status === 401) {
      store.dispatch('user/logOut');
    }
    const errorMessage: IRequestMessage = {
      severity: 'error',
      summary:
        error.response.data?.error ||
        error.response?.data ||
        error?.code ||
        error ||
        'Server error',
      detail: error.response.data?.message || '',
    };
    store.dispatch('toastMessageState/error', errorMessage);
    return Promise.reject(error);
  },
);

// function newGet<T = any, D = any>(url: string, config: AxiosRequestConfig<D>) {
//   return oldGet(url, config).then((res) => res.data as T);
// }

// // axios.spcGet = newGet;

// axios.prototype.spcGet = newGet;
// axios.interceptors.response.use((response) => {
//   return response?.data ? response.data : response;
// });
export default axios;
// export { SPCAxiosGet };
