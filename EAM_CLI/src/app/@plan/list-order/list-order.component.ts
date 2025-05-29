import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { environment } from '../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription, firstValueFrom, Observable, Observer } from 'rxjs';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { ItemOrder } from '../../models/tran/item-order.model';
import { NotiCatalogModel } from '../../models/tran/noti-catalog.model';
import { OrderModel } from '../../models/tran/order.model';
import { GlobalService } from '../../service/global.service';
import { ActiveStatusService } from '../../service/master-data/active-status.service';
import { CatalogService } from '../../service/master-data/catalog.service';
import { EqCatService } from '../../service/master-data/eq-cat.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipService } from '../../service/master-data/equip.service';
import { FlocService } from '../../service/master-data/floc.service';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { PlantService } from '../../service/master-data/plant.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { UnitService } from '../../service/master-data/unit.service';
import { UsageStatusService } from '../../service/master-data/usage-status.service';
import { WcService } from '../../service/master-data/wc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { OrderAttService } from '../../service/tran/order-att.service';
import { OrderService } from '../../service/tran/order.service';
import { ItemService } from '../../service/warehouse/item.service';
import { PriorityLevel, HTBTBD, LVTSD, ILART, TTTH } from '../../shared/constants/select.constants';
import { TitleStrategy } from '@angular/router';
import { NotiFilter } from '../../filter/incident/incident.filter';
import { OrderFilter } from '../../filter/plan/order.filter';

@Component({
  selector: 'app-list-order',
  imports: [ShareModule],
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.scss',
})
export class ListOrderComponent implements OnInit, OnDestroy {
  checked: boolean = false;
  filter = new BaseFilter();
  ofilter = new OrderFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstItem: any[] = [];
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
  lstUnit: any[] = [];
  lstEquip: any[] = [];
  lstEqGroup: any[] = [];
  lstPlgrp: any[] = [];
  lstPlant: any[] = [];
  lstUsageStatus: any[] = [];
  lstActiveStatus: any[] = [];
  lstPriorityLevel = PriorityLevel;
  lstNotiTp: any[] = [];
  lstOrderType: any[] = [];
  lstHTBTBD = HTBTBD;
  lstLVTSD = LVTSD;
  lstILART = ILART;
  lstTTTH = TTTH;
  lstItemOrderS: any[] = [];
  lstItemOrderM: any[] = [];

  lstCatalog: any[] = [];
  lstCatalogTypeA: any[] = [];
  lstCatalogTypeB: any[] = [];
  lstCatalogTypeC: any[] = [];
  lstCatalogType2: any[] = [];
  lstCatalogType5: any[] = [];
  lstOrderEq: any[] = [];
  lstEqCat: any = [];
  lstOrderOperation: any[] = [];

  pendingFileList: File[] = [];
  fileList: NzUploadFile[] = [];
  removedFiles: NzUploadFile[] = [];
  fileListTable: any[] = [];
  previewImage: string | undefined = '';
  previewTitle: string | undefined = '';
  previewVisible = false;
  visibleOrder: boolean = false;

  model: any = new OrderModel();

  private subscriptions: Subscription[] = [];

