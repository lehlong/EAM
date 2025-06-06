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
import { TitleStrategy } from '@angular/router';

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
    console.log(this.setOfCheckedId)
    if (this.setOfCheckedId.length == 0) {
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
    }else{
      this._sPlan.genarateOrderSelect(this.setOfCheckedId).subscribe({
        next: (res) => {
          this.message.create('success', 'Triển khai kế hoạch thành công');
          this.search();
          this.setOfCheckedId = [];
          this.lstSelectData = []
        },
        error: (err) => {
          console.error(err);
          this.message.create('error', 'Triển khai kế hoạch thất bại');
        },
      })
    }
  }

  indeterminate = false;
  lstSelectData: any[] = []
  setOfCheckedId : any[] = [];
  checked: boolean = false;


  onItemChecked(data: any, checked: boolean): void {
    if (checked) {
      this.lstSelectData.push(data)
      this.setOfCheckedId.push(data.id)
    } else {
      this.lstSelectData = this.lstSelectData.filter(x => x.id != data.id)
      this.setOfCheckedId = this.setOfCheckedId.filter(x => x != data.id)
    }
    this.refreshSelection();
  }

  onAllChecked(checked: boolean): void {
    this.lstSelectData = []
    this.setOfCheckedId = [];
    if (checked) {
      this.lstOrderPlan.forEach((i: any) => {
        this.lstSelectData.push(i)
        this.setOfCheckedId.push(i.id)
      })
    }
    this.refreshSelection();
  }

  refreshSelection() {
    if (this.lstSelectData.length > 0 && this.lstSelectData.length != this.lstOrderPlan.length) {
      this.indeterminate = true;
      this.checked = false;
    } else if (this.lstSelectData.length == this.lstOrderPlan.length) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.indeterminate = false;
      this.checked = false;
    }
  }
}
