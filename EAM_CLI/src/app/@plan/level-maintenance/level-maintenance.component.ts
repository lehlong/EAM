import { Component, OnInit } from '@angular/core';
import { FlocService } from '../../service/master-data/floc.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { TasklistService } from '../../service/master-data/task-list.service';
import { WcService } from '../../service/master-data/wc.service';
import { MPGRP, CYCTYPE, CYCUNIT } from '../../shared/constants/select.constants';
import { ShareModule } from '../../shared/share-module';
import { EquipDocService } from '../../service/master-data/equip-doc.service';
import { EquipService } from '../../service/master-data/equip.service';

@Component({
  selector: 'app-level-maintenance',
  imports: [ShareModule],
  templateUrl: './level-maintenance.component.html',
  styleUrl: './level-maintenance.component.scss'
})
export class LevelMaintenanceComponent implements OnInit {
  lstMpgrp = MPGRP
  lstCyctype = CYCTYPE
  lstCycunit = CYCUNIT
  lstFloc : any[] = []
  lstTasklist : any[] =[];
  lstChecklist : any[] = [];
  lstPlgrp : any[] = [];
  lstWc : any[]= [];
  lstOrderType : any[] = [];
  lstEquip : any[] = [];

  lstTask : any[] = []

  model : any = {
    iwerk: '',
    mpgrp : '',
    cyctype : '',
    tplnr: '',
    plnnr: ''
  }
  constructor(
    private _sEquip : EquipService,
    private _sPlgrp : PlgrpService,
    private _sFloc : FlocService,
    private _sTasklist : TasklistService,
    private _sWc : WcService,
    private _sOrderType : OrderTypeService,
  ){}
  ngOnInit(): void {
    this.getAllFloc();
    this.getAllTasklist();
    this.getAllPlgrp();
    this.getAllWc();
    this.getAllOrderType();
    this.getAllEquip();
  }

  OnChangeCheckList(e: any) {
  this.lstTask = this.lstTasklist
    .filter(x => x.plnnr == e)
    .sort((a, b) => a.vornr.localeCompare(b.vornr));
}
 getAllEquip(){
    this._sEquip.getAll().subscribe({
      next:(data) => {
        this.lstEquip = data
      }
    })
  }
  getAllOrderType(){
    this._sOrderType.getAll().subscribe({
      next:(data) => {
        this.lstOrderType = data
      }
    })
  }

  getAllWc(){
    this._sWc.getAll().subscribe({
      next:(data) => {
        this.lstWc = data
      }
    })
  }

  getAllFloc(){
    this._sFloc.getAll().subscribe({
      next:(data) => {
        this.lstFloc = data
      }
    })
  }

  getAllPlgrp(){
    this._sPlgrp.getAll().subscribe({
      next:(data) => {
        this.lstPlgrp = data
      }
    })
  }

  getAllTasklist(){
    this._sTasklist.getAll().subscribe({
      next:(data) => {
        this.lstTasklist = data
        this.lstChecklist = this.getUniqueByPlnnrAndKtext(data)
      }
    })
  }

  getUniqueByPlnnrAndKtext(items: any[]): any[] {
  const map = new Map<string, any>();
  items.forEach(item => {
    const key = `${item.plnnr}-${item.ktext}`;
    if (!map.has(key)) {
      map.set(key, { plnnr: item.plnnr, ktext: item.ktext });
    }
  });
  return Array.from(map.values());
}
}
