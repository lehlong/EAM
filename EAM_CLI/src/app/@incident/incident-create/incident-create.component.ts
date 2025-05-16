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
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NotiAttService } from '../../service/tran/noti-att.service';
import { OrganizeService } from '../../service/system-manager/organize.service';
import { PlantService } from '../../service/master-data/plant.service';
import { GlobalService } from '../../service/global.service';
import { AccountService } from '../../service/system-manager/account.service';
import { WcService } from '../../service/master-data/wc.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';

@Component({
  selector: 'app-incident-create',
  imports: [ShareModule],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.scss',
})
export class IncidentCreateComponent implements OnInit {
  model: any = {
    arbpl: '',
    qmnum: '',
    tplnr: '',
    eqart: '',
    equnr: '',
    priok: '',
    qmtxt: '',
    qmdetail: '',
    qmart: 'N2',
    iwerk: '',
    qmnam: '',
    ingrp: '',
    staffSc: '',
    ltrmn: new Date(),
    qmdat: new Date(),
    isActive: true,
  };
  loading = false;
  username = '';
  qmnum = '';
  lstOrg: any[] = [];
  lstNotiTp: any[] = [];
  lstFloc: any[] = [];
  lstEqGroup: any[] = [];
  lstEquipSelect: any[] = [];
  lstEquip: any[] = [];
  lstPlant: any[] = [];
  lstUser: any[] = [];
  lstWc: any[] = [];
  fileList: NzUploadFile[] = [];
  lstPlgrp: any[] = [];
  lstPriorityLevel = PriorityLevel;
  environment = environment;

  constructor(
    private _sPlgrp: PlgrpService,
    private _sWc: WcService,
    private _global: GlobalService,
    private _sUser: AccountService,
    private _sPlant: PlantService,
    private _sFloc: FlocService,
    private _sEqGroup: EqGroupService,
    private _sEquip: EquipService,
    private _sNotiTp: NotiTypeService,
    private _sNoti: NotiService,
    private _sNotiAtt: NotiAttService,
    private message: NzMessageService,
    private _sOrg: OrganizeService,
    private globalService: GlobalService
  ) {
    this.username = _global.getUserName();
    this.model.qmnam = _global.getUserName();
    this.globalService.setBreadcrumb([
      { name: 'Tạo mới sự cố', path: 'incident/create' },
    ]);
    this.globalService
      .getLoading()
      .subscribe((value) => (this.loading = value));
  }

  ngOnInit(): void {
    this.getMasterData();
  }

  getMasterData() {
    this._sPlgrp.getAll().subscribe({
      next: (data: any) => (this.lstPlgrp = data),
      error: (err) => console.log(err),
    });
    this._sWc.getAll().subscribe({
      next: (data: any) => (this.lstWc = data),
      error: (err) => console.log(err),
    });
    this._sUser.getListUser().subscribe({
      next: (data: any) => (this.lstUser = data),
      error: (err) => console.log(err),
    });
    this._sOrg.getOrg().subscribe({
      next: (data: any) => (this.lstOrg = data),
      error: (err) => console.log(err),
    });
    this._sNotiTp.getAll().subscribe({
      next: (data) => (this.lstNotiTp = data),
      error: (err) => console.log(err),
    });
    this._sFloc.getAll().subscribe({
      next: (data) => (this.lstFloc = data),
      error: (err) => console.log(err),
    });
    this._sEqGroup.getAll().subscribe({
      next: (data) => (this.lstEqGroup = data),
      error: (err) => console.log(err),
    });
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
        this.lstEquipSelect = data;
      },
      error: (err) => console.log(err),
    });
    this._sPlant.getAll().subscribe({
      next: (data) => (this.lstPlant = data),
      error: (err) => console.log(err),
    });
  }

  OnChangeEquip(data: any) {
    this.model.equnr = '';
    this.lstEquipSelect = this.lstEquip;
    if (this.model.tplnr != null && this.model.tplnr != '') {
      this.lstEquipSelect = this.lstEquipSelect.filter(
        (x) => x.tplnr == this.model.tplnr
      );
    }
    if (this.model.eqart != null && this.model.eqart != '') {
      this.lstEquipSelect = this.lstEquipSelect.filter(
        (x) => x.eqart == this.model.eqart
      );
    }
  }

  changeEquip(data: any) {
    const equip = this.lstEquip.find((x) => x.equnr == data);
    this.model.eqart = equip.eqart;
    this.model.tplnr = equip.tplnr;
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.type === 'success' || info.type === 'removed') {
      this.fileList = info.fileList;
    }
  }

  uploadFiles(): void {
    if (!this.qmnum || this.fileList.length === 0) return;
    this.fileList.forEach((file) => {
      const fileObj = file instanceof File ? file : file.originFileObj;
      if (fileObj) {
        const formData = new FormData();
        formData.append('file', fileObj);
        formData.append('qmnum', this.qmnum);
        this._sNotiAtt
          .uploadFile(formData, this.qmnum)
          .then((res) => {
            if (res && res.status) {
              this.message.success(
                `Tệp ${fileObj.name} đã được tải lên thành công`
              );
            } else {
              this.message.error(`Tải lên tệp ${fileObj.name} thất bại`);
            }
          })
          .catch((err) => {
            console.error('Upload error:', err);
            this.message.error(`Lỗi khi tải lên tệp ${fileObj.name}`);
          });
      }
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false;
  };

  onCreate() {
    this._sNoti.create(this.model).subscribe({
      next: (data) => {
        if (data && data.qmnum) {
          this.qmnum = data.qmnum;
          this.uploadFiles();
          this.resetForm();
        } else {
          console.error('Response không hợp lệ:', data);
          this.message.error('Tạo mới sự cố thất bại: Dữ liệu không đầy đủ');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('Đã xảy ra lỗi khi tạo mới sự cố');
      },
    });
  }

  resetForm() {
    this.model = {
      qmnum: '',
      tplnr: '',
      eqart: '',
      equnr: '',
      priok: '',
      qmtxt: '',
      qmart: '',
      iwerk: '',
      qmdat: null,
      qmdetail: '',
    };
  }
}
