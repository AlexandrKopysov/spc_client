<template>
  <div class="spc flex flex-column">
    <div class="flex spc-table-header">
      <Button label="Добавить" class="button-add" @click="addRow()" />
    </div>
    <div class="flex-grow-1 content-table">
      <TreeTable
        class="p-datatable-sm spc-table-body"
        :value="mainList"
        :paginator="true"
        :rows="10"
        @node-expand="nodeSelect"
        :filters="filter"
        filterMode="lenient"
        :scrollable="true"
        scrollHeight="flex"
      >
        <Column style="width: 90%" field="fullName" header="Полное наименование" :expander="true">
          <template #filter>
            <InputText
              type="text"
              v-model="filter['fullName']"
              class="p-column-filter w-full"
              placeholder="Фильтр по наименованию"
            /> </template
        ></Column>
        <Column style="width: 10%; display: flex; justify-content: end">
          <template #body="{ node }">
            <div class="actions">
              <Button
                icon="pi pi-plus"
                class="p-button-rounded p-button-text pencil-hover"
                @click="addChildrenRow(node.data.uid)"
              />
              <Button
                icon="pi pi-cog"
                class="p-button-rounded p-button-text"
                @click="editRow(node.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text"
                @click="confirmDelete(node.data)"
              />
            </div>
          </template>
        </Column>
      </TreeTable>
    </div>
  </div>
  <GroupUpsertModal
    v-if="CDialogs.Upsert.value"
    class="spc"
    :upsertRowProp="upsertRow"
    :dialogProp="CDialogs.Upsert"
    :allUsersProp="allUsers"
    @edit-success="okEditRow()"
    @edit-cancel="offEditRow()"
  >
  </GroupUpsertModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { CDialog } from '@/store/storeHelper/baseModel';
import { CHelperUsers } from '@/store/storeHelper/usersStoreHelper';
import { CHelperUsersGroups } from '@/store/storeHelper/usersGroupsStoreHelper';
import { IUserDto, IUserGroupDTO } from '@/api';
import deebCopy from '../../../../services/deepCopy.service';
import { CToastMessage } from '@/model/IToastMessage';
import GroupUpsertModal from './Components/GroupUpsertModal.vue';

export class CMenuItem {
  constructor(public data: IUserGroupDTO, public children: CMenuItem[], public key?: string) {}
}
export default defineComponent({
  name: 'GroupsViewForm',
  setup() {
    const query = {};
    return query;
  },
  components: {
    GroupUpsertModal: GroupUpsertModal,
  },
  data() {
    return {
      filter: {},
      allGroups: [] as IUserGroupDTO[],
      allUsers: [] as IUserDto[],
      mainList: [] as CMenuItem[],
      upsertRow: {} as IUserGroupDTO,
      groupStoreHelper: new CHelperUsersGroups(this.$store, 'userGroupsState'),
      userStoreHelper: new CHelperUsers(this.$store, 'users'),
      CDialogs: {
        Delete: new CDialog(),
        Upsert: new CDialog(),
      },
    };
  },
  methods: {
    /**Получаем все группы */
    getAllGroups() {
      this.groupStoreHelper.actions.all().then(() => {
        this.allGroups = this.groupStoreHelper.getters.ALL();
        this.mainList = this.allGroups.map((item: IUserGroupDTO, index: number) => {
          const subGroups = this.getChildren(item.uid);
          const items = subGroups.map((group: IUserGroupDTO, subIndex: number) => {
            return new CMenuItem(group, [], `${index}_${subIndex}`);
          });
          return new CMenuItem(item, items, `${index}`);
        });
      });
    },
    /**Получаем всех польщователей */
    getAllUsers() {
      this.userStoreHelper.actions.all().then(() => {
        this.allUsers = this.userStoreHelper.getters.ALL();
      });
    },
    /**Получаем дочерние группы по uid родителя */
    getChildren(parentUid: string) {
      return this.allGroups.filter((group: IUserGroupDTO) => {
        return group.parentUid == parentUid;
      });
    },
    getNewObj(uid?: string): IUserGroupDTO {
      return {
        userUids: [],
        parentUid: uid,
        isSystem: false,
        fullName: '',
        childrenUids: [],
        uid: uuidv4(),
      };
    },
    /**Добавляем новую группу */
    addChildrenRow(uid: string) {
      const newObj = this.getNewObj(uid);
      this.upsertRow = deebCopy(newObj);
      this.CDialogs.Upsert.value = true;
    },
    addRow() {
      const newObj = this.getNewObj();
      this.upsertRow = deebCopy(newObj);
      this.CDialogs.Upsert.value = true;
    },
    /**Изменение */
    editRow(editData: IUserGroupDTO) {
      this.upsertRow = deebCopy(editData);
      this.CDialogs.Upsert.value = true;
    },

    /**Событие удаления строки*/
    confirmDelete(editData: IUserGroupDTO) {
      this.upsertRow = deebCopy(editData);
      this.$confirm.require({
        message: 'Вы точно хотите удалить строку?',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: () => {
          this.okDelete();
        },
        reject: () => {
          this.offDelete();
        },
      });
    },
    /**Обнуляем обновляемую строку */
    upsertRowRefresh() {
      this.upsertRow = { userUids: [], parentUid: '', fullName: '', childrenUids: [] };
    },
    /**Подтверждение удаления */
    okDelete() {
      this.groupStoreHelper.actions.remove(this.upsertRow.uid).then(() => {
        this.CDialogs.Delete.value = false;
        this.getAllGroups();
        this.$store.dispatch('toastMessageState/success', new CToastMessage('Запись удалена'));
      });
    },
    /**Отменили удаление */
    offDelete() {
      this.upsertRowRefresh();
    },
    /**Сохраняем редактируемую строку */
    okEditRow() {
      this.getAllGroups();
      this.CDialogs.Upsert.value = false;
      this.upsertRowRefresh();
    },
    /**Отмена изменений в редактируемой строке*/
    offEditRow() {
      this.CDialogs.Upsert.value = false;
      this.upsertRowRefresh();
    },
    /**Событие при разворачивании родителя */
    nodeSelect(node) {
      node.children.forEach((child: CMenuItem) => {
        child.children = this.mainList.find((main: CMenuItem) => {
          return main.data.uid == child.data.uid;
        }).children;
      });
    },
  },
  mounted() {
    this.getAllGroups();
    this.getAllUsers();
  },
});
</script>

<style scoped lang="less">
@import url('./groupsViewForm.style.less');
</style>
