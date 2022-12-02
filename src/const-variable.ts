/**
 * Высота шапки страницы до графика на странице просмотра карты
 */
const shewhartCardHeader = 350;
/**
 * Рассчет высоты графика после изменения размера окна
 */
export function actualHeightScreen() {
  return window.outerHeight - shewhartCardHeader;
}

/**Возвращает ширину экрана */
export function actualWifthScreen() {
  return window.outerWidth;
}
