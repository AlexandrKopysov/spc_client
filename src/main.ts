import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
// import DialogService from 'primevue/dialogservice';
// import DynamicDialog from 'primevue/dynamicdialog';
import Sidebar from 'primevue/sidebar';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Message from 'primevue/message';
import InlineMessage from 'primevue/inlinemessage';
import ProgressBar from 'primevue/progressbar';
import DataTable from 'primevue/datatable';
import Toolbar from 'primevue/toolbar';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import ToastComponent from './components/Shared/ToastComponent.vue';
import TabMenu from 'primevue/tabmenu';
import MultiSelect from 'primevue/multiselect';
import ColumnTemplate from './components/Shared/ColumnTemplate.vue';
import ColumnButtonsTemplate from './components/Shared/ColumnButtonsTemplate.vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import { store } from './store';
import MonacoEditor from './components/Shared/MonacoEditor.vue';
import Textarea from 'primevue/textarea';
import UserRowTemplate from './components/Shared/UserRowTemplate.vue';
import Password from 'primevue/password';
import PanelMenu from 'primevue/panelmenu';
import TreeTable from 'primevue/treetable';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Menu from 'primevue/menu';
import Checkbox from 'primevue/checkbox';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

//Глобальные миксины
import globalMixin from './global.mixin';

const app = createApp(App);
app.mixin(globalMixin);
const registerComponents = function (app) {
  app.component('Sidebar', Sidebar);
  app.component('InputText', InputText);
  app.component('Button', Button);
  app.component('Message', Message);
  app.component('InlineMessage', InlineMessage);
  app.component('ProgressBar', ProgressBar);
  app.component('DataTable', DataTable);
  app.component('Column', Column);
  app.component('ColumnGroup', ColumnGroup);
  app.component('Row', Row);
  app.component('Toolbar', Toolbar);
  app.component('Dialog', Dialog);
  app.component('Toast', Toast);
  app.component('ToastComponent', ToastComponent);
  app.component('TabMenu', TabMenu);
  app.component('MultiSelect', MultiSelect);
  app.component('Accordion', Accordion);
  app.component('AccordionTab', AccordionTab);
  app.component('Dropdown', Dropdown);
  app.component('Calendar', Calendar);
  app.component('InputNumber', InputNumber);
  app.component('ColumnTemplate', ColumnTemplate);
  app.component('ColumnButtonsTemplate', ColumnButtonsTemplate);
  app.component('MonacoEditor', MonacoEditor);
  app.component('Textarea', Textarea);
  app.component('UserRowTemplate', UserRowTemplate);
  app.component('Password', Password);
  app.component('PanelMenu', PanelMenu);
  app.component('TreeTable', TreeTable);
  app.component('ConfirmDialog', ConfirmDialog);
  app.component('Menu', Menu);
  app.component('Checkbox', Checkbox);
  app.component('TabView', TabView);
  app.component('TabPanel', TabPanel);

  return app;
};
registerComponents(app)
  .use(router)
  .use(ConfirmationService)
  .use(PrimeVue)
  .use(ToastService)
  .use(store, 'user')
  .mount('#app');

// window.addEventListener('devicemotion', (event) => {
//   debugger;
//   if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
//     store.commit('phoneState/SET', true);
// });
