import { BaseFilter } from "../../models/base.model";

export class EquipFilter extends BaseFilter {
  eqart?: string;
  eqartSub?: string;
  eqtyp?: string;
  department?: string;
  user?: string;
  usageStatus?: string;
  activeStatus?: string;
  
}