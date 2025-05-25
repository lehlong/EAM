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
import { OrderPlanModel, PlanHModel } from '../../models/plan/plan-h.model';
import { GlobalService } from '../../service/global.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { PlanHService } from '../../service/plan/plan-h.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
    private _sOrderType: OrderTypeService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.model.mptyp = '2';
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

  isValidAdd() {
    if (
      this.model.cyctype &&
      this.model.cycunit &&
      this.model.stdate &&
      this.model.tplnr &&
      this.model.equnr
    ) {
      return true;
    } else {
      return false;
    }
  }

  addPlanOrder() {
    const plan = new OrderPlanModel();
    plan.cyctype = this.model.cyctype;
    plan.equnr = this.model.equnr;
    plan.tplnr = this.model.tplnr;
    this.model.lstPlanOrder = [...this.model.lstPlanOrder, plan];
  }

  onChangeMpgrp(e: any) {
    this._sPlanH.genarateCode(e).subscribe({
      next: (data) => {
        this.model.warpl = data;
      },
    });
  }

  onChangeEquip(e: any) {
    var equip = this.lstEquip.find((i) => i.equnr === e);
    this.model.tplnr = equip?.tplnr;
  }

  onCreate(): void {
    // Kiểm tra bắt buộc
    const isValid =
      this._global.validateRequired(this.model.wptxt, 'Vui lòng nhập Tên kế hoạch') &&
      this._global.validateRequired(this.model.mpgrp, 'Vui lòng chọn Loại kế hoạch') &&
      this._global.validateRequired(this.model.cyctype, 'Vui lòng chọn Kiểu lập') &&
      this._global.validateRequired(this.model.cycunit, 'Vui lòng chọn Đơn vị đo') &&
      this._global.validateRequired(
        this.model.stdate,
        'Vui lòng chọn Ngày bắt đầu kế hoạch'
      ) &&
      this._global.validateRequired(
        this.model.tplnr,
        'Vui lòng chọn Khu vực chức năng'
      ) &&
      this._global.validateRequired(this.model.equnr, 'Vui lòng chọn Mã thiết bị') &&
      this._global.validateRequired(
        this.model.ingrp,
        'Vui lòng chọn Bộ phận lập kế hoạch'
      ) &&
      this._global.validateRequired(
        this.model.arbpl,
        'Vui lòng chọn Bộ phận thực hiện'
      ) &&
      this._global.validateRequired(this.model.auart, 'Vui lòng chọn Loại lệnh');

    if (!isValid) return;

    this._sPlanH.create(this.model).subscribe({
      next: () => {
        this.model = new PlanHModel();
      },
      error: (err) => {
        console.error(err);
        this.message.error('Tạo kế hoạch thất bại');
      },
    });
  }

  calculateDate(data: any): void {
    const cycle = Number(data.cycle);
    const date = new Date(this.model.stdate);
    const unit = this.model.cycunit;

    if (unit === 'D') date.setDate(date.getDate() + cycle);
    else if (unit === 'W') date.setDate(date.getDate() + cycle * 7);
    else if (unit === 'M') date.setMonth(date.getMonth() + cycle);

    data.schstart = date;
  }
}
