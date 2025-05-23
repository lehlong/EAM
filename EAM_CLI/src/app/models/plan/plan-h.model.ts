export class PlanHModel {
  iwerk: string | null = null;
  warpl: string | null = null;
  wptxt: string | null = null;
  mptyp: string | null = '1';
  mpgrp: string | null = null;
  cyctype: string | null = 'T';
  cycunit: string | null = null;
  cycle: number | null = null;
  cycef: number | null = null;
  stdate: Date | null = null;
  measure: string | null = null;
  measvalue: number | null = 0;
  mix: string | null = null;
  tplnr: string | null = null;
  equnr: string | null = null;
  plnnr: string | null = null;
  ingrp: string | null = null;
  arbpl: string | null = null;
  auart: string | null = null;
  isActive: boolean | null = true;
  lstEquip: any[] = [];
  lstPlanOrder: any[] = [];
}

export class OrderPlanModel {
  id: string | null = 'A';
  name: string | null = '';
  iwerk: string | null = '';
  warpl: string | null = '';
  equnr: string | null = '';
  tplnr: string | null = '';
  plnnr: string | null = '';
  cyctype: string | null = '';
  cycunit: string | null = '';
  cycle: number | null = 0;
  measure: string | null = '';
  measvalue: number | null = 0;
  aufnr: string | null = '';
  schstart: Date | null = null;
  schend: Date | null = null;
  iscompled: boolean | null = false;
}
