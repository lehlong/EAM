import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { FlocService } from '../../service/master-data/floc.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipService } from '../../service/master-data/equip.service';
import { PriorityLevel } from '../../shared/constants/select.constants';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { NotiService } from '../../service/tran/noti.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-incident-create',
  imports: [ShareModule],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.scss',
})
export class IncidentCreateComponent implements OnInit {
  model: any = {
    qmnum: '',
    tplnr: '',
    eqart: '',
    equnr:'',
    priok:'',
    qmtxt: '',
    qmart: '',
    iwerk: '',
  };
  lstNotiTp: any[] = [];
  lstFloc: any[] = [];
  lstEqGroup: any[] = [];
  lstEquip: any[] = [];
  lstPriorityLevel = PriorityLevel
  environment = environment;
  constructor(
    private _sFloc: FlocService,
    private _sEqGroup: EqGroupService,
    private _sEquip: EquipService,
    private _sNotiTp: NotiTypeService,
    private _sNoti: NotiService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.getAllFloc();
    this.getEqGroup();
    this.getAllEquip();
    this.getAllNotiTp();
  }

  getAllNotiTp() {
    this._sNotiTp.getAll().subscribe({
      next: (data) => {
        this.lstNotiTp = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
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
    
    // Create new notification
    this._sNoti.create(this.model).subscribe({
      next: (data) => {
        if (data && data.qmnum) {
          this.resetForm();
        } else {
          console.error('Response không hợp lệ:', data);
          this.message.error('Tạo mới sự cố thất bại: Dữ liệu không đầy đủ');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('Đã xảy ra lỗi khi tạo mới sự cố');
      }
    });
  }

  resetForm() {
    this.model = {
      qmnum: '',
      tplnr: '',
      eqart: '',
      equnr:'',
      priok:'',
      qmtxt: '',
      qmart: '',
      iwerk: '',
    };
  }
}
