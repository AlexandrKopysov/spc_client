import Vuex from 'vuex';
import { userStoreModule } from './user.store';
import { connetctionStateStoreModule } from './connectionState.store';
import { productStoreModule } from './product.store';
import { parameterStoreModule } from './parameter.store';
import { specialReasonTypeStoreModule } from './specialReasonType.store';
import { specialReasonGroupStoreModule } from './specialReasonGroup.store';
import { shewhartCardStoreModule } from './shewhartCard.store';
import { querySltoreModule } from './query.sotre';
import { progressBarModule } from './progressBar.store';
import { toastMessageModule } from './toastMessage.store';
import { usersStoreModule } from './users.store';
import { dateRedirectStoreModule } from './dateRedirect.store';
import { selectedPointsModule } from './selectedPoints.store';
import { userGroupsStoreModule } from './userGroups.store';
import { productionStoreModule } from './production.store';
import { operationStoreModule } from './operation.store';
import { processStoreModule } from './process.store';
import { phoneStoreModule } from './phone.store';
import cronModule from './cron.store';
export * from './cron.store';

export const store = new Vuex.Store({
  modules: {
    user: userStoreModule,
    users: usersStoreModule,
    connectionState: connetctionStateStoreModule,
    productState: productStoreModule,
    parameterState: parameterStoreModule,
    specialReasonTypeState: specialReasonTypeStoreModule,
    specialReasonGroupState: specialReasonGroupStoreModule,
    shewhartCardState: shewhartCardStoreModule,
    dateRedirectState: dateRedirectStoreModule,
    queryState: querySltoreModule,
    progressBarState: progressBarModule,
    toastMessageState: toastMessageModule,
    selectedPointsState: selectedPointsModule,
    userGroupsState: userGroupsStoreModule,
    productionState: productionStoreModule,
    operationState: operationStoreModule,
    processState: processStoreModule,
    phoneState: phoneStoreModule,
    [cronModule.BASE_CONTROLLER_URL]: cronModule.cronStoreModule,
  },
});
