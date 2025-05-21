import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { EquipService } from '../../service/master-data/equip.service';
import { FlocService } from '../../service/master-data/floc.service';
import { NotiTypeService } from '../../service/master-data/noti-type.service';
import { OrderTypeService } from '../../service/master-data/order-type.service';
import { PlantService } from '../../service/master-data/plant.service';
import { PlgrpService } from '../../service/master-data/plgrp.service';
import { WcService } from '../../service/master-data/wc.service';
import { AccountService } from '../../service/system-manager/account.service';
import { NotiService } from '../../service/tran/noti.service';
import { OrderService } from '../../service/tran/order.service';
import { HTBTBD, ILART, LVTSD, PriorityLevel, TTTH } from '../../shared/constants/select.constants';
import { NotiCatalogService } from '../../service/tran/not-catalog.service';
import { CatalogService } from '../../service/master-data/catalog.service';
import { OrderAttService } from '../../service/tran/order-att.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EqCatService } from '../../service/master-data/eq-cat.service';
import { UsageStatusService } from '../../service/master-data/usage-status.service';
import { ActiveStatusService } from '../../service/master-data/active-status.service';
import { OrderEqService } from '../../service/tran/orderEq.service';
import { OrderVtService } from '../../service/tran/ordervt.service';
import { ItemService } from '../../service/warehouse/item.service';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
@Component({
  selector: 'app-incident-correct',
  imports: [ShareModule],
  templateUrl: './incident-correct.component.html',
  styleUrl: './incident-correct.component.scss',
})
export class IncidentCorrectComponent implements OnInit {
  checked: boolean = false;
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  lstItem: any[] = [];
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
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

  lstNotiCatalog: any[] = [];
  lstCatalogTypeA: any[] = [];
  lstCatalogTypeB: any[] = [];
  lstCatalogTypeC: any[] = [];
  lstCatalogType2: any[] = [];
  lstCatalogType5: any[] = [];
  lstOrderEq: any[] = [];
  lstEqCat: any = [];
  lstEquipOrder: any[] = [];
  lstItemOrder: any[] = [];

  pendingFileList: File[] = [];
  fileList: NzUploadFile[] = [];
  removedFiles: NzUploadFile[] = [];
  fileListTable: any[] = [];
  previewImage: string | undefined = '';
  previewTitle: string | undefined = '';
  previewVisible = false;

  model: any = {
    iwerk: '',
    aufnr: '',
    auart: '',
    ktext: '',
    ilart: '',
    artpr: '',
    priok: '',
    equnr: '',
    tplnr: '',
    oblty: '',
    eqart: '',
    eqartError: '',
    ingpr: '',
    warpl: '',
    abnum: null,
    nplda: null,
    addat: null,
    qmnum: '',
    obknr: null,
    gewrk: '',
    eqartSub: '',
    objnr: '',
    aufpl: '',
    rsnum: '',
    accFlg: '',
    ftrms: null,
    gstri: null,
    gltri: null,
    gstrp: null,
    gltrp: null,
    gstrs: null,
    gltrs: null,
    getri: null,
    ftrmi: null,
    ftrmp: null,
    bukrs: '',
    arbpl: '',
    werks: '',
    kostv: '',
    stort: '',
    iphas: '',
    phas0: '',
    phas1: '',
    phas2: '',
    phas3: '',
    pdat1: null,
    pdat2: null,
    pdat3: null,
    idat3: null,
    htBtbd: '',
    staffPl: '',
    staff: '',
    loaivtSd: '',
    staffSc: '',
    staffKt: '',
    ausvn: null,
    ausbs: null,
    lockFlg: '',
    lockDate: null,
    delFlg: '',
    delDate: null,
    status: '',
    stat: '',
    statT: '',
    lifnr: '',
    budat: null,
    bldat: null,
    hkont: '',
    dmbtr: null,
    waers: '',
    rootF: '',
    statMo: '',
    statTd: '',
    statKt: '',
    cfFlg: '',
    kqFlg: '',
    groupidPm: '',
    pmvtid: '',
    ernam: '',
    erdat: null,
    aenam: '',
    aedat: null,
    needup: '',
    belnr: '',
    gjahr: null,
    equipName: '',
    flocName: '',
  };

