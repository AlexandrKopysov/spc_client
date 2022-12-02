import { CActions, CGetters } from './baseModel';
import { IUserGroupDTO } from '@/api';
import { Store } from 'vuex';
import { State } from 'vue';

class CGettersExtends<T> extends CGetters<T> {}

class CActionsExtends<T> extends CActions<T> {}

export class CHelperUsersGroups {
  getters!: CGettersExtends<IUserGroupDTO>;
  actions!: CActionsExtends<IUserGroupDTO>;
  constructor(private store: Store<State>, apiName: string) {
    this.getters = new CGettersExtends(this.store, apiName);
    this.actions = new CActionsExtends(this.store, apiName);
  }
}
