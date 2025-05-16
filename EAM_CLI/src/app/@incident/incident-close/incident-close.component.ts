import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { EquipService } from '../../service/master-data/equip.service';
import { FlocService } from '../../service/master-data/floc.service';
import { WcService } from '../../service/master-data/wc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiService } from '../../service/tran/noti.service';
import Swal from 'sweetalert2';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NotiCatalogModel } from '../../models/tran/noti-catalog.model';
import { HTBTBD, LVTSD, PriorityLevel } from '../../shared/constants/select.constants';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotiReportService } from '../../service/tran/noti-report.service';
import { AccountTypeService } from '../../service/master-data/account-type.service';
import { NotiCatalogService } from '../../service/tran/not-catalog.service';
import { CatalogService } from '../../service/master-data/catalog.service';
import { NotiAttService } from '../../service/tran/noti-att.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { PlantService } from '../../service/master-data/plant.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { OrganizeService } from '../../service/system-manager/organize.service';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
@Component({
  selector: 'app-incident-close',
  imports: [ShareModule],
  templateUrl: './incident-close.component.html',
  styleUrl: './incident-close.component.scss',
})
export class IncidentCloseComponent implements OnInit {
  checked: boolean = false;

  visibleDetail: boolean = false;
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
  lstEquip: any[] = [];
  lstOrg: any[] = [];
  lstNotiTp: any[] = [];
  lstEqGroup: any[] = [];
  lstEquipSelect: any[] = [];
  lstPlant: any[] = [];
  lstPlgrp: any[] = [];
  lstAccountType: any[] = [];
  lstCatalog: any[] = [];

