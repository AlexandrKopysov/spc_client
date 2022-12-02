<template>
  <Dialog
    v-model:visible="CDialog.value"
    class="p-fluid spc"
    header="Добавление/редактирование"
    :style="{ width: '450px' }"
    :modal="true"
    :closable="false"
  >
    <div class="grid">
      <div class="col-12">
        <label>Наименование</label>
        <InputText
          v-model="upsertRow.fullName"
          placeholder="Введите наименование группы"
          class="w-full w-input"
        ></InputText>
      </div>
      <div class="col-12">
        <label>Пользователи</label>
        <MultiSelect
          v-model="upsertRow.userUids"
          optionLabel="fullName"
          optionValue="uid"
          placeholder="Выберите пользователей"
          class="w-input"
          selectedItemsLabel="{} Строк выбрано"
          :maxSelectedLabels="2"
          :options="allUsers"
          :filter="true"
        >
          <template #option="data">
            {{ data.option.fullName }}
          </template>
        </MultiSelect>
      </div>
      <div class="col-6">
        <Button label="Сохранить" icon="pi" class="button-add mb-2" @click="okEditRow()"> </Button>
      </div>
      <div class="col-6">
        <Button label="Отмена" icon="pi" class="button-error mb-2" @click="offEditRow()"> </Button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CToastMessage } from '@/model/IToastMessage';
import { CDialog } from '@/store/storeHelper/baseModel';
import { IUserDto, IUserGroupDTO } from '@/api';
import { CHelperUsersGroups } from '@/store/storeHelper/usersGroupsStoreHelper';

export default defineComponent({
  name: 'GroupUpsertModal',
  props: {
    upsertRowProp: {} as PropType<IUserGroupDTO>,
    dialogProp: {} as PropType<CDialog>,
    allUsersProp: [] as PropType<Array<IUserDto>>,
  },
  data() {
    return {
      CDialog: {} as CDialog,
      upsertRow: {} as IUserGroupDTO,
      allUsers: [] as IUserDto[],
      storeHelper: new CHelperUsersGroups(this.$store, 'userGroupsState'),
    };
  },
  methods: {
    okEditRow() {
      this.storeHelper.actions.upsert(this.upsertRow).then(() => {
        this.$store.dispatch(
          'toastMessageState/success',
          new CToastMessage('Запись добавлена/изменена'),
        );
        this.$emit('editSuccess');
      });
    },
    offEditRow() {
      this.$emit('editCancel');
    },
  },
  mounted() {
    this.CDialog = this.dialogProp;
    this.upsertRow = this.upsertRowProp;
    this.allUsers = this.allUsersProp;
  },
});
</script>
