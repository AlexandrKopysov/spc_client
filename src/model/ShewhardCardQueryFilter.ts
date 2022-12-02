export class Filter {
  constructor(public value: string, public matchMode: string) {}
}

export class DropdownShewhardCardFilter {
  type: string[] = [];
  production: string[] = [];
  product: string[] = [];
  process: string[] = [];
  operation: string[] = [];
  parameter: string[] = [];
  responsibleUsers: string[] = [];
  constructor(
    public typeSelect: string[],
    public productionSelect: string[],
    public productSelect: string[],
    public processSelect: string[],
    public operationSelect: string[],
    public parameterSelect: string[],
    public responsibleUsersSelect?: string[],
  ) {
    this.typeSelect = this.getValue(typeSelect);
    this.productionSelect = this.getValue(productionSelect);
    this.productSelect = this.getValue(productSelect);
    this.processSelect = this.getValue(processSelect);
    this.operationSelect = this.getValue(operationSelect);
    this.parameterSelect = this.getValue(parameterSelect);
    this.responsibleUsersSelect = this.getValue(responsibleUsersSelect);
  }

  getValue(value: string | string[] | undefined) {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }
}
