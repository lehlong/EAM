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
    qmdetail: '',
    qmart: '',
    iwerk: '',
    qmdat: Date,
    isActive: true,
  };
  qmnum: string = '';
  lstOrg: any[] = [];
  lstNotiTp: any[] = [];
  lstFloc: any[] = [];
  lstEqGroup: any[] = [];
  lstEquip: any[] = [];
  fileList: NzUploadFile[] = [];
  lstPriorityLevel = PriorityLevel
  environment = environment;
  constructor(
    private _sFloc: FlocService,
    private _sEqGroup: EqGroupService,
    private _sEquip: EquipService,
    private _sNotiTp: NotiTypeService,
    private _sNoti: NotiService,
    private _sNotiAtt: NotiAttService,
    private message: NzMessageService,
    private _sOrg: OrganizeService
  ) {}
  ngOnInit(): void {
    this.getAllFloc();
    this.getEqGroup();
    this.getAllEquip();
    this.getAllNotiTp();
    this.getAllOrg();
  }

  getAllOrg() {
    this._sOrg.getOrg().subscribe({
      next: (data: any) => {
        this.lstOrg = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
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

  handleChange(info: NzUploadChangeParam): void {
    if (info.type === 'success' || info.type === 'removed') {
      this.fileList = info.fileList;
    }
  }
  uploadFiles(): void {
    if (!this.qmnum || this.fileList.length === 0) return;
    this.fileList.forEach(file => {
      const fileObj = file instanceof File ? file : file.originFileObj;
      if (fileObj) {
        const formData = new FormData();
        formData.append('file', fileObj);
        formData.append('qmnum', this.qmnum);
        
        this._sNotiAtt.uploadFile(formData, this.qmnum)
          .then(res => {
            if (res && res.status) {
              this.message.success(`Tệp ${fileObj.name} đã được tải lên thành công`);
            } else {
              this.message.error(`Tải lên tệp ${fileObj.name} thất bại`);
            }
          })
          .catch(err => {
            console.error('Upload error:', err);
            this.message.error(`Lỗi khi tải lên tệp ${fileObj.name}`);
          });
      }
    });
  }
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false; // Ngăn upload tự động
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
      qmdat: null,
      qmdetail: '',
    };
  }
}
