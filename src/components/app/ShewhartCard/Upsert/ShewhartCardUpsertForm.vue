<template>
  <div class="grid mr-0">
    <div class="col-8">
      <div class="grid">
        <div class="col-12">
          <MonacoEditor
            class="editor"
            language="sql"
            height=""
            theme="vs-dark"
            :value="shewhartCard.queryParam"
            :options="{ automaticLayout: true }"
            @editorDidMount="editorMount"
            @change="changeMonaco($event)"
          />
        </div>
        <div class="col-12">
          <div class="flex justify-content-between mt-2">
            <Button label="Выполнить" icon="pi " class="button-add" @click="execSQL()" />
            <div>
              <Button label="Сохранить" class="button-add mr-2" @click="saveShewhart()" />
              <Button label="Просмотр" class="button-add" @click="viewingShewhart()" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Название</label>
        </div>
        <div class="col-9">
          <InputText
            type="text"
            class="p-column-filter w-full"
            :placeholder="`Введите название`"
            v-model="shewhartCard.nameCalc"
            :class="{ 'p-invalid': shewhartCard.nameCalc.length === 0 }"
            :disabled="true"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Изделие</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="productSelect"
            :options="products"
            optionLabel="name"
            placeholder="Выберите изделие"
            optionDisabled="isRemoved"
            class="changeColumn multiselect-custom w-full"
            @show="loadLazyProducts()"
            @change="
              selectedProdust(productSelect);
              setShewhartName();
            "
            :filter="true"
            :class="{ 'p-invalid': !productSelect }"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Параметры</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="paramSelect"
            :options="params"
            optionLabel="name"
            optionDisabled="isRemoved"
            placeholder="Выберите параметр"
            class="changeColumn multiselect-custom w-full"
            @change="
              selectedParam(paramSelect);
              setShewhartName();
            "
            :class="{ 'p-invalid': !paramSelect && productSelect }"
            :disabled="!productSelect"
            :filter="true"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Операция</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="operationsSelect"
            :options="allOperations"
            optionLabel="name"
            optionDisabled="isRemoved"
            placeholder="Выберите операцию"
            class="changeColumn multiselect-custom w-full"
            @change="
              selectOperation(operationsSelect);
              setShewhartName();
            "
            :class="{ 'p-invalid': !operationsSelect }"
            :filter="true"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Процесс</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="processSelect"
            :options="allProcess"
            optionLabel="name"
            optionDisabled="isRemoved"
            placeholder="Выберите параметр"
            class="changeColumn multiselect-custom w-full"
            @change="
              selectProcess(processSelect);
              setShewhartName();
            "
            :class="{ 'p-invalid': !processSelect }"
            :filter="true"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Производство</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="productionSelect"
            :options="allProductions"
            optionLabel="name"
            optionDisabled="isRemoved"
            placeholder="Выберите параметр"
            class="changeColumn multiselect-custom w-full"
            @change="
              selectProduction(productionSelect);
              setShewhartName();
            "
            :class="{ 'p-invalid': !productionSelect }"
            :filter="true"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label class="w-full">Тип карты</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="shewhartCard.shewhartType"
            :options="shewhartType"
            optionLabel="name"
            optionValue="name"
            placeholder="Тип карты"
            class="changeColumn multiselect-custom w-full mr-2"
            :filter="true"
            :class="{ 'p-invalid': !shewhartCard.shewhartType }"
            @change="selectedTypeCard(shewhartCard.shewhartType)"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">Точек в группе</div>
        <div class="col-3">
          <InputNumber
            placeholder="Кол-во точек в группе"
            class="w-full w-input"
            :min="2"
            :max="10"
            v-model="(shewhartCard.setting as any).countAgregate"
            :disabled="shewhartCard.shewhartType !== EShewhartType.XRCard"
          />
        </div>
        <div class="col-3">Поле для группировки</div>
        <div class="col-3">
          <InputText
            placeholder="Имя колонки для группировки"
            class="w-full w-input"
            v-model="(shewhartCard.setting as any).groupColumnName"
            :disabled="shewhartCard.shewhartType != EShewhartType.XRCard"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>Поле для сортировки</label>
        </div>
        <div class="col-9">
          <InputText
            v-model="(shewhartCard.setting as any).sortColumnName"
            placeholder="Имя колонки для сортировки"
            class="w-full w-input"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>Критерии стабильности</label>
        </div>
        <div class="col-9">
          <MultiSelect
            v-model="shewhartCard.criterials"
            :options="criterials"
            optionLabel="label"
            optionValue="value"
            placeholder="Критерии"
            class="changeColumn multiselect-custom w-full"
            :filter="true"
          >
          </MultiSelect>
        </div>
      </div>
      <div class="grid">
        <div class="col-3"><label>Строка подключения</label></div>
        <div class="col-9">
          <Dropdown
            v-model="connectionStringSelect"
            :options="connectionStings"
            optionLabel="name"
            placeholder="Выберите строку подключения"
            class="changeColumn multiselect-custom w-12"
            @show="loadLazyConnectionString()"
            @change="selectedConnectionString(connectionStringSelect)"
            :class="{ 'p-invalid': !connectionStringSelect }"
            :filter="true"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>НГД</label>
        </div>
        <div class="col-9">
          <InputNumber
            v-model="shewhartCard.tehMinLimit"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="10"
            class="w-full w-input"
            placeholder="Введите нижнюю границу"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>ВГД</label>
        </div>
        <div class="col-9">
          <InputNumber
            v-model="shewhartCard.tehMaxLimit"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="10"
            class="w-full w-input"
            placeholder="Введите верхнюю границу"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>Просмотр</label>
        </div>
        <div class="col-9">
          <MultiSelect
            v-model="viewingUsers"
            :options="users"
            optionLabel="name"
            placeholder="Пользователи на просмотр"
            class="changeColumn multiselect-custom w-full"
            selectedItemsLabel="{} Строк выбрано"
            :maxSelectedLabels="2"
            :filter="true"
          >
            <template #option="data">
              <UserRowTemplate :userOrGroup="data.option"></UserRowTemplate>
            </template>
          </MultiSelect>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>Ответственные</label>
        </div>
        <div class="col-9">
          <MultiSelect
            v-model="responsibleUsers"
            :options="users"
            optionLabel="name"
            placeholder="Ответственные"
            class="changeColumn multiselect-custom w-full"
            selectedItemsLabel="{} Строк выбрано"
            :maxSelectedLabels="2"
            :filter="true"
          >
            <template #option="data">
              <UserRowTemplate :userOrGroup="data.option"></UserRowTemplate>
            </template>
          </MultiSelect>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <label>Период опроса</label>
        </div>
        <div class="col-9">
          <Dropdown
            v-model="productSelect"
            :options="products"
            optionLabel="name"
            placeholder="Выберите период опроса"
            class="changeColumn multiselect-custom w-full"
            :disabled="true"
            :filter="true"
          >
            <template #option="data">
              {{ data.option.name }}
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="col-12 mt-4 spc-table-header">
      <label class="page-label mb-2">Результат запроса</label>
    </div>
    <QueryResultTableVue :rows="queryResult" />
  </div>
