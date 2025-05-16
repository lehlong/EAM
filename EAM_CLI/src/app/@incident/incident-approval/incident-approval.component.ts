import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { FlocService } from '../../service/master-data/floc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiService } from '../../service/tran/noti.service';
import { EquipService } from '../../service/master-data/equip.service';
import { WcService } from '../../service/master-data/wc.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { PlantService } from '../../service/master-data/plant.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { OrganizeService } from '../../service/system-manager/organize.service';
import { NotiAttService } from '../../service/tran/noti-att.service';
import { PriorityLevel } from '../../shared/constants/select.constants';
import { NzUploadFile, NzUploadChangeParam, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { firstValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotiReportService } from '../../service/tran/noti-report.service';
import { AccountTypeService } from '../../service/master-data/account-type.service';
import { NotiCatalogModel } from '../../models/tran/noti-catalog.model';
import { NotiCatalogService } from '../../service/tran/not-catalog.service';
import { CatalogService } from '../../service/master-data/catalog.service';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
@Component({
  selector: 'app-incident-approval',
  imports: [ShareModule],
  templateUrl: './incident-approval.component.html',
  styleUrl: './incident-approval.component.scss',
})
export class IncidentApprovalComponent implements OnInit {
  checked: boolean = false;
  visibleDetail: boolean = false;
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
  lstEquip: any[] = [];
  lstCatalog: any[] = [];

  lstOrg: any[] = [];
  lstNotiTp: any[] = [];
  lstEqGroup: any[] = [];
  lstEquipSelect: any[] = [];
  lstPlant: any[] = [];
  lstPlgrp: any[] = [];
  lstAccountType: any[] = [];
  lstPriorityLevel = PriorityLevel;

  pendingFileList: File[] = [];
  fileList: NzUploadFile[] = [];
  removedFiles: NzUploadFile[] = [];
  fileListTable: any[] = [];
  previewImage: string | undefined = '';
  previewTitle: string | undefined = '';
  previewVisible = false;

  catalogItems: NotiCatalogModel[] = [];
  currentCatalogItem: NotiCatalogModel = new NotiCatalogModel();
  isAddingCatalog: boolean = false;
  editCatalogIndex: number = -1;

  // Thêm các biến để quản lý các modal
  isCauseModalVisible: boolean = false;
  isTaskModalVisible: boolean = false;
  isActModalVisible: boolean = false;

  // Thêm các biến để lưu dữ liệu cho mỗi modal
  currentCatalogItemForModal: any;
  causeItems: any[] = [];
  taskItems: any[] = [];
  actItems: any[] = [];

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
  Nmodel: any = {
    id: '',
    rpType: 'N',
    qmnum: '',
    rpDate: null,
    rpTime: null,
    mgUnit: '',
    unit1: '',
    unit2: '',
    mgRole: '',
    unit1R: '',
    unit2R: '',
    content: '',
    output: '',
    isActive: true,
  };

  Hmodel: any = {
    id: '',
    rpType: 'H',
    qmnum: '',
    rpDate: null,
    rpTime: null,
    mgUnit: '',
    unit1: '',
    unit2: '',
    mgRole: '',
    unit1R: '',
    unit2R: '',
    content: '',
    output: '',
    isActive: true,
  };

  constructor(
    private _sNoti: NotiService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    private _sPlgrp: PlgrpService,
    private _global: GlobalService,
    private _sUser: AccountService,
    private _sPlant: PlantService,
    private _sEqGroup: EqGroupService,
    private _sNotiTp: NotiTypeService,
    private _sNotiAtt: NotiAttService,
    private _sOrg: OrganizeService,
    private modal: NzModalService,
    private _sNotiReport: NotiReportService,
    private _sAccType: AccountTypeService,
    private notiCatalogService: NotiCatalogService,
    private sCatalog: CatalogService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Phê duyệt sự cố',
        path: 'incident/approval',
      },
    ]);
    this.globalService.getLoading().subscribe((value) => {
      this.loading = value;
    });
  }
  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }
  ngOnInit(): void {
    this.search();
    this.getAllFloc();
    this.getAllUser();
    this.getAllWc();
    this.getAllEquip();
    this.getAllPlgrp();
    this.getAllPlan();
    this.getAllNotiTp();
    this.getEqGroup();
    this.getAllAccountType();
    this.getAllCatalogs();
    this.causeItems = [];
    this.taskItems = [];
    this.actItems = [];
  }
  search() {
    this._sNoti.searchApproval(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  getAllPlgrp() {
    this._sPlgrp.getAll().subscribe({
      next: (data: any) => {
        this.lstPlgrp = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllCatalogs() {
    this.sCatalog.getAll().subscribe({
      next: (data: any) => {
        this.lstCatalog = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllPlan() {
    this._sPlant.getAll().subscribe({
      next: (data) => (this.lstPlant = data),
      error: (err) => console.log(err),
    });
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

  loadReportData(qmnum: string) {
    this._sNotiReport.getReportsByQmnum(qmnum).subscribe({
      next: (data) => {
        if (data && data.data) {
          const reports = Array.isArray(data.data) ? data.data : [];
          const statusReport = reports.find((r: any) => r.rpType === 'N');
          if (statusReport) {
            this.Nmodel = statusReport;
          }
          const acceptanceReport = reports.find((r: any) => r.rpType === 'H');
          if (acceptanceReport) {
            this.Hmodel = acceptanceReport;
          }
        }
      },
      error: (err) => {
        console.error('Load report data error:', err);
      }
    });
  }
  loadNotiCatalogs(qmnum: string) {
    const filter = { qmnum: qmnum };
    this.notiCatalogService.search(filter).subscribe(
      (response) => {
        if (response && response.data) {
          this.catalogItems = response.data.data;
        }
      },
      (error) => {
        console.error('Error loading analysis items', error);
      }
    );
  }

  addCatalogItem() {
    const newItem: NotiCatalogModel = {
      id: '',
      qmnum: this.model.qmnum,
      objpart: '',
      typeCode: '',
      typeTxt: '',
      causeCode: '',
      taskCode: '',
      actCode: '',
      isActive: true
    };
    if (!Array.isArray(this.catalogItems)) {
      this.catalogItems = [];
    }
    this.catalogItems = [...this.catalogItems, newItem];
    console.log('Added new item, catalogItems:', this.catalogItems);
  }
  openDetail(data: any) {
    this.model = data;
    this.visibleDetail = true;
    this.loadAttachments(data.qmnum);
    this.loadReportData(data.qmnum);
    this.loadNotiCatalogs(data.qmnum);
  }
  loadAttachments(qmnum: string) {
    this._sNotiAtt.getByQmnum(qmnum).subscribe({
      next: (result) => {
        const attachmentData = Array.isArray(result) ? result :
          (result && result.data ? result.data : []);

        const uniqueAttachments = Array.from(
          new Map(attachmentData.map((item: { path: any; }) => [item.path, item])).values()
        );

        if (uniqueAttachments && uniqueAttachments.length > 0) {
          this.fileList = uniqueAttachments.map((item: any) => {
            const fileUrl = `${environment.urlFiles}/${item.path}`;
            const mimeType = this.getMimeType(item.fileType);

            const uploadFile: NzUploadFile = {
              uid: item.id,
              name: item.path.split('/').pop() || 'file',
              status: 'done',
              url: fileUrl,
              size: item.fileSize,
              type: mimeType,
            };

            if (this.isImageType(item.fileType)) {
              uploadFile.thumbUrl = fileUrl;
            }

            return uploadFile;
          });

          this.fileListTable = uniqueAttachments.map((item: any) => {
            return {
              path: item.path,
              url: `${environment.urlFiles}/${item.path}`,
              name: item.path.split('/').pop() || 'file',
              fileType: item.fileType,
              fileSize: item.fileSize / 1024,
              createDate: item.createDate || new Date()
            };
          });
        } else {
          console.log('No attachments found or invalid response');
          this.fileList = [];
        }
      },
      error: (err) => {
        console.error('Error loading attachments:', err);
        this.message.error('Không thể tải danh sách file đính kèm');
        this.fileList = [];
      }
    });
  }
  async processFiles(): Promise<void> {
    try {
      if (this.pendingFileList.length > 0) {
        for (const file of this.pendingFileList) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await this._sNotiAtt.uploadFile(formData, this.model.qmnum);
          if (!response || !response.status) {
            console.error('Upload failed:', file.name);
            this.message.warning(`Tải file ${file.name} thất bại`);
          }
        }
        this.pendingFileList = [];
      }
      for (const file of this.removedFiles) {
        const fileName = file.uid ? file.uid.split('/').pop() || '' : '';
        if (fileName) {
          try {
            const response = await firstValueFrom(this._sNotiAtt.delete(fileName));
            this.message.success(`Xóa file ${file.name} thành công`);
          } catch (error) {
            console.error('Error deleting file:', fileName, error);
            this.message.warning(`Xóa file ${file.name} thất bại`);
          }
        }
      }

      this.loadAttachments(this.model.qmnum);
      return Promise.resolve();
    } catch (error) {
      console.error('Process files error:', error);
      return Promise.reject(error);
    }
  }

  isImageType(fileType: string): boolean {
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileType.toLowerCase());
  }
  getMimeType(fileType: string): string {
    const lowerType = fileType.toLowerCase();
    if (['jpg', 'jpeg'].includes(lowerType)) return 'image/jpeg';
    if (lowerType === 'png') return 'image/png';
    if (lowerType === 'gif') return 'image/gif';
    if (lowerType === 'bmp') return 'image/bmp';
    if (lowerType === 'txt') return 'text/plain';
    if (lowerType === 'pdf') return 'application/pdf';
    if (['doc', 'docx'].includes(lowerType)) return 'application/msword';
    if (['xls', 'xlsx'].includes(lowerType)) return 'application/vnd.ms-excel';
    return 'application/octet-stream';
  }

  customUploadRequest = (item: NzUploadXHRArgs): Subscription => {
    if (item.file instanceof File) {
      this.pendingFileList.push(item.file);
    }
    setTimeout(() => {
      item.onSuccess!('OK', item.file, {} as any);
    }, 0);

    return new Subscription();
  };
  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
    this.previewTitle = file.name || '';
  };

  handleRemove = (file: NzUploadFile): boolean | Observable<boolean> => {
    if (file.originFileObj) {
      this.pendingFileList = this.pendingFileList.filter(
        pendingFile => pendingFile !== file.originFileObj
      );
      return true;
    }
    return new Observable((observer: Observer<boolean>) => {
      this.modal.confirm({
        nzTitle: 'Xác nhận xóa',
        nzContent: `Bạn có chắc muốn xóa file ${file.name}?`,
        nzOkText: 'Xóa',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.removedFiles.push(file);
          observer.next(true);
          observer.complete();
        },
        nzCancelText: 'Hủy',
        nzOnCancel: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  };
  deleteDocument(doc: any) {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: `Bạn có chắc muốn xóa file ${doc.name}?`,
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const fileInUploadList = this.fileList.find(f => f.url === doc.url);
        if (fileInUploadList) {
          this.removedFiles.push(fileInUploadList);
          this.fileList = this.fileList.filter(f => f.url !== doc.url);
          this.fileListTable = this.fileListTable.filter(f => f.url !== doc.url);
        }
      }
    });
  }

  closeDetail() {
    this.model = {};
    this.visibleDetail = false;
    this.pendingFileList = [];
    this.removedFiles = [];
    this.fileList = [];
    this.fileListTable = [];
  }

  updateDetail() {
    this.Nmodel.qmnum = this.model.qmnum;
    this.Nmodel.rpType = 'N';

    this.Hmodel.qmnum = this.model.qmnum;
    this.Hmodel.rpType = 'H';
    this._sNoti.update(this.model).subscribe({
      next: () => {
        this.processFiles().then(() => {
          this._sNotiReport.saveReport(this.Nmodel).subscribe({
            error: (err) => console.error('Save status report error:', err)
          });

          this._sNotiReport.saveReport(this.Hmodel).subscribe({
            error: (err) => console.error('Save acceptance report error:', err)
          });

          this.message.success('Cập nhật thành công');
          this.search();
        }).catch(err => {
          this.message.warning('Cập nhật thông tin thành công nhưng xử lý file gặp lỗi');
          console.error('File processing error:', err);
        });
      },
      error: (err) => {
        console.error('Update error:', err);
        this.message.error('Cập nhật thất bại');
      }
    });
  }

  getAllAccountType() {
    this._sAccType.getAll().subscribe({
      next: (data) => {
        this.lstAccountType = data;
      }
    });
  }
  getAllUser() {
    this._sAccount.getListUser().subscribe({
      next: (data) => {
        this.lstUser = data;
      },
    });
  }

  getFullNameUser(username: any) {
    return this.lstUser.find(
      (x: { userName: string }) => x.userName == username
    )?.fullName;
  }

  getAllWc() {
    this._sWc.getAll().subscribe({
      next: (data) => {
        this.lstWc = data;
      },
    });
  }

  getAllEquip() {
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
    });
  }

  getNameWc(code: any) {
    return this.lstWc.find((x) => x.arbpl == code)?.arbplTxt;
  }

  getNameEquip(code: any) {
    return this.lstEquip.find((x) => x.equnr == code)?.eqktx;
  }

  getAllFloc() {
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
    });
  }
  getFlocName(code: any) {
    return this.lstFloc.find((x: { tplnr: string }) => x.tplnr == code)
      ?.descript;
  }

  getPriorityText(priok: string): string {
    switch (priok) {
      case '1':
        return 'Rất Cao';
      case '2':
        return 'Cao';
      case '3':
        return 'Trung Bình';
      case '4':
        return 'Thấp';
      case '5':
        return 'Rất Thấp';
      default:
        return priok || '';
    }
  }

  openCauseModal(item: any) {
    this.currentCatalogItemForModal = item;
    this.causeItems = item.causeCode ? [{
      causeType: item.causeCode,
      causeDetail: item.causeTxt || ''
    }] : [];
    this.isCauseModalVisible = true;
  }

  closeCauseModal() {
    this.isCauseModalVisible = false;
  }
  addCauseItem() {
    this.causeItems = [...this.causeItems, {
      causeType: '',
      causeDetail: ''
    }];
  }
  deleteCauseItem(index: number) {
    this.causeItems = this.causeItems.filter((_, i) => i !== index);
  }

  saveCause() {
    if (this.causeItems.length > 0) {
      this.currentCatalogItemForModal.causeCode = this.causeItems[0].causeType;
      this.currentCatalogItemForModal.causeTxt = this.causeItems[0].causeDetail;
    } else {
      this.currentCatalogItemForModal.causeCode = '';
      this.currentCatalogItemForModal.causeTxt = '';
    }
    this.closeCauseModal();
  }
  openTaskModal(item: any) {
    this.currentCatalogItemForModal = item;
    this.taskItems = item.taskCode ? [{
      taskAction: item.taskCode
    }] : [];
    this.isTaskModalVisible = true;
  }

  closeTaskModal() {
    this.isTaskModalVisible = false;
  }

  addTaskItem() {
    this.taskItems = [...this.taskItems, {
      taskAction: ''
    }];
  }

  deleteTaskItem(index: number) {
    this.taskItems = this.taskItems.filter((_, i) => i !== index);
  }

  saveTask() {
    if (this.taskItems.length > 0) {
      this.currentCatalogItemForModal.taskCode = this.taskItems[0].taskAction;
    } else {
      this.currentCatalogItemForModal.taskCode = '';
    }
    this.closeTaskModal();
  }
  openActModal(item: any) {
    this.currentCatalogItemForModal = item;
    this.actItems = item.actCode ? [{
      actPrevent: item.actCode
    }] : [];
    this.isActModalVisible = true;
  }

  closeActModal() {
    this.isActModalVisible = false;
  }

  addActItem() {
    this.actItems = [...this.actItems, {
      actPrevent: ''
    }];
  }

  deleteActItem(index: number) {
    this.actItems = this.actItems.filter((_, i) => i !== index);
  }

  saveAct() {
    if (this.actItems.length > 0) {
      this.currentCatalogItemForModal.actCode = this.actItems[0].actPrevent;
    } else {
      this.currentCatalogItemForModal.actCode = '';
    }
    this.closeActModal();
  }
  updateStatusNoti(data: any, status: string) {
    data.statAct = status;
    this._sNoti.update(data).subscribe({
      next: () => {
        this.search();
      },
    });
  }
  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  pageIndexChange(page: number): void {
    this.filter.currentPage = page;
    this.search();
  }

  pageSizeChange(size: number): void {
    this.filter.pageSize = size;
    this.filter.currentPage = 1;
    this.search();
  }
}
