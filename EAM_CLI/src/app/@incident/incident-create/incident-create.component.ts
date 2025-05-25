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
import { PlantService } from '../../service/master-data/plant.service';
import { GlobalService } from '../../service/global.service';
import { AccountService } from '../../service/system-manager/account.service';
import { WcService } from '../../service/master-data/wc.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { NotiModel } from '../../models/tran/noti.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-incident-create',
  imports: [ShareModule],
  templateUrl: './incident-create.component.html',
  styleUrls: ['./incident-create.component.scss'],
})
export class IncidentCreateComponent implements OnInit {
  model = new NotiModel();
  loading = false;
  username = '';
  qmnum = '';
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
    private route: ActivatedRoute
  ) {
    this.username = _global.getUserName();
    this.model.qmnam = this.username;
    this.model.qmdat = new Date();
    this._global.setBreadcrumb([
      { name: 'Tạo mới sự cố', path: 'incident/create' },
    ]);
    this._global.getLoading().subscribe((value) => (this.loading = value));
  }

  ngOnInit(): void {
    this.getMasterData();
    this.route.queryParams.subscribe((params) => {
      if (params['equnr']) {
        this.model.equnr = params['equnr'];
      }
      if (params['eqart']) {
        this.model.eqart = params['eqart'];
      }
      if (params['tplnr']) {
        this.model.tplnr = params['tplnr'];
      }
      //  if (params['eqktx']) {this.model.eqktx = params['eqktx'];}
      if (params['arbpl']) {
        this.model.arbpl = params['arbpl'];
      }
      if (params['ingrp']) {
        this.model.ingrp = params['ingrp'];
      }
      if (params['iwerk']) {
        this.model.iwerk = params['iwerk'];
      }
    });
  }

  getMasterData() {
    this._sPlgrp.getAll().subscribe((data: any) => (this.lstPlgrp = data));
    this._sWc.getAll().subscribe((data: any) => (this.lstWc = data));
    this._sUser.getListUser().subscribe((data: any) => (this.lstUser = data));
    this._sNotiTp.getAll().subscribe((data: any) => (this.lstNotiTp = data));
    this._sFloc.getAll().subscribe((data: any) => (this.lstFloc = data));
    this._sEqGroup.getAll().subscribe((data: any) => (this.lstEqGroup = data));
    this._sEquip.getAll().subscribe((data: any) => {
      this.lstEquip = data;
      this.lstEquipSelect = data;
    });
    this._sPlant.getAll().subscribe((data: any) => (this.lstPlant = data));
  }

  OnChangeEquip(): void {
    this.model.equnr = '';
    this.lstEquipSelect = this.lstEquip.filter(
      (x) =>
        (!this.model.tplnr || x.tplnr === this.model.tplnr) &&
        (!this.model.eqart || x.eqart === this.model.eqart)
    );
  }

  changeEquip(equnr: any): void {
    const equip = this.lstEquip.find((x) => x.equnr == equnr);
    if (equip) {
      this.model.eqart = equip.eqart;
      this.model.tplnr = equip.tplnr;
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.type === 'success' || info.type === 'removed') {
      this.fileList = info.fileList;
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false;
  };

  uploadFiles(): void {
    if (!this.qmnum || this.fileList.length === 0) return;

    this.fileList.forEach((file) => {
      const fileObj = file.originFileObj || (file as any as File);
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

  onCreate(): void {
    const isValid =
      this._global.validateRequired(
        this.model.tplnr,
        'Vui lòng chọn Khu vực chức năng'
      ) &&
      this._global.validateRequired(this.model.eqart, 'Vui lòng chọn Nhóm thiết bị') &&
      this._global.validateRequired(this.model.equnr, 'Vui lòng chọn Thiết bị') &&
      this._global.validateRequired(
        this.model.arbpl,
        'Vui lòng chọn Bộ phận thực hiện'
      ) &&
      this._global.validateRequired(
        this.model.ingrp,
        'Vui lòng chọn Bộ phận tiếp nhận'
      ) &&
      this._global.validateRequired(this.model.qmart, 'Vui lòng chọn Loại thông báo') &&
      this._global.validateRequired(this.model.qmtxt, 'Vui lòng nhập Mô tả sự cố') &&
      this._global.validateRequired(
        this.model.qmdetail,
        'Vui lòng nhập Chi tiết sự cố'
      ) &&
      this._global.validateRequired(this.model.priok, 'Vui lòng chọn Mức độ ưu tiên') &&
      this._global.validateRequired(
        this.model.staffSc,
        'Vui lòng chọn Người sửa chữa'
      ) &&
      this._global.validateRequired(
        this.model.ltrmn,
        'Vui lòng chọn Ngày yêu cầu hoàn thành'
      ) &&
      this._global.validateRequired(this.model.iwerk, 'Vui lòng chọn Đơn vị bảo trì');

    if (!isValid) return;

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

  resetForm(): void {
    this.model = new NotiModel();
  }
}
