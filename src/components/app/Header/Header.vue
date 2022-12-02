<template>
  <div class="grid spc-header">
    <div class="col flex flex-row">
      <div
        class="burger-menu"
        v-bind:class="{ active: visibleLeftSidebar }"
        @click="menuClick()"
        v-if="checkUserRoleEntry(EUserRole.Admin, EUserRole.Analyst)"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <img src="/assets/SB-logo.png" class="logo" @click="goBack()" />
    </div>

    <div class="col flex flex-row-reverse">
      <div class="flex align-items-center">
        <div class="mr-2">
          {{ userFIO }}
        </div>
        <Button
          type="button"
          icon="pi pi-user"
          class="p-button-outlined user-button p-0"
          @click="toggle"
        />
        <Menu id="user-menu" ref="menu" :model="items" :popup="true" />
      </div>
    </div>
  </div>
  <Sidebar
    v-model:visible="visibleLeftSidebar"
    v-if="menuArray.length > 0"
    :baseZIndex="10000"
    position="left"
    class="p-sidebar-left spc sidebar blur"
  >
    <div class="menu-link" v-for="paragraph of menuArray" :key="paragraph.link">
      <router-link :to="paragraph.link" @click="menuClick()">{{ paragraph.name }}</router-link>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { EUserRole } from '@/api';
import Menu from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';
import { defineComponent } from 'vue';
import { RouteMeta } from 'vue-router';
interface IMainMenuItem {
  name: string;
  link: string;
}
interface metRouteType extends RouteMeta {
  roleAcess: Array<EUserRole>;
  label: string;
}

export default defineComponent({
  name: 'HeaderMenu',
  setup() {
    return {
      EUserRole: EUserRole,
    };
  },
  data() {
    const userRole = this.$store.getters['user/GET_ROLE'];
    const userFIO = this.$store.getters['user/GET_FULLNAME'];
    const menuArray: Array<IMainMenuItem> = [];
    this.$router.options.routes
      .find((link) => link.name == 'mainLayout')
      .children.filter((child) => {
        const meta = child.meta as metRouteType;
        return meta?.roleAcess.includes(userRole) && child.alias;
      })
      .forEach((link) => {
        menuArray.push({ name: link.alias as string, link: link.path });
      });
    return {
      visibleLeftSidebar: false,
      menuArray,
      userFIO,
      items: [
        {
          label: 'Действия',
          items: [
            {
              label: 'Выход',
              icon: 'pi pi-sign-out',
              command: () => {
                this.$store.dispatch('user/logOut');
              },
            },
          ],
        },
      ] as MenuItem[],
    };
  },
  computed: {
    userRes() {
      return this.$store.state.user.user;
    },
    menuRef(): Menu {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.$refs['menu'] as any;
    },
  },
  methods: {
    menuClick() {
      this.visibleLeftSidebar = this.visibleLeftSidebar == false ? true : false;
    },
    goBack() {
      this.$router.push('/');
    },
    logOut() {
      this.$store.dispatch('user/logOut');
    },
    toggle(event) {
      this.menuRef.toggle(event);
    },
  },
});
</script>
<style scoped lang="less">
@import url(./header.less);
</style>
