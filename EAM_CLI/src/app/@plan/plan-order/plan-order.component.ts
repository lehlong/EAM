import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { WcService } from '../../service/master-data/wc.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { FlocService } from '../../service/master-data/floc.service';
import { EquipService } from '../../service/master-data/equip.service';
import { PlanFilter } from '../../filter/plan/plan.filter';
import { PlanHService } from '../../service/plan/plan-h.service';
import { GlobalService } from '../../service/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  filter = new PlanFilter();
  lstOrderPlan: any[] = [];
  constructor(
    private message: NzMessageService,
    private _sWc: WcService,
    private _sEqGroup: EqGroupService,
    private _sFloc: FlocService,
    private _sEquip: EquipService,
    private _sPlan: PlanHService,
    public _global: GlobalService
  ) {}

  ngOnInit(): void {
    this.getMasterData();
  }
  ngOnDestroy(): void {}
  search(): void {
    if (this.filter.schStart) {
      this.filter.schStart = this._global.formatDatePlanFilter(
        new Date(this.filter.schStart)
      );
    }
    this._sPlan.searchPlan(this.filter).subscribe({
      next: (res) => {
        console.log(res);
        this.lstOrderPlan = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
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
  genarateOrder() {
    if (this.lstOrderPlan.length == 0) {
      this.message.create('error', 'Không có dữ liệu để triển khai kế hoạch');
      return;
    }

    this._sPlan.genarateOrder(this.filter).subscribe({
      next: (res) => {
        this.message.create('success', 'Triển khai kế hoạch thành công');
        this.search();
      },
      error: (err) => {
        console.error(err);
        this.message.create('error', 'Triển khai kế hoạch thất bại');
      },
    })

  }
}
