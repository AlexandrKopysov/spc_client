export class ArrayHelper {
  /**
   *  фильтрация на уникальные элементы
   */
  static onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
