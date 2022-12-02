import ColumnTemplate from './components/Shared/ColumnTemplate.vue';
import ColumnButtonsTemplate from './components/Shared/ColumnButtonsTemplate.vue';
import MonacoEditor from './components/Shared/MonacoEditor.vue';
import ToastComponent from './components/Shared/ToastComponent.vue';
import UserRowTemplate from './components/Shared/UserRowTemplate.vue';
import HeaderMenu from './components/app/Header/Header.vueder.vue';
import ShewhartCardTiles from './components/app/ShewhartCard/View/Components/ShewhartCardTiles.vue';
import ShewhartHighchart from './components/app/ShewhartCard/View/Components/ShewhartHighchart.vue';
import { RouterView } from 'vue-router';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ColumnTemplate: typeof ColumnTemplate;
    ColumnButtonsTemplate: typeof ColumnButtonsTemplate;
    'router-view': typeof RouterView;
    HeaderMenu: typeof HeaderMenu;
    MonacoEditor: typeof MonacoEditor;
    ToastComponent: typeof ToastComponent;
    UserRowTemplate: typeof UserRowTemplate;
    ShewhartCardTiles: typeof ShewhartCardTiles;
    ShewhartHighchart: typeof ShewhartHighchart;
  }
}
