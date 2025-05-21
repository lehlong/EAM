import { Component, OnInit } from '@angular/core';
import { FlocService } from '../../service/master-data/floc.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { TasklistService } from '../../service/master-data/task-list.service';
import { WcService } from '../../service/master-data/wc.service';
import {
  MPGRP,
  CYCTYPE,
  CYCUNIT,
} from '../../shared/constants/select.constants';
import { ShareModule } from '../../shared/share-module';
import { EquipService } from '../../service/master-data/equip.service';
import { PlanHModel } from '../../models/plan/plan-h.model';
import { GlobalService } from '../../service/global.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { PlanHService } from '../../service/plan/plan-h.service';

@Component({
  selector: 'app-level-maintenance',
  imports: [ShareModule],
  templateUrl: './level-maintenance.component.html',
  styleUrl: './level-maintenance.component.scss',
})
export class LevelMaintenanceComponent implements OnInit {
  lstMpgrp = MPGRP;
  lstCyctype = CYCTYPE;
  lstCycunit = CYCUNIT;
  lstFloc: any[] = [];
  lstTasklist: any[] = [];
  lstChecklist: any[] = [];
  lstPlgrp: any[] = [];
  lstWc: any[] = [];
  lstOrderType: any[] = [];
  lstEquip: any[] = [];
  lstEquipSelect: any[] = [];
  lstTask: any[] = [];
  lstPlan: any[] = [];
  lstEqGroup: any[] = [];

  lstEquipPlan: any[] = [];
  model: any = new PlanHModel();

  constructor(
    public _global: GlobalService,
    private _sPlanH: PlanHService,
    private _sEqGroup: EqGroupService,
    private _sEquip: EquipService,
    private _sPlgrp: PlgrpService,
    private _sFloc: FlocService,
    private _sTasklist: TasklistService,
    private _sWc: WcService,
    private _sOrderType: OrderTypeService
  ) {}
  ngOnInit(): void {
    this.getMasterData();
  }

  getMasterData() {
    this._sEqGroup.getAll().subscribe((data: any) => (this.lstEqGroup = data));
    this._sEquip.getAll().subscribe((data: any) => {
      this.lstEquip = data;
      this.lstEquipSelect = data;
    });
    this._sOrderType
      .getAll()
      .subscribe((data: any) => (this.lstOrderType = data));
    this._sWc.getAll().subscribe((data: any) => (this.lstWc = data));
    this._sFloc.getAll().subscribe((data: any) => (this.lstFloc = data));
    this._sPlgrp.getAll().subscribe((data: any) => (this.lstPlgrp = data));
    this._sTasklist.getAll().subscribe((data: any) => {
      this.lstTasklist = data;
      this.lstChecklist = this.getUniqueByPlnnrAndKtext(data);
    });
  }
  getUniqueByPlnnrAndKtext(items: any[]): any[] {
    const map = new Map<string, any>();
    items.forEach((item) => {
      const key = `${item.plnnr}-${item.ktext}`;
      if (!map.has(key)) {
        map.set(key, { plnnr: item.plnnr, ktext: item.ktext });
      }
    });
    return Array.from(map.values());
  }

  onChangeFloc(e: any) {
    this.lstEquipSelect = this.lstEquip.filter((i) => i.tplnr === e);
  }

  onChangeEquip(e: any) {
    var equip = this.lstEquip.find((i) => i.equnr === e);
    this.model.tplnr = equip?.tplnr;
  }

  onCreate() {
    this._sPlanH.create(this.model).subscribe({
      next: (data) => {
        this.model = new PlanHModel();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