  constructor(
    private _sOrder: OrderService,
    private _sOrderType: OrderTypeService,
    private _sNotiTp: NotiTypeService,
    private _sPlant: PlantService,
    private _sCatalog: CatalogService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    public _global: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sEqGroup: EqGroupService,
    private _sPlgrp: PlgrpService,
    private _sOrderAtt: OrderAttService,
    private modal: NzModalService,
    private _serviceCat: EqCatService,
    private _sUsage: UsageStatusService,
    private _sActive: ActiveStatusService,
    private _sItem: ItemService,
    private _sUnit: UnitService
  ) {
    this._global.setBreadcrumb([
      {
        name: 'Danh sách lệnh bảo trì, bảo dưỡng',
        path: 'plan/list-order',
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

  fillDate: any = {
    startDate: null,
    toDate: null,
  };
  changeFillDate(type: string) {
    if (
      this.fillDate.startDate > this.fillDate.toDate &&
      this.fillDate.startDate &&
      this.fillDate.toDate
    ) {
      this.message.error(
        'Ngày kết thúc phải lớn hơn ngày bắt đầu! Vui lòng kiểm tra lại!'
      );
      if (type == '1') {
        this.fillDate.startDate = null;
      } else if (type == '2') {
        this.fillDate.toDate = null;
      }
      return;
    }
    if (this.model.lstOpe.length != 0) {
      this.model.lstOpe.forEach((i: any) => {
        i.dateCf = this.fillDate.startDate;
        i.dateCt = this.fillDate.toDate;
      });
    }
  }

  changeDate(data: any, type: string) {
    if (data.dateCf > data.dateCt && data.dateCf && data.dateCt) {
      this.message.error(
        'Ngày kết thúc phải lớn hơn ngày bắt đầu! Vui lòng kiểm tra lại!'
      );
      if (type == '1') {
        data.dateCf = null;
      } else if (type == '2') {
        data.dateCt = null;
      }
      return;
    }
  }

  exportOrder(aufnr: string) {
    this.subscriptions.push(
      this._sOrder.exportExcelOrder(aufnr).subscribe({
        next: (result) => {
          var anchor = document.createElement('a');
          anchor.href = environment.urlFiles + '/' + result;
          anchor.click();
        },
        error: (err) => console.error(err),
      })
    );
  }
  search() {
    const filter : any = { ...this.ofilter };
    if (filter.fromDate) {
      filter.fromDate = this._global.formatDatePlanFilter(filter.fromDate);
    }
    if (filter.toDate) {
      filter.toDate = this._global.formatDatePlanFilter(filter.toDate);
    }
    this.subscriptions.push(
      this._sOrder.searchOrderPlan(filter).subscribe({
        next: (data) => {
          this.paginationResult = data;
        },
        error: (response) => {
          console.log(response);
        },
      })
    );
  }

  addCatalogItem() {
    const notiCatalog = new NotiCatalogModel();
    notiCatalog.qmnum = this.model.qmnum;
    this.model.lstCatalog = [...this.model.lstCatalog, notiCatalog];
  }

  addOrderItem() {
    const item = new ItemOrder();
    item.id = 'A';
    item.category = 'S';
    item.aufnr = this.model.aufnr;
    this.lstItemOrderS = [...this.lstItemOrderS, item];
  }
  addOrderItemM() {
    const item = new ItemOrder();
    item.id = 'A';
    item.category = 'M';
    item.aufnr = this.model.aufnr;
    this.lstItemOrderM = [...this.lstItemOrderM, item];
  }

  getMasterData() {
    this.subscriptions.push(
      this._sPlant.getAll().subscribe((data: any) => (this.lstPlant = data)),
      this._sOrderType
        .getAll()
        .subscribe((data: any) => (this.lstOrderType = data)),
      this._sNotiTp.getAll().subscribe((data: any) => (this.lstNotiTp = data)),
      this._sPlgrp.getAll().subscribe((data: any) => (this.lstPlgrp = data)),
      this._sEqGroup
        .getAll()
        .subscribe((data: any) => (this.lstEqGroup = data)),
      this._sAccount
        .getListUser()
        .subscribe((data: any) => (this.lstUser = data)),
      this._sWc.getAll().subscribe((data: any) => (this.lstWc = data)),
      this._sEquip.getAll().subscribe((data: any) => (this.lstEquip = data)),
      this._sFloc.getAll().subscribe((data: any) => (this.lstFloc = data)),
      this._sUsage
        .getAll()
        .subscribe((data: any) => (this.lstUsageStatus = data)),
      this._sActive
        .getAll()
        .subscribe((data: any) => (this.lstActiveStatus = data)),
      this._sItem.getAll().subscribe((data: any) => (this.lstItem = data)),
      this._serviceCat
        .getAll()
        .subscribe((data: any) => (this.lstEqCat = data)),
      this._sCatalog
        .getAll()
        .subscribe((data: any) => (this.lstCatalog = data)),
      this._sUnit.getAll().subscribe((data: any) => (this.lstUnit = data))
    );
  }

  openEditOrder(e: any) {
    const tempCatalog = this.lstCatalog.filter((x) => x.catCode == e.eqart);
    this.lstCatalogTypeA = tempCatalog.filter((x) => x.catType === 'A');
    this.lstCatalogTypeB = tempCatalog.filter((x) => x.catType === 'B');
    this.lstCatalogTypeC = tempCatalog.filter((x) => x.catType === 'C');
    this.lstCatalogType2 = tempCatalog.filter((x) => x.catType === '2');
    this.lstCatalogType5 = tempCatalog.filter((x) => x.catType === '5');

    this.subscriptions.push(
      this._sOrder.getDetail(e.aufnr).subscribe({
        next: (data) => {
          console.log(data);
          this.visibleOrder = true;
          this.model = data;
          this.model.equipName = this._global.getNameEquip(
            this.lstEquip,
            data.equnr
          );
          this.model.flocName = this._global.getNameFloc(
            this.lstFloc,
            data.tplnr
          );
          this.lstItemOrderS = data.lstVt.filter(
            (item: any) => item.category === 'S'
          );
          this.lstItemOrderM = data.lstVt.filter(
            (item: any) => item.category === 'M'
          );
        },
        error: (err) => {
          console.error(err);
          this.message.error('Không thể tải thông tin lệnh');
        },
      })
    );
    this.loadAttachments(e.aufnr);
  }

  closeOrder() {
    this.visibleOrder = false;

    this.fillDate = {
      startDate: '',
      toDate: '',
    };

    this.lstItemOrderS = [];
    this.lstItemOrderM = [];

    this.lstCatalogTypeA = [];
    this.lstCatalogTypeB = [];
    this.lstCatalogTypeC = [];
    this.lstCatalogType2 = [];
    this.lstCatalogType5 = [];

    this.fileList = [];
    this.fileListTable = [];
    this.pendingFileList = [];
    this.removedFiles = [];

    this.model = {};
  }

  isVisibleUserOrder: boolean = false;
  updateUserOrder(data: any) {
    this.isVisibleUserOrder = true;
    this.model = data;
  }
  userCancel() {
    this.isVisibleUserOrder = false;
  }
  userOk() {
    this.model.status = '02';
    this._sOrder.update(this.model).subscribe({
      next: () => {
        this.isVisibleUserOrder = false;
        this.model = new OrderModel();
        this.search();
      },
      error: (err) => {
        console.error(err);
        this.message.error('Cập nhật thất bại');
      },
    });
  }

  updateStatusOrder(data: any, status: any) {
    data.status = status;
    if (status == '07') {
      data.gstri = new Date();
    } else {
      data.gltri = new Date();
    }

    this._sOrder.update(data).subscribe({
      next: () => {
        this.search();
      },
      error: (err) => {
        console.error(err);
        this.message.error('Cập nhật thất bại');
      },
    });
  }

  updateOrder() {
    const data = this.model;
    var lstItemOrderAll = [...this.lstItemOrderS, ...this.lstItemOrderM];
    this.model.lstVt = lstItemOrderAll;
    this.subscriptions.push(
      this._sOrder.update(this.model).subscribe({
        next: () => {
          this.processFiles();
          this.search();
          this.openEditOrder(data);
        },
        error: (err) => {
          console.error(err);
          this.message.error('Cập nhật thất bại');
        },
      })
    );
  }

  onMaterialChange(materialCode: string, itemData: any): void {
    const selectedItem = this.lstItem.find(
      (item) => item.matnr === materialCode
    );
    if (selectedItem) {
      itemData.meins = selectedItem.meins;
      itemData.maktx = selectedItem.maktx;
    } else {
      itemData.meins = '';
    }
  }
  calculateTotal(itemData: any): void {
    const quantity = parseFloat(itemData.menge) || 0;
    const price = parseFloat(itemData.price) || 0;
    const total = quantity * price;
    itemData.dmbtr = total.toLocaleString('vi-VN');
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
  loadAttachments(aufnr: string) {
    this.subscriptions.push(
      this._sOrderAtt.GetByAufnr(aufnr).subscribe({
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

          const response = await this._sOrderAtt.uploadFile(
            formData,
            this.model.aufnr
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
              this._sOrderAtt.delete(fileName)
            );
            this.message.success(`Xóa file ${file.name} thành công`);
          } catch (error) {
            console.error('Error deleting file:', fileName, error);
            this.message.warning(`Xóa file ${file.name} thất bại`);
          }
        }
      }

      this.loadAttachments(this.model.aufnr);
      return Promise.resolve();
    } catch (error) {
      console.error('Process files error:', error);
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

