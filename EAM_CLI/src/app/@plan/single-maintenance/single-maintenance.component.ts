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
import { EquipDocService } from '../../service/master-data/equip-doc.service';
import { EquipService } from '../../service/master-data/equip.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';

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

  lstEquipPlan: any[] = [
    {
      anlnr: '',
      anlun: '',
      arbpl: '',
      auspFlg: '',
      beber: '',
      childCnt: '',
      class: '',
      datab: '',
      datbi: '',
      delDate: '',
      delFlg: '',
      eqart: '',
      eqartSub: '',
      eqartTp: '',
      eqktx: '',
      eqtyp: '',
      equnr: '',
      hequi: '',
      inactDate: '',
      inactFlg: '',
      inbdt: '',
      ingrp: '',
      isActive: '',
      iwerk: '',
      klart: '',
      kostl: '',
      parentFlg: '',
      statAct: '',
      statActT: '',
      state: '',
      statusTh: '',
      tplnr: '',
    },
  ];

  model: any = {
    iwerk: '',
    warpl: '',
    wptxt: '',
    mptyp: '',
    mpgrp: '',
    cyctype: '',
    cycunit: '',
    cycle: '',
    cycef: '',
    stdate: '',
    measure: '',
    measvalue: '',
    mix: '',
    tplnr: '',
    equnr: '',
    plnnr: '',
    ingrp: '',
    arbpl: '',
    auart: '',
  };
  constructor(
    private _sEqGroup: EqGroupService,
    private _sEquip: EquipService,
    private _sPlgrp: PlgrpService,
    private _sFloc: FlocService,
    private _sTasklist: TasklistService,
    private _sWc: WcService,
    private _sOrderType: OrderTypeService
  ) {}
  ngOnInit(): void {
    this.getAllFloc();
    this.getAllTasklist();
    this.getAllPlgrp();
    this.getAllWc();
    this.getAllOrderType();
    this.getAllEquip();
    this.getAllEqGroup();
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

  getNamePlgrp(code : any){
    return this.lstPlgrp.find(x => x.ingrp == code)?.ingrpTxt
  }

  OnChangeCheckList(e: any) {
    this.lstTask = this.lstTasklist
      .filter((x) => x.plnnr == e)
      .sort((a, b) => a.vornr.localeCompare(b.vornr));
  }

  getAllEqGroup() {
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
    });
  }

  getNameEqGroup(code: any) {
    return this.lstEqGroup.find((x) => x.eqart == code)?.eqartTxt;
  }

  getAllEquip() {
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
        this.lstEquipSelect = data;
      },
    });
  }

  getAllOrderType() {
    this._sOrderType.getAll().subscribe({
      next: (data) => {
        this.lstOrderType = data;
      },
    });
  }

  getAllWc() {
    this._sWc.getAll().subscribe({
      next: (data) => {
        this.lstWc = data;
      },
    });
  }

  getAllFloc() {
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
    });
  }

  getAllPlgrp() {
    this._sPlgrp.getAll().subscribe({
      next: (data) => {
        this.lstPlgrp = data;
      },
    });
  }

  getAllTasklist() {
    this._sTasklist.getAll().subscribe({
      next: (data) => {
        this.lstTasklist = data;
        this.lstChecklist = this.getUniqueByPlnnrAndKtext(data);
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
      this.model.cycunit != '' &&
      this.model.cycle &&
      this.model.cycef != '' &&
      this.model.stdate != ''
    ) {
      var lstDate = this.generateDateList(
        this.model.cycunit,
        this.model.cycle,
        this.model.cycef,
        this.formatDate(this.model.stdate)
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

  getNameFloc(code: any) {
    return this.lstFloc.find((x) => x.tplnr == code)?.descript;
  }

  onChangeFloc(e: any) {
    this.lstPlan.forEach((i) => {
      i.tplnr = e;
    });
    this.lstEquipSelect =
      e == null || e == ''
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

  addEquip() {
    const newEquip = {
      anlnr: '',
      anlun: '',
      arbpl: '',
      auspFlg: '',
      beber: '',
      childCnt: '',
      class: '',
      datab: '',
      datbi: '',
      delDate: '',
      delFlg: '',
      eqart: '',
      eqartSub: '',
      eqartTp: '',
      eqktx: '',
      eqtyp: '',
      equnr: '',
      hequi: '',
      inactDate: '',
      inactFlg: '',
      inbdt: '',
      ingrp: '',
      isActive: '',
      iwerk: '',
      klart: '',
      kostl: '',
      parentFlg: '',
      statAct: '',
      statActT: '',
      state: '',
      statusTh: '',
      tplnr: '',
    };

    this.lstEquipPlan = [...this.lstEquipPlan, newEquip];
  }

  generateDateList(
    unit: 'D' | 'W' | 'M',
    frequency: number,
    durationInYears: number,
    startDate: string
  ): string[] {
    const result: string[] = [];
    const [day, month, year] = startDate.split('/').map(Number);
    const start = new Date(year, month - 1, day);

    const totalIterations = (() => {
      switch (unit) {
        case 'D':
          return Math.ceil((365 * durationInYears) / frequency);
        case 'W':
          return Math.ceil((52 * durationInYears) / frequency);
        case 'M':
          return Math.ceil((12 * durationInYears) / frequency);
        default:
          return 0;
      }
    })();

    for (let i = 0; i < totalIterations; i++) {
      const date = new Date(start.getTime());
      switch (unit) {
        case 'D':
          date.setDate(start.getDate() + i * frequency);
          break;
        case 'W':
          date.setDate(start.getDate() + i * frequency * 7);
          break;
        case 'M':
          date.setMonth(start.getMonth() + i * frequency);
          break;
      }
      result.push(this.formatDate(date));
    }

    return result;
  }

  formatDate(date: Date): string {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
