import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FlocService } from '../../service/master-data/floc.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipService } from '../../service/master-data/equip.service';
import { PriorityLevel } from '../../shared/constants/select.constants';

@Component({
  selector: 'app-incident-create',
  imports: [ShareModule],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.scss',
})
export class IncidentCreateComponent implements OnInit {
  model: any = {
    id: '',
    tplnr: '',
    eqart: '',
    equnr:'',
    priok:'',
    qmtxt: '',
  };
  lstFloc: any[] = [];
  lstEqGroup: any[] = [];
  lstEquip: any[] = [];
  lstPriorityLevel = PriorityLevel

  constructor(
    private _sFloc: FlocService,
    private _sEqGroup: EqGroupService,
    private _sEquip: EquipService
  ) {}
  ngOnInit(): void {
    this.getAllFloc();
    this.getEqGroup();
    this.getAllEquip();

  }

  getAllFloc() {
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEqGroup() {
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllEquip() {
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCreate() {
    console.log(this.model);
  }
}