</template>

<script lang="ts">
import {
  IUpdatePermissionUsersReqDTO,
  IStoreConnectionDTO,
  IUserAndUserGroupItemDTO,
  ICheckQueryReqDTO,
  IShewhartCardReqDTO,
  IEntityBase,
  IProductDictDTO,
  GROUP_ALL_USERS_UID,
  EShewhartType,
  EShewhartCriterialType,
  CRITERIAL_DESCRIPTION,
  EConnectionType,
} from '@/api';
import DynamicTable from '../../../Shared/DynamicTable.vue';
import IRequestMessage from '../../../../model/IToastMessage';
import { defineComponent } from 'vue';
import { unsavedDataMix } from '@/components/Shared/Models/unsavedData.mixin';
import deepCopy from '@/services/deepCopy.service';

interface Employee {
  key: string;
  value: string;
}

type typeCardForSelect = {
  name: EShewhartType;
};

export default defineComponent({
  name: 'ShewhartCardUpsertForm',
  components: { QueryResultTableVue: DynamicTable },
  mixins: [unsavedDataMix],
  data() {
    return {
      EShewhartType: EShewhartType,
      monacoEditor: null,

      // Пользователи
      users: [] as IUserAndUserGroupItemDTO[],
      viewingUsers: [] as IUserAndUserGroupItemDTO[],
      responsibleUsers: [] as IUserAndUserGroupItemDTO[],

      // Изделия
      products: [] as IProductDictDTO[],
      productSelect: {} as IProductDictDTO,

      //Параметры
      allparams: [] as IEntityBase[],
      params: [] as IEntityBase[],
      paramSelect: {} as IEntityBase,

      //Производство
      allProductions: [] as IEntityBase[],
      productions: [] as IEntityBase[],
      productionSelect: {} as IEntityBase,

      //Операции
      allOperations: [] as IEntityBase[],
      operations: [] as IEntityBase[],
      operationsSelect: {} as IEntityBase,

      //Процессы
      allProcess: [] as IEntityBase[],
      process: [] as IEntityBase[],
      processSelect: {} as IEntityBase,

      //Строки подключения
      connectionStings: [] as IStoreConnectionDTO<EConnectionType>[],
      connectionStringSelect: {} as IStoreConnectionDTO<EConnectionType>,

      // критери
      criterials: Object.keys(CRITERIAL_DESCRIPTION).map((key) => ({
        value: key as EShewhartCriterialType,
        label: CRITERIAL_DESCRIPTION[key],
      })) as Array<{ value: EShewhartCriterialType; label: string }>,

      shewhartType: Object.values(EShewhartType).map((t) => ({
        name: t,
      })) as typeCardForSelect[],

      code: '',

      shewhartTypeSelect: null as typeCardForSelect,

      // Границы группировки
      groupMinMax: {
        disabled: false,
        min: 2,
        max: 10,
      },

      /**Основные данные карты шухарта */
      shewhartCard: {
        uid: '',
        nameCalc: '',
        productUid: null,
        queryParam: '',
        shewhartType: null,
        setting: {
          sortColumnName: 'date',
        },
        criterials: [EShewhartCriterialType.PointIntoRzone],
        storeConnectionUid: null,
        paramUid: null,
        productionUid: null,
        operationUid: null,
        processUid: null,
        tehMaxLimit: null,
        tehMinLimit: null,
        responsibleUserUids: [],
        viewedUsersOrGroupUids: [GROUP_ALL_USERS_UID],
      } as IShewhartCardReqDTO<EConnectionType, EShewhartType>,
      oldObject: {} as IShewhartCardReqDTO<EConnectionType, EShewhartType>,

      //**Поля, обязательные для заполнения */
      fieldsRequired: [
        {
          key: 'productUid',
          value: 'Изделие',
        },
        {
          key: 'shewhartType',
          value: 'Тип карты',
        },
        {
          key: 'storeConnectionUid',
          value: 'Строка подключения',
        },
        {
          key: 'paramUid',
          value: 'Параметры',
        },
      ] as Employee[],

      checkQuery: {} as ICheckQueryReqDTO<EConnectionType>,
      // Поля для проверки запроса
      checkQueryReq: [
        {
          key: 'storeConnectionUid',
          value: 'Строка подключения',
        },
      ] as Employee[],

      queryResult: [],

      /**Ответственные за карту*/
      shewhartCardPermissionUser: {
        responsableUserUids: [],
        viewUserUids: [],
      } as IUpdatePermissionUsersReqDTO,

      loading: false,
    };
  },
  methods: {
    changeMonaco(event) {
      this.shewhartCard.queryParam = event;
    },
    /**Обновление имени карты */
    setShewhartName() {
      this.shewhartCard.nameCalc = `${this.productionSelect?.name || ''} ${
        this.productSelect?.name || ''
      } ${this.processSelect?.name || ''} ${this.operationsSelect?.name || ''} ${
        this.paramSelect?.name || ''
      }`;
    },

    selectedProdust(selectData: IProductDictDTO) {
      this.paramSelect = null;
      this.params = this.allparams.filter((p) => selectData?.paramUids.includes(p.uid));
      this.shewhartCard.productUid = selectData.uid;
    },

    selectedParam(selectData) {
      this.shewhartCard.paramUid = selectData.uid;
    },

    selectOperation(operation: IEntityBase) {
      this.shewhartCard.operationUid = operation.uid;
    },

    selectProcess(process: IEntityBase) {
      this.shewhartCard.processUid = process.uid;
    },

    selectProduction(production: IEntityBase) {
      this.shewhartCard.productionUid = production.uid;
    },

    selectedConnectionString(selectData) {
      this.shewhartCard.storeConnectionUid = selectData.uid;
    },

    selectedTypeCard(selectData: EShewhartType) {
      this.groupMinMax.disabled = selectData !== EShewhartType.XmRCard;
      this.shewhartCard.setting = {
        countAgregate: 0,
        groupColumnName: '',
        sortColumnName: this.shewhartCard.setting.sortColumnName,
      };
      const existIndex = this.shewhartCard.criterials.indexOf(
        EShewhartCriterialType.PointGroupCountNotValid,
      );

      if (selectData === EShewhartType.XRCard && existIndex < 0) {
        this.shewhartCard.criterials.push(EShewhartCriterialType.PointGroupCountNotValid);
      }

      if (selectData !== EShewhartType.XRCard && existIndex > -1) {
        this.shewhartCard.criterials.splice(existIndex, 1);
      }
    },
    editorMount(editor) {
      this.editorMount = editor;
    },
    setViewingUser() {
      this.viewingUsers = this.shewhartCard.viewedUsersOrGroupUids.map((uid) =>
        this.users.find((u) => u.uid === uid),
      );
    },

    // Мапинг параметров по uid (изменение карты шухарта)
    createShewhartComponent(response: IShewhartCardReqDTO<EConnectionType, EShewhartType>) {
      this.shewhartCard = {
        uid: response?.uid,
        nameCalc: response?.nameCalc,
        productUid: response?.productUid,
        processUid: response?.processUid,
        operationUid: response?.operationUid,
        productionUid: response?.productionUid,
        queryParam: response?.queryParam,
        shewhartType: response?.shewhartType,
        setting: response?.setting,
        criterials: response?.criterials,
        storeConnectionUid: response?.storeConnectionUid,
        paramUid: response?.paramUid,
        tehMaxLimit: response?.tehMaxLimit,
        tehMinLimit: response?.tehMinLimit,
        responsibleUserUids: response?.responsibleUserUids || [],
        viewedUsersOrGroupUids: response?.viewedUsersOrGroupUids || [],
      };
      this.responsibleUsers = response.responsibleUserUids.map((uid) =>
        this.users.find((u) => u.uid === uid),
      );

      if (response?.productUid) {
        this.productSelect = this.products.find((product) => {
          return product.uid === response?.productUid;
        });
        this.params = this.allparams.filter((p) => this.productSelect?.paramUids.includes(p.uid));
        this.paramSelect = this.allparams.find((param) => {
          return param.uid === response?.paramUid;
        });
      }

      if (response?.productionUid) {
        this.productionSelect = this.allProductions.find(
          (production) => production.uid === response.productionUid,
        );
      }

      if (response?.operationUid) {
        this.operationsSelect = this.allOperations.find(
          (operation) => operation.uid === response.operationUid,
        );
      }

      if (response?.processUid) {
        this.processSelect = this.allProcess.find((process) => process.uid === response.processUid);
      }

      this.connectionStringSelect = this.connectionStings.find((connectionString) => {
        return connectionString.uid === response?.storeConnectionUid;
      });
      this.oldObject = deepCopy(this.shewhartCard);
    },
    getShewhart(uid) {
      this.$store.dispatch('shewhartCardState/getByUid', uid).then((response) => {
        this.createShewhartComponent(response);
      });
    },
    loadLazyProducts() {
      return this.$store
        .dispatch('productState/allJoin')
        .then((response) => {
          this.products = response;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadParams() {
      return this.$store
        .dispatch('parameterState/getDict')
        .then((response) => {
          this.allparams = response;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadProcess() {
      return this.$store
        .dispatch('processState/getDict')
        .then((response) => {
          this.allProcess = response;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadOperations() {
      return this.$store
        .dispatch('operationState/getDict')
        .then((response) => {
          this.allOperations = response;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadProductions() {
      return this.$store
        .dispatch('productionState/getDict')
        .then((response) => {
          this.allProductions = response;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    loadLazyConnectionString() {
      return this.$store.dispatch('connectionState/getStoreConnection').then((response) => {
        this.connectionStings = response;
      });
    },

    loadUsers() {
      return this.$store.dispatch('users/getDict').then((response) => {
        this.users = response;
      });
    },

    execSQL() {
      if (!this.shewhartCard.storeConnectionUid) {
        const message: IRequestMessage = { detail: 'Выберите строку подключения' };
        this.$store.dispatch('toastMessageState/warn', message);
        return;
      }
      if (!this.shewhartCard.setting.sortColumnName) {
        const message: IRequestMessage = { detail: 'Укажите колоку для сортировки' };
        this.$store.dispatch('toastMessageState/warn', message);
        return;
      }
      this.checkQuery = {
        connectionUId: this.shewhartCard.storeConnectionUid,
        sortColumnName: this.shewhartCard.setting.sortColumnName,
        query: this.shewhartCard.queryParam,
      };
      this.$store.dispatch('queryState/checkQuery', this.checkQuery).then((response) => {
        this.queryResult = response?.rows || null;
        if (response?.warnings.length) {
          const message: IRequestMessage = {
            detail: ['Запрос вернул следующие ошибки:', ...response?.warnings].join('\r\n'),
          };
          this.$store.dispatch('toastMessageState/warn', message);
        }
      });
    },

    checkRequiredFilds() {
      const checkedFields: string[] = [];
      for (let index = 0; index < this.fieldsRequired.length; index++) {
        if (!this.shewhartCard[this.fieldsRequired[index].key]) {
          checkedFields.push(this.fieldsRequired[index].value);
        }
      }
      checkedFields.push(...this.checkSettings(this.shewhartCard));
      if (checkedFields.length > 0) {
        const message: IRequestMessage = {
          detail: ['Не заполнены следующие поля:', ...checkedFields].join('\r\n'),
        };
        this.$store.dispatch('toastMessageState/warn', message);
      }
      return !checkedFields.length;
    },

    checkSettings(shehartCard: IShewhartCardReqDTO<EConnectionType, EShewhartType>): Array<string> {
      const result = [];
      if (shehartCard.shewhartType === EShewhartType.XRCard) {
        const { setting } = shehartCard as IShewhartCardReqDTO<
          EConnectionType,
          EShewhartType.XRCard
        >;
        if (setting.countAgregate < 2 || setting.countAgregate > 10) {
          result.push('Количесво элемнетов в группе');
        }
        if (!setting.groupColumnName) {
          result.push('Имя колонки для группировки');
        }
      }
      if (!shehartCard.setting.sortColumnName) {
        result.push('Имя колонки для сортировки');
      }
      return result;
    },

    viewingShewhart() {
      this.saveShewhart().then(() => {
        const cardUid = this.$route.params.cardUid;
        this.$router.push({ name: 'График', params: { cardUid } }); // -> /user/123
      });
    },

    async saveShewhart() {
      if (this.checkRequiredFilds()) {
        await this.$store
          .dispatch('shewhartCardState/upsert', this.shewhartCard)
          .then((response) => {
            this.shewhartCard.uid = response?.uid || null;
            const message: IRequestMessage = {
              detail: 'Карта успешно добавлена/изменена',
            };
            this.oldObject = deepCopy(this.shewhartCard);
            this.$store.dispatch('toastMessageState/success', message);
          });

        const upsertUsers = {
          viewUserUids: this.viewingUsers.map((user) => {
            return user.uid;
          }),
          responsableUserUids: this.responsibleUsers.map((user) => {
            return user.uid;
          }),
        };

        await this.$store.dispatch('shewhartCardState/upsertUsersPermission', {
          rowUid: this.shewhartCard.uid,
          value: upsertUsers,
        });
      }
    },

    dataValidate() {
      return this.isEqual(this.oldObject, this.shewhartCard);
    },
  },
  mounted() {
    Promise.all([
      this.loadLazyProducts(),
      this.loadLazyConnectionString(),
      this.loadUsers(),
      this.loadParams(),
      this.loadProcess(),
      this.loadOperations(),
      this.loadProductions(),
    ]).then(() => {
      if (this.$route.params.cardUid) {
        this.getShewhart(this.$route.params.cardUid);
      }
      this.setViewingUser();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.checkGuardValidate(next);
  },
});
</script>

<style scoped lang="less">
@import url('./shewhartCardUpsertForm.style.less');
</style>
