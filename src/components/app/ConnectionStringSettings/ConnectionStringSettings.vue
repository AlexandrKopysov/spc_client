<template>
  <div class="spc flex flex-column">
    <div class="spc-table-header flex flex-column">
      <div class="page-label">{{ $router.currentRoute.value.meta?.label }}</div>
      <div>
        <Button label="Добавить" class="button-add" @click="addRow()" />
      </div>
    </div>
    <div class="flex-grow-1 content-table">
      <DataTable
        class="p-datatable-sm spc-table-body"
        :value="rows"
        :scrollable="true"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
      >
        <Column field="name" header="Наименование">
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              {{ data[field] }}
              <template #editor>
                <InputText v-model="editingRows[data.uid][field]" class="changeColumn" />
              </template>
            </ColumnTemplate>
          </template>
        </Column>
        <Column field="type" header="Тип">
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              {{ data[field] }}
              <template #editor>
                <Dropdown
                  v-model="editingRows[data.uid][field]"
                  :options="types"
                  placeholder="Тип источника данных"
                />
              </template>
            </ColumnTemplate>
          </template>
        </Column>
        <Column field="settings" header="Строка подключения">
          <template #body="{ data, field }">
            <ColumnTemplate v-bind:isEdit="!!editingRows[data.uid]">
              <a @click="editSettingClick(data)" class="setting-link">{{ data[field] }}</a>
              <template #editor>
                <a @click="editSettingClick(data)" class="setting-link">{{ data[field] }}</a>
              </template>
            </ColumnTemplate>
          </template>
        </Column>
        <Column style="justify-content: end">
          <template #body="{ data, index }">
            <ColumnButtonsTemplate
              v-bind:isEdit="!!editingRows[data.uid]"
              @click-edit="editRow(data)"
              @click-remove="confirmDeleteSelected(data, index)"
              @click-ok="okEditRow(editingRows[data.uid], index)"
              @click-cancel="canselEdit(editingRows[data.uid], index)"
            ></ColumnButtonsTemplate> </template
        ></Column>
      </DataTable>
    </div>
  </div>

  <Dialog
    v-model:visible="showDialogDelete"
    :style="{ width: '450px' }"
    header="Подтверждение"
    :modal="true"
  >
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Вы точно хотите удалить строку,</span>
    </div>
    <template #footer>
      <Button
        label="Нет"
        icon="pi pi-times"
        class="p-button-text"
        @click="showDialogDelete = false"
      />
      <Button label="Да" icon="pi pi-check" class="p-button-text" @click="deleteRow()" />
    </template>
  </Dialog>
  <Dialog
    header="Настройка подключения"
    v-model:visible="isEditSetting"
    :style="{ width: '600px', height: '600px' }"
    :modal="true"
  >
    <div class="editor" id="editor">
      <MonacoEditor
        class="h-full w-full"
        language="json"
        theme="vs-dark"
        :options="{ automaticLayout: true, value: editSetting }"
        @editor-did-mount="loadEditor($event)"
      />
    </div>
    <template #footer>
      <Button
        label="Отмена"
        icon="pi pi-times"
        class="p-button-text"
        @click="
          isEditSetting = false;
          editSetting = null;
        "
      />
      <Button label="Принять" icon="pi pi-check" class="p-button-text" @click="applySettings()" />
    </template>
  </Dialog>
  <Toast position="bottom-right" group="br" />
</template>

<script lang="ts">
import { IStoreConnectionDTO, EConnectionType } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import ColumnTemplate from '@/components/Shared/ColumnTemplate.vue';
import ColumnButtonsTemplate from '@/components/Shared/ColumnButtonsTemplate.vue';
import { editor } from 'monaco-editor';
import { defineComponent } from 'vue';
import { dictMixis } from '@/components/Shared/Models/dictionary.mixin';
// type StoreConnectionUI = IStoreConnectionDTO<EConnectionType> & { isNew?: boolean };

interface StoreConnectionUI<T extends EConnectionType> extends IStoreConnectionDTO<T> {
  isNew?: boolean;
}

export default defineComponent({
  name: 'ConnectionStringSettings',
  mixins: [dictMixis<StoreConnectionUI<EConnectionType>>()],
  components: { ColumnTemplate, ColumnButtonsTemplate },
  setup() {
    return {
      storeActoinUpsertRow: 'connectionState/addStoreConnection',
      storeActoinDeleteRow: 'connectionState/deleteStoreConnection',
      types: Object.keys(EConnectionType),
      editor: null as editor.IStandaloneCodeEditor,
    };
  },
  data() {
    return {
      rows: [] as StoreConnectionUI<EConnectionType>[],
      editingRows: {} as Record<string, StoreConnectionUI<EConnectionType>>,
      selectionsConnectionData: [] as StoreConnectionUI<EConnectionType>[],
      /** редактирование сеттинга */
      editSettingRow: null as StoreConnectionUI<EConnectionType>,
      editSetting: null,
      isEditSetting: false,
      /** */
    };
  },
  methods: {
    getNewObj(): StoreConnectionUI<EConnectionType> {
      return {
        name: null,
        settings: {
          server: null,
        },
        type: EConnectionType.MSSQL,
        isNew: true,
        uid: uuidv4(),
      };
    },

    editSettingClick(row: StoreConnectionUI<EConnectionType>) {
      this.editSettingRow = row;
      this.editSetting = JSON.stringify(row.settings);
      this.isEditSetting = true;
    },

    applySettings() {
      this.editSettingRow.settings = JSON.parse(this.editor?.getValue() || 'null');
      if (this.editSettingRow.isNew) {
        this.editSetting = null;
        this.isEditSetting = false;
        return;
      }
      const findIndex = this.rows.findIndex((row) => row === this.editSettingRow);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.okEditRow(this.editSettingRow as any, findIndex).then(() => {
        this.editSetting = null;
        this.isEditSetting = false;
      });
    },

    loadEditor(editor) {
      this.editor = editor;
      setTimeout(() => {
        this.editor?.getAction('editor.action.formatDocument').run();
      }, 100);
    },
  },
  beforeCreate() {
    this.$store.dispatch('connectionState/getStoreConnection').then((response) => {
      this.rows = response;
    });
  },
});
</script>

<style scoped lang="less">
@import url('./connectionStringSettings.style.less');
.editor {
  width: 550px;
  height: 425px;
}
</style>
