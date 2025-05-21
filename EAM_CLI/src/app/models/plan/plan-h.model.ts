export class PlanHModel {
  iwerk: string | null = null;
  warpl: string | null = null;
  wptxt: string | null = null;
  mptyp: string | null = '1';
  mpgrp: string | null = null;
  cyctype: string | null = null;
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
