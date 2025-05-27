import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { NotiService } from '../../service/tran/noti.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlocService } from '../../service/master-data/floc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { WcService } from '../../service/master-data/wc.service';
import { EquipService } from '../../service/master-data/equip.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { PlantService } from '../../service/master-data/plant.service';
import {
  HTBTBD,
  LVTSD,
  PriorityLevel,
} from '../../shared/constants/select.constants';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { firstValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotiAttService } from '../../service/tran/noti-att.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotiCatalogService } from '../../service/tran/not-catalog.service';
import { AccountTypeService } from '../../service/master-data/account-type.service';
import { CatalogService } from '../../service/master-data/catalog.service';
import Swal from 'sweetalert2';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { OrderService } from '../../service/tran/order.service';
import { OrderEqService } from '../../service/tran/orderEq.service';
import { OrderModel } from '../../models/tran/order.model';
import { NotiModel } from '../../models/tran/noti.model';
import { NotiCatalogModel } from '../../models/tran/noti-catalog.model';
import { NotiFilter } from '../../filter/incident/incident.filter';

@Component({
  selector: 'app-incident-list',
  imports: [ShareModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss',
})
export class IncidentListComponent implements OnInit, OnDestroy {
  checked: boolean = false;
  isVisibleAddOrder = false;
  visibleDetail: boolean = false;
  filter = new BaseFilter();
  sfilter = new NotiFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstFloc: any[] = [];
  lstUser: any[] = [];
  lstWc: any[] = [];
  lstEquip: any[] = [];
  lstNotiTp: any[] = [];
  lstEqGroup: any[] = [];
  lstEquipSelect: any[] = [];
  lstPlant: any[] = [];
  lstPlgrp: any[] = [];
  lstAccountType: any[] = [];
  lstOrderType: any[] = [];
  lstNotiCatalog: any[] = [];
  lstCatalog: any[] = [];
  lstCatalogTypeA: any[] = [];
  lstCatalogTypeB: any[] = [];
  lstCatalogTypeC: any[] = [];
  lstCatalogType2: any[] = [];
  lstCatalogType5: any[] = [];

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

  model: any = new NotiModel();
  order: any = new OrderModel();

  private subscriptions: Subscription[] = [];

  constructor(
    private _sNoti: NotiService,
    private _sNotiAtt: NotiAttService,
    private _sNotiCatalog: NotiCatalogService,
    private _sFloc: FlocService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    private _sAccType: AccountTypeService,
    private _sCatalog: CatalogService,
    private _sPlgrp: PlgrpService,
    private _sUser: AccountService,
    private _sPlant: PlantService,
    private _sEqGroup: EqGroupService,
    private _sNotiTp: NotiTypeService,
    private _sOrderType: OrderTypeService,
    private _sOrder: OrderService,
    public _global: GlobalService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
    this._global.setBreadcrumb([
      {
        name: 'Danh sách sự cố',
        path: 'incident/list',
      },
    ]);
    this.subscriptions.push(
      this._global.getLoading().subscribe((value) => {
        this.loading = value;
      })
    );
  }

  ngOnDestroy() {
    this._global.setBreadcrumb([]);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.search();
    this.getMasterData();
  }

  getMasterData() {
    this.subscriptions.push(
      this._sOrderType.getAll().subscribe((data) => (this.lstOrderType = data)),
      this._sAccType.getAll().subscribe((data) => (this.lstAccountType = data)),
      this._sPlgrp.getAll().subscribe((data) => (this.lstPlgrp = data)),
      this._sWc.getAll().subscribe((data) => (this.lstWc = data)),
      this._sFloc.getAll().subscribe((data) => (this.lstFloc = data)),
      this._sPlant.getAll().subscribe((data) => (this.lstPlant = data)),
      this._sNotiTp.getAll().subscribe((data) => (this.lstNotiTp = data)),
      this._sEquip.getAll().subscribe((data) => (this.lstEquip = data)),
      this._sEqGroup.getAll().subscribe((data) => (this.lstEqGroup = data)),
      this._sCatalog.getAll().subscribe((data) => (this.lstCatalog = data)),
      this._sUser.getListUser().subscribe((data) => (this.lstUser = data))
    );
  }

  openAddOrder(data: any) {
    const commonKeys = Object.keys(data).filter((key) => key in this.order);
    commonKeys.forEach((key) => {
      this.order[key] = data[key];
    });
    this.order.ktext = data.qmtxt;
    this.order.htBtbd = data.htbtbd;
    this.order.loaivtSd = data.lvtsd;
    this.order.staffSc = '';
    this.order.status = '01'
    this.order.ernam = data.qmnam;
    this.isVisibleAddOrder = true;
  }

  createOrder(): void {
    this.subscriptions.push(
      this._sOrder.create(this.order).subscribe({
        next: () => {
          this.isVisibleAddOrder = false;
          this.order = new OrderModel();
          this.search();
        },
        error: (err) => {
          console.error(err);
          this.message.error('Tạo lệnh thất bại');
        },
      })
    );
  }

  orderCancel(): void {
    this.isVisibleAddOrder = false;
  }

  openDetail(data: any) {
    this.model = data;
    this.visibleDetail = true;

    const tempCatalog = this.lstCatalog.filter((x) => x.catCode == data.eqart);
    this.lstCatalogTypeA = tempCatalog.filter((x) => x.catType === 'A');
    this.lstCatalogTypeB = tempCatalog.filter((x) => x.catType === 'B');
    this.lstCatalogTypeC = tempCatalog.filter((x) => x.catType === 'C');
    this.lstCatalogType2 = tempCatalog.filter((x) => x.catType === '2');
    this.lstCatalogType5 = tempCatalog.filter((x) => x.catType === '5');

    this.subscriptions.push(
      this._sNotiCatalog.getByQmnum(data.qmnum).subscribe({
        next: (data) => (this.lstNotiCatalog = data),
        error: (err) => console.error(err),
      })
    );

    this.loadAttachments(data.qmnum);
  }

  addCatalogItem() {
    const notiCatalog = new NotiCatalogModel();
    notiCatalog.qmnum = this.model.qmnum;
    this.lstNotiCatalog = [...this.lstNotiCatalog, notiCatalog];
  }

  closeDetail() {
    this.lstNotiCatalog = [];
    this.lstCatalogTypeA = [];
    this.lstCatalogTypeB = [];
    this.lstCatalogTypeC = [];
    this.lstCatalogType2 = [];
    this.lstCatalogType5 = [];
    this.pendingFileList = [];
    this.fileList = [];
    this.removedFiles = [];
    this.fileListTable = [];
    this.previewVisible = false;
    this.model = new NotiModel();
    this.visibleDetail = false;
  }

  updateDetail() {
    console.log(this.lstNotiCatalog);
    this.subscriptions.push(
      this._sNoti.update(this.model).subscribe({
        error: (err) => console.error(err),
      })
    );
    this.subscriptions.push(
      this._sNotiCatalog.update(this.lstNotiCatalog).subscribe({
        error: (err) => console.error(err),
      })
    );

    setTimeout(() => {
      this.processFiles();
    }, 200);
  }

  exportNoti(qmnum : string){
    this.subscriptions.push(
      this._sNoti.exportExcelNoti(qmnum).subscribe({
        next: (result) => {
          var anchor = document.createElement('a');
          anchor.href = environment.urlFiles + "/" + result;
          anchor.click();
        },
        error: (err) => console.error(err),
      })
    );
  }

  search() {
    this.subscriptions.push(
      this._sNoti.search(this.sfilter).subscribe({
        next: (data) => (this.paginationResult = data),
        error: (err) => console.log(err),
      })
    );
  }

  updateStatusNoti(data: any, status: string) {
    Swal.fire({
      title: status == '04' ? 'Hoàn thành' : 'Đang thực hiện',
      text: 'Anh chị có chắc chắn thực hiện hành động này?!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ',
    }).then((result) => {
      if (result.isConfirmed) {
        data.statAct = status;
        this.subscriptions.push(
          this._sNoti.update(data).subscribe({
            next: () => this.search(),
          })
        );
      }
    });
  }
 exportExcel() {
    return this._sNoti
      .exportExcel(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-su-co.xlsx'
        anchor.href = url
        anchor.click()
      })
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

  loadAttachments(qmnum: string) {
    this.subscriptions.push(
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
              const mimeType = this._global.getMimeType(item.fileType);

              const uploadFile: NzUploadFile = {
                uid: item.id,
                name: item.path.split('/').pop() || 'file',
                status: 'done',
                url: fileUrl,
                size: item.fileSize,
                type: mimeType,
              };

              if (this._global.isImageType(item.fileType)) {
                uploadFile.thumbUrl = fileUrl;
              }

              return uploadFile;
            });

            this.fileListTable = uniqueAttachments.map((item: any) => ({
              path: item.path,
              url: `${environment.urlFiles}/${item.path}`,
              name: item.path.split('/').pop() || 'file',
              fileType: item.fileType,
              fileSize: item.fileSize / 1024,
              createDate: item.createDate || new Date(),
            }));
          } else {
            this.fileList = [];
            this.fileListTable = [];
          }
        },
        error: () => {
          this.fileList = [];
          this.fileListTable = [];
        },
      })
    );
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
            this.message.warning(`Tải file ${file.name} thất bại`);
          }
        }
        this.pendingFileList = [];
      }

      for (const file of this.removedFiles) {
        const fileName = file.uid ? file.uid.split('/').pop() || '' : '';
        if (fileName) {
          try {
            await firstValueFrom(this._sNotiAtt.delete(fileName));
            this.message.success(`Xóa file ${file.name} thành công`);
          } catch {
            this.message.warning(`Xóa file ${file.name} thất bại`);
          }
        }
      }

      this.loadAttachments(this.model.qmnum);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
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
      file['preview'] = await this._global.getBase64(file.originFileObj!);
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
}
