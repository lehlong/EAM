import { PlanHService } from './../../service/plan/plan-h.service';
import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import {
  CYCTYPE,
  CYCUNIT,
  MPGRP,
} from '../../shared/constants/select.constants';
import { FlocService } from '../../service/master-data/floc.service';
import { TasklistService } from '../../service/master-data/task-list.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { WcService } from '../../service/master-data/wc.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { EquipService } from '../../service/master-data/equip.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipPlanModel } from '../../models/plan/equip-plan.model';
import { GlobalService } from '../../service/global.service';
import { PlanHModel } from '../../models/plan/plan-h.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EqCounterService } from '../../service/master-data/equip-counter.service';
import { BaseFilter } from '../../models/base.model';

@Component({
  selector: 'app-single-maintenance',
  imports: [ShareModule],
  templateUrl: './single-maintenance.component.html',
  styleUrl: './single-maintenance.component.scss',
})
export class SingleMaintenanceComponent implements OnInit {
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
  lstEqCounter : any[] = [];

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
    private message: NzMessageService,
    private _sEqCounter : EqCounterService,
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

  onCreate(): void {
    const isValid =
      this._global.validateRequired(this.model.wptxt, 'Vui lòng nhập Tên kế hoạch') &&
      this._global.validateRequired(this.model.mpgrp, 'Vui lòng chọn Loại kế hoạch') &&
      this._global.validateRequired(this.model.cyctype, 'Vui lòng chọn Kiểu lập') &&
      this._global.validateRequired(
        this.model.tplnr,
        'Vui lòng chọn Khu vực chức năng'
      ) &&
      this._global.validateRequired(this.model.cycunit, 'Vui lòng chọn Đơn vị đo') &&
      this._global.validateRequired(this.model.cycle, 'Vui lòng nhập Tần suất') &&
      this._global.validateRequired(
        this.model.cycef,
        'Vui lòng nhập Thời gian hiệu lực'
      ) &&
      this._global.validateRequired(
        this.model.stdate,
        'Vui lòng chọn Ngày bắt đầu kế hoạch'
      ) &&
      this._global.validateRequired(this.model.plnnr, 'Vui lòng chọn Mã checklist') &&
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

    this.model.lstEquip = this.lstEquipPlan.map((i) => ({
      id: 'A',
      warpl: this.model.warpl,
      equnr: i.equnr,
      eqart: i.eqart,
    }));

    this.model.lstPlanOrder = this.lstPlan.map((i) => ({
      id: 'A',
      warpl: this.model.warpl,
      schstart: this._global.convertToIsoDateString(i.schstart),
    }));

    this._sPlanH.create(this.model).subscribe({
      next: () => {
        this.model = new PlanHModel();
        this.lstEquipPlan = [];
        this.lstPlan = [];
        this.lstTask = [];
      },
      error: () => {
        this.message.error('Tạo kế hoạch thất bại');
      },
    });
  }

  changeEquip(selectedValue: any, rowData: any): void {
    const selectedEquip = this.lstEquipSelect.find(
      (item) => item.equnr === selectedValue
    );
    if (selectedEquip) {
      rowData.tplnr = selectedEquip.tplnr;
      rowData.eqart = selectedEquip.eqart;
      rowData.ingrp = selectedEquip.ingrp;
    }
  }

  OnChangeCheckList(e: any) {
    this.lstTask = this.lstTasklist
      .filter((x) => x.plnnr == e)
      .sort((a, b) => a.vornr.localeCompare(b.vornr));
  }

  onChangeMpgrp(e: any) {
    this._sPlanH.genarateCode(e).subscribe({
      next: (data) => {
        this.model.warpl = data;
      },
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

  onChangePlan() {
    if (
      this.model.cycunit != null &&
      this.model.cycle &&
      this.model.cycef != null &&
      this.model.stdate != null
    ) {
      var lstDate = this._global.generateDateList(
        this.model.cycunit,
        this.model.cycle,
        this.model.cycef,
        this._global.formatDatePlan(this.model.stdate)
      );

      var lstTemp: any = [];
      lstDate.forEach((i) => {
        lstTemp.push({
          warpl: this.model.warpl,
          wptxt: this.model.wptxt,
          tplnr: this.model.tplnr,
          schstart: i,
        });
      });
      this.lstPlan = lstTemp;
    }
  }

  onChangeFloc(e: any) {
    this.model.equnr = ''
    this.lstPlan.forEach((i) => {
      i.tplnr = e;
    });
    this.lstEquipSelect =
      e == null || e == null
        ? this.lstEquip
        : this.lstEquip.filter((x) => x.tplnr == e);
  }

  onChangeCode(e: any) {
    this.lstPlan.forEach((i) => {
      i.warpl = e;
    });
  }
  onChangeName(e: any) {
    this.lstPlan.forEach((i) => {
      i.wptxt = e;
    });
  }

  searchEqCounter(e: any){
    var f = new BaseFilter();
    f.equnr = e;
    this._sEqCounter.search(f).subscribe({
      next: (data) => {
        this.lstEqCounter = data.data.filter((x : any) => x.isActive == true);
        this.model.point = '';
        if (this.lstEqCounter.length == 0) {
          this.message.error('Không có bộ đếm nào cho thiết bị này!')
        }
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  addEquip() {
    const newEquip = new EquipPlanModel();
    this.lstEquipPlan = [...this.lstEquipPlan, newEquip];
  }
}
