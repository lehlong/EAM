import { BaseFilter } from '../../models/base.model';

export class OrderFilter extends BaseFilter {
  tplnr?: string;
  eqart?: string;
  ingpr?: string;
fromDate?: Date;
  toDate?: Date;
  status?: string;
}
