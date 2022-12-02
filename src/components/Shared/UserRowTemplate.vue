<template>
  <div>
    <i v-if="userOrGroup.type === EObjectType.UserGroup" class="pi pi-users"></i>
    <i v-else class="pi pi-user"></i>
    {{ userOrGroup.name }}
  </div>
</template>
<script lang="ts">
import { IUserAndUserGroupItemDTO, EObjectType } from '@/api';
import { defineComponent } from 'vue';

class UserGroup implements IUserAndUserGroupItemDTO {
  type: EObjectType;
  name?: string;
  isRemoved?: boolean;
  uid?: string;
}

export default defineComponent({
  setup() {
    return {
      EObjectType,
    };
  },
  props: {
    userOrGroup: UserGroup,
  },
});
</script>
