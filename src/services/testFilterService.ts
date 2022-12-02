import { DropdownShewhardCardFilter } from '@/model/ShewhardCardQueryFilter';
import { IShewardCardTableDTO } from '../../../web-api';

interface IFilter {
  execute(row: IShewardCardTableDTO, filters: DropdownShewhardCardFilter): boolean;
}

abstract class ABaseFilter {
  constructor(public rowFieldName: string, public filterFieldName: string) {}
}
abstract class AbaseSimpleFilter<TR = any, TF = any> extends ABaseFilter implements IFilter {
  abstract defaultRowValue: TR;
  abstract defaultFilterValue: TF;

  constructor(filedName: string) {
    super(filedName, filedName + 'Select');
  }

  execute(row: IShewardCardTableDTO, filters: DropdownShewhardCardFilter) {
    return this.compare(this.getRowValue(row), this.getFilterValue(filters));
  }

  abstract compare(rowValue: TR, filterValue: TF): boolean;

  getRowValue(row: IShewardCardTableDTO) {
    return row[this.rowFieldName] || this.defaultRowValue;
  }
  getFilterValue(filters: DropdownShewhardCardFilter) {
    return filters[this.filterFieldName] || this.defaultFilterValue;
  }
}

abstract class ABaseStringSimple extends AbaseSimpleFilter<string, string[]> {
  defaultRowValue = '';
  defaultFilterValue = [];
  compare(rowValue: string, filterValue: string[]): boolean {
    if (filterValue.length == 0) {
      return true;
    } else {
      return filterValue.indexOf(rowValue) > -1;
    }
  }
}

abstract class ABaseArraySimple extends AbaseSimpleFilter<Array<string>, Array<string>> {
  defaultRowValue = [];
  defaultFilterValue = [];
  compare(rowValue: string[], filterValue: string[]): boolean {
    return filterValue.length == 0
      ? true
      : rowValue.filter((x) => filterValue.includes(x)).length > 0;
  }
}

class NameCalcFilter extends ABaseStringSimple {
  constructor() {
    super('nameCalc');
  }
}

class OperationFilter extends ABaseStringSimple {
  constructor() {
    super('operation');
  }
}

class ParameterFilter extends ABaseStringSimple {
  constructor() {
    super('parameter');
  }
}

class ProcessFilter extends ABaseStringSimple {
  constructor() {
    super('process');
  }
}

class ProductFilter extends ABaseStringSimple {
  constructor() {
    super('product');
  }
}

class ProductionFilter extends ABaseStringSimple {
  constructor() {
    super('production');
  }
}

class TypeFilter extends ABaseStringSimple {
  constructor() {
    super('type');
  }
}

class ResponsibleUsersFilter extends ABaseArraySimple {
  constructor() {
    super('responsibleUsers');
  }
}

export const FILTERS: Array<IFilter> = [
  new NameCalcFilter(),
  new OperationFilter(),
  new ParameterFilter(),
  new ProcessFilter(),
  new ProductFilter(),
  new ProductionFilter(),
  new TypeFilter(),
  new ResponsibleUsersFilter(),
];
