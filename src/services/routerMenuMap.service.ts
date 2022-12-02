import { RouteRecordRaw } from 'vue-router';
import IMenuItem from '@/components/Shared/Models/IMenuItem';
/**
 * Преобразование роутера в список меню с ссылками
 * @param routes Роутер
 * @param firstLinkName Имя родительского компонента
 * @param routeName Имя дочернего элемента с списком пунктов меню
 */
function routerMenuMap(routes: RouteRecordRaw[], firstLinkName: string, routeName: string) {
  const menuArray = [] as IMenuItem[];
  routes
    ?.find((firstLink) => firstLink.name == firstLinkName)
    ?.children.find((route) => route.name == routeName)
    ?.children.filter((r) => !!r.name)
    ?.forEach((secondLink) => {
      menuArray.push({
        label: secondLink.name as string,
        to: `/${routeName}/${secondLink.path}`,
      });
    });
  return menuArray;
}

export default routerMenuMap;
