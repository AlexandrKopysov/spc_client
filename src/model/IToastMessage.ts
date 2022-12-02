export default interface IToastMessage {
  severity?: string;
  summary?: string;
  detail: string;
  group?: string;
  life?: number;
}

export class CToastMessage {
  constructor(
    public detail: string,
    public severity?: string,
    public summary?: string,
    public group?: string,
    public life?: number,
  ) {}
}
