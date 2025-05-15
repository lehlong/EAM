import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { CYCTYPE, CYCUNIT, MPGRP } from '../../shared/constants/select.constants';
import { FlocService } from '../../service/master-data/floc.service';
import { TasklistService } from '../../service/master-data/task-list.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { WcService } from '../../service/master-data/wc.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';

@Component({
  selector: 'app-single-maintenance',
  imports: [ShareModule],
  templateUrl: './single-maintenance.component.html',
  styleUrl: './single-maintenance.component.scss',
})
export class SingleMaintenanceComponent implements OnInit {
  lstMpgrp = MPGRP
  lstCyctype = CYCTYPE
  lstCycunit = CYCUNIT
  lstFloc : any[] = []
  lstTasklist : any[] =[];
  lstChecklist : any[] = [];
  lstPlgrp : any[] = [];
  lstWc : any[]= [];
  lstOrderType : any[] = [];

  lstTask : any[] = []

  model : any = {
    iwerk: '',
    mpgrp : '',
    cyctype : '',
    tplnr: '',
    plnnr: ''
  }
  constructor(
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
  }

  OnChangeCheckList(e: any) {
  this.lstTask = this.lstTasklist
    .filter(x => x.plnnr == e)
    .sort((a, b) => a.vornr.localeCompare(b.vornr));
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