  constructor(
    private _sNotiCatalog: NotiCatalogService,
    private _sOrder: OrderService,
    private _sOrderType: OrderTypeService,
    private _sNotiTp: NotiTypeService,
    private _sPlant: PlantService,
    private _sCatalog: CatalogService,
    private _sNoti: NotiService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    private globalService: GlobalService,
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
    private _sOrderEq: OrderEqService,
    private _sOrderVt: OrderVtService,
    private _sItem: ItemService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách lệnh',
        path: 'incident/correct',
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
    this.searchCat();
  }
  search() {
    this._sOrder.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  searchCat() {
    this._serviceCat.getAll().subscribe({
      next: (data) => {
        this.lstEqCat = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  addCatalogItem() {
    this.lstNotiCatalog = [...this.lstNotiCatalog, {
      id: 'A',
      qmnum: this.model.qmnum,
      objpart: null,
      typeCode: null,
      typeTxt: null,
      causeCode: null,
      causeTxt: null,
      taskCode: null,
      taskTxt: null,
      actCode: null,
      actTxt: null,
      creatBy: null,
      createOn: null,
      changeBy: null,
      changeOn: null,
      isActive: true,
    },];
  }

  addOrderItem() {
    this.lstItemOrderS = [...this.lstItemOrderS, {
      id: 'A',
      aufnr: this.model.aufnr,
      category: 'S',
      matnr: null,
      marktxt: null,
      werks: null,
      budat: null,
      isActive: true,
      menge: 0,
      meins: null,
      category2: null,
      lgort: null,
      charg: null,
      price: 0,
      dmbtr: 0,
      waers: null,
      uname: null,
      udat: null,
    },];
  }
   addOrderItemM() {
    this.lstItemOrderM = [...this.lstItemOrderM, {
      id: 'A',
      aufnr: this.model.aufnr,
      category: 'M',
      matnr: null,
      marktxt: null,
      werks: null,
      budat: null,
      isActive: true,
      menge: 0,
      meins: null,
      category2: null,
      lgort: null,
      charg: null,
      price: 0,
      dmbtr: 0,
      waers: null,
      uname: null,
      udat: null,
    },];
  }

  getMasterData() {
    this._sPlant.getAll().subscribe({
      next: (data) => {
        this.lstPlant = data;
      },
    });
    this._sOrderType.getAll().subscribe({
      next: (data) => {
        this.lstOrderType = data;
      },
    });
    this._sNotiTp.getAll().subscribe({
      next: (data) => {
        this.lstNotiTp = data;
      },
    });
    this._sPlgrp.getAll().subscribe({
      next: (data) => {
        this.lstPlgrp = data;
      },
    });
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
    });
    this._sAccount.getListUser().subscribe({
      next: (data) => {
        this.lstUser = data;
      },
    });
    this._sWc.getAll().subscribe({
      next: (data) => {
        this.lstWc = data;
      },
    });
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
    });
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
    });
    this._sUsage.getAll().subscribe({
      next: (data) => {
        this.lstUsageStatus = data;
      },
    });
    this._sActive.getAll().subscribe({
      next: (data) => {
        this.lstActiveStatus = data;
      },
    });
    this._sItem.getAll().subscribe({
      next: (data) => {
        this.lstItem = data;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._sCatalog.getAll().subscribe({
      next: (data: any) => {
        this.lstCatalogTypeA = data.filter(
          (x: { catType: string }) => x.catType === 'A'
        );
        this.lstCatalogTypeB = data.filter(
          (x: { catType: string }) => x.catType === 'B'
        );
        this.lstCatalogTypeC = data.filter(
          (x: { catType: string }) => x.catType === 'C'
        );
        this.lstCatalogType2 = data.filter(
          (x: { catType: string }) => x.catType === '2'
        );
        this.lstCatalogType5 = data.filter(
          (x: { catType: string }) => x.catType === '5'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  parseTimeStringToDate(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, s || 0, 0);
    return d;
  }
  getEquipmentCategoryName(code: string) {
    const eqtypF = this.lstEquip.find((x: { equnr: string }) => x.equnr == code)?.eqtyp;
    return this.lstEqCat.find((x: { eqtyp: string }) => x.eqtyp == eqtypF)
      ?.eqtypTxt;
  }
  getFloc(code: string) {
    return this.lstEquip.find((x: { equnr: string }) => x.equnr == code)?.tplnr;
  }

  visibleOrder: boolean = false;
  openEditOrder(data: any) {
    this.model = data;
    this.model.equipName = this.getNameEquip(data.equnr);
    this.model.flocName = this.getNameFloc(data.tplnr);
    this._sNotiCatalog.getByQmnum(data.qmnum).subscribe({
      next: (data) => {
        this.lstNotiCatalog = data;
      },
      error: (err) => { },
    });
    this._sOrderEq.GetByAufnr(data.aufnr).subscribe({
      next: (data) => {
        this.lstEquipOrder = (data || []).map((item: { datab: string | number | Date; datbi: string | number | Date; timeF: string; timeT: string; }) => ({
          ...item,
          datab: item.datab ? new Date(item.datab) : null,
          datbi: item.datbi ? new Date(item.datbi) : null,
          timeF: item.timeF ? this.parseTimeStringToDate(item.timeF) : null,
          timeT: item.timeT ? this.parseTimeStringToDate(item.timeT) : null,
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
    this._sOrderVt.getByAufnr(data.aufnr).subscribe({
      next: (data) => {
        this.lstItemOrder = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.loadOrderItems();
    this.visibleOrder = true;
    this.loadAttachments(data.aufnr);
  }
  loadOrderItems(): void {
  if (this.lstItemOrder && this.lstItemOrder.length > 0) {
    this.lstItemOrderS = this.lstItemOrder.filter(item => item.category === 'S');
    this.lstItemOrderM = this.lstItemOrder.filter(item => item.category === 'M');
  } else {
    this.lstItemOrderS = [];
    this.lstItemOrderM = [];
  }
}
  closeOrder() {
    this.visibleOrder = false;
  }
  formatDate(date: any): string {

    if (typeof date.format === 'function') {
      return date.format('YYYY-MM-DDTHH:mm:ss');
    }
    if (date instanceof Date) {
      return date.toISOString();
    }
    return date;
  }
  formatTime(time: any): string {

    if (typeof time.format === 'function') {
      return time.format('HH:mm:ss');
    }
    if (time instanceof Date) {
      return time.toTimeString().slice(0, 8);
    }
    return time;
  }
  updateOrder() {
    const lstEquipOrderToSend = this.lstEquipOrder.map(item => ({
      ...item,
      datab: item.datab ? this.formatDate(item.datab) : null,
      datbi: item.datbi ? this.formatDate(item.datbi) : null,
      timeF: item.timeF ? this.formatTime(item.timeF) : null,
      timeT: item.timeT ? this.formatTime(item.timeT) : null,

    }));
    this._sOrderEq.update(lstEquipOrderToSend[0]).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error(err);
      },
    });
    this._sOrder.update(this.model).subscribe({
      next: (data) => {
        this.processFiles();
        this.search();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.lstItemOrder = [...this.lstItemOrderS, ...this.lstItemOrderM];
    const lstItemOrderSend = this.lstItemOrder.map(item => ({
      ...item,
      budat: item.budat ? this.formatDate(item.budat) : null,
    }));
    this._sOrderVt.saveOrderVt(lstItemOrderSend).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error(err);
      },
    });

    this._sNotiCatalog.update(this.lstNotiCatalog).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error(err);
      },
    });

  }
  onMaterialChange(materialCode: string, itemData: any): void {
    const selectedItem = this.lstItem.find(item => item.matnr === materialCode);
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

  getFullNameUser(username: any) {
    return this.globalService.getFullNameUser(this.lstUser, username);
  }
  getNameWc(code: any) {
    return this.globalService.getNameWc(this.lstWc, code);
  }

  getNameEquip(code: any) {
    return this.globalService.getNameEquip(this.lstEquip, code);
  }

  getFlocName(code: any) {
    const tplnrF = this.lstEquip.find((x: { equnr: string }) => x.equnr == code)?.tplnr;
    return this.globalService.getNameFloc(this.lstFloc, tplnrF);
  }

  getNameFloc(code: any) {
    return this.globalService.getNameFloc(this.lstFloc, code);
  }

  getPriorityText(priok: string) {
    return this.globalService.getPriorityText(priok);
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
removeOrderItemM(index: number): void {
  this.modal.confirm({
    nzTitle: 'Bạn có chắc chắn muốn xóa vật tư này?',
    nzContent: 'Hành động này không thể hoàn tác.',
    nzOkText: 'Xác nhận',
    nzOkType: 'primary',
    nzOkDanger: true,
    nzOnOk: () => {
      this.lstItemOrderM = this.lstItemOrderM.filter((_, i) => i !== index);
    },
    nzCancelText: 'Hủy',
  });
}
}
