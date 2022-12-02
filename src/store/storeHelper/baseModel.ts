import { State } from 'vue';
import { Store } from 'vuex';

export class CDialog {
  constructor(public value = false) {}
}

export class CGetters<T> {
  ALL(): Array<T> {
    return this.state.getters[`${this.apiName}/ALL`];
  }
  constructor(public state: Store<State>, public apiName: string) {}
}

export class CActions<T> {
  all() {
    return this.state.dispatch(`${this.apiName}/all`);
  }
  upsert(group: T) {
    return this.state.dispatch(`${this.apiName}/upsert`, group);
  }
  remove(uid: string) {
    return this.state.dispatch(`${this.apiName}/remove`, uid);
  }
  constructor(public state: Store<State>, public apiName: string) {}
}
