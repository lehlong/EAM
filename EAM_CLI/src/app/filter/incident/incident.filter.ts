import { BaseFilter } from '../../models/base.model';

export class NotiFilter extends BaseFilter {
  tplnr?: string;
  eqart?: string;
  ingrp?: string;
fromDate?: Date;
  toDate?: Date;
}