  lstPriorityLevel = PriorityLevel;
  lstLvtsd = LVTSD;
  lstHtbtbd = HTBTBD;

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
    htbtbd: '',
    lvtsd: '',
    ltrmn: new Date(),
    qmdat: new Date(),
    isActive: true,
    htNbb: new Date(),
    htDvql: '',
    htDvqlCd: '',
    htDvsd: '',
    htDvsdCd: '',
    htDvth: '',
    htDvthCd: '',
    htNdkt: '',
    htNddx: '',
    ntNbb: new Date(),
    ntDvql: '',
    ntDvqlDes: '',
    ntDvqlCd: '',
    ntDvsd: '',
    ntDvsdDes: '',
    ntDvsdCd: '',
    ntDvth: '',
    ntDvthDes: '',
    ntDvthCd: '',
  };


  constructor(
    private _sNoti: NotiService,
    private globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    private modal: NzModalService,
    private _sAccType: AccountTypeService,
    private notiCatalogService: NotiCatalogService,
    private sCatalog: CatalogService,
    private _sNotiAtt: NotiAttService,
    private _sPlgrp: PlgrpService,
    private _global: GlobalService,
    private _sUser: AccountService,
    private _sPlant: PlantService,
    private _sEqGroup: EqGroupService,
    private _sNotiTp: NotiTypeService,
    private _sOrg: OrganizeService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Đóng sự cố',
        path: 'incident/close',
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
    this.getMasterData();
  }

  getMasterData() {
    this._sAccType.getAll().subscribe({
      next: (data) => {
        this.lstAccountType = data;
      },
    });
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
    this.sCatalog.getAll().subscribe({
      next: (data: any) => {
        this.lstCatalog = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._sPlant.getAll().subscribe({
      next: (data) => (this.lstPlant = data),
      error: (err) => console.log(err),
    });
    this._sNotiTp.getAll().subscribe({
      next: (data) => {
        this.lstNotiTp = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
    });
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openDetail(data: any) {
    this.model = data;
    this.visibleDetail = true;
    this.loadAttachments(data.qmnum);
    this.loadNotiCatalogs(data.qmnum);
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
      isActive: true,
    };
    if (!Array.isArray(this.catalogItems)) {
      this.catalogItems = [];
    }
    this.catalogItems = [...this.catalogItems, newItem];
  }
  loadAttachments(qmnum: string) {
    this._sNotiAtt.getByQmnum(qmnum).subscribe({
      next: (result) => {
        const attachmentData = Array.isArray(result)
          ? result
          : result && result.data
          ? result.data
          : [];

        const uniqueAttachments = Array.from(
          new Map(
            attachmentData.map((item: { path: any }) => [item.path, item])
          ).values()
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
              createDate: item.createDate || new Date(),
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
      },
    });
  }
  async processFiles(): Promise<void> {
    try {
      if (this.pendingFileList.length > 0) {
        for (const file of this.pendingFileList) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await this._sNotiAtt.uploadFile(
            formData,
            this.model.qmnum
          );
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
            const response = await firstValueFrom(
              this._sNotiAtt.delete(fileName)
            );
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
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(
      fileType.toLowerCase()
    );
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
        (pendingFile) => pendingFile !== file.originFileObj
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
        },
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
        const fileInUploadList = this.fileList.find((f) => f.url === doc.url);
        if (fileInUploadList) {
          this.removedFiles.push(fileInUploadList);
          this.fileList = this.fileList.filter((f) => f.url !== doc.url);
          this.fileListTable = this.fileListTable.filter(
            (f) => f.url !== doc.url
          );
        }
      },
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
  closeDetail() {
    this.model = {};
    this.visibleDetail = false;
    this.pendingFileList = [];
    this.removedFiles = [];
    this.fileList = [];
    this.fileListTable = [];
  }

  updateDetail() {
    this._sNoti.update(this.model).subscribe({
      next: () => {
          this.processFiles();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.message.error('Cập nhật thất bại');
      },
    });
  }
  openCauseModal(item: any) {
    this.currentCatalogItemForModal = item;
    this.causeItems = item.causeCode
      ? [
          {
            causeType: item.causeCode,
            causeDetail: item.causeTxt || '',
          },
        ]
      : [];
    this.isCauseModalVisible = true;
  }

  closeCauseModal() {
    this.isCauseModalVisible = false;
  }
  addCauseItem() {
    this.causeItems = [
      ...this.causeItems,
      {
        causeType: '',
        causeDetail: '',
      },
    ];
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
    this.taskItems = item.taskCode
      ? [
          {
            taskAction: item.taskCode,
          },
        ]
      : [];
    this.isTaskModalVisible = true;
  }

  closeTaskModal() {
    this.isTaskModalVisible = false;
  }

  addTaskItem() {
    this.taskItems = [
      ...this.taskItems,
      {
        taskAction: '',
      },
    ];
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
    this.actItems = item.actCode
      ? [
          {
            actPrevent: item.actCode,
          },
        ]
      : [];
    this.isActModalVisible = true;
  }

  closeActModal() {
    this.isActModalVisible = false;
  }

  addActItem() {
    this.actItems = [
      ...this.actItems,
      {
        actPrevent: '',
      },
    ];
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
  search() {
    this._sNoti.searchClose(this.filter).subscribe({
      next: (data) => {
        console.log(data)
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getFullNameUser(username: any) {
    return this._global.getFullNameUser(this.lstUser, username);
  }

  getNameWc(code: any) {
    return this._global.getNameWc(this.lstWc, code);
  }

  getNameEquip(code: any) {
    return this._global.getNameEquip(this.lstEquip, code);
  }

  getFlocName(code: any) {
    return this._global.getNameFloc(this.lstFloc, code);
  }

  getNameEqGroup(code: any) {
    return this._global.getNameEqGroup(this.lstEqGroup, code);
  }

  getPriorityText(priok: string): string {
    return this._global.getPriorityText(priok);
  }

  updateStatusNoti(data: any, status: string) {
    Swal.fire({
      title: status == '05' ? 'Đóng sự cố?' : 'Từ chối đóng?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ',
    }).then((result) => {
      if (result.isConfirmed) {
         data.statAct = status;
        this._sNoti.update(data).subscribe({
          next: () => {
            this.search();
          },
        });
      }
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
