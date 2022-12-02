import { IDateRedirectUpsertDTO } from '@/api';
export default interface IDateRedirect extends IDateRedirectUpsertDTO {
  shewhardUID?: string;
  cp?: number;
  cpk?: number;
  P3Sigm?: number;
  M3Sigm?: number;
  AVG?: number;
}
