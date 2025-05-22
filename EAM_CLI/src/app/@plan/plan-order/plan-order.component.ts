import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { WcService } from '../../service/master-data/wc.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { FlocService } from '../../service/master-data/floc.service';
import { EquipService } from '../../service/master-data/equip.service';

@Component({
  selector: 'app-plan-order',
  imports: [ShareModule],
  templateUrl: './plan-order.component.html',
  styleUrl: './plan-order.component.scss',
})
export class PlanOrderComponent implements OnInit, OnDestroy {
  lstWc: any[] = [];
  lstEqGroup: any[] = [];
  lstFloc: any[] = [];
  lstEquip: any[] = [];
  constructor(private _sWc: WcService,
    private _sEqGroup: EqGroupService,
    private _sFloc: FlocService,
    private _sEquip : EquipService
  ) {}

  ngOnInit(): void {
    this.getMasterData();
  }
  ngOnDestroy(): void {}
  getMasterData() {
    this._sWc.getAll().subscribe((res) => {
      this.lstWc = res;
    });
    this._sEqGroup.getAll().subscribe((res) => {
      this.lstEqGroup = res;
    });
    this._sFloc.getAll().subscribe((res) => {
      this.lstFloc = res;
    });
    this._sEquip.getAll().subscribe((res) => {
      this.lstEquip = res;
    });
  }
}
