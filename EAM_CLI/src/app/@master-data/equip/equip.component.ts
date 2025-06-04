import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { EquipService } from '../../service/master-data/equip.service';
import { ShareModule } from '../../shared/share-module';
import { PlantService } from '../../service/master-data/plant.service';
import { FlocService } from '../../service/master-data/floc.service';
import { EqCatService } from '../../service/master-data/eq-cat.service';
import { EqGroupService } from '../../service/master-data/eq-group.service';
import { WcService } from '../../service/master-data/wc.service';
import { EquipDocService } from '../../service/master-data/equip-doc.service';
import { EquipPicService } from '../../service/master-data/equip-pic.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { CommonService } from '../../service/common.service';
import { environment } from '../../../environments/environment';
import { UsageStatusService } from '../../service/master-data/usage-status.service';
import { ActiveStatusService } from '../../service/master-data/active-status.service';
import { AccountService } from '../../service/system-manager/account.service';
import { EquipFilter } from '../../filter/master-data/equiq-filter';
import { EquipCharService } from '../../service/master-data/equiq-char.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassHService } from '../../service/master-data/class-h.service';
import { ClassDService } from '../../service/master-data/class-d.service';
import { EquipClassModel } from '../../models/master-data/equip-class.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-equip',
  imports: [ShareModule],
  standalone: true,
  templateUrl: './equip.component.html',
  styleUrl: './equip.component.scss',
})
export class EquipComponent {

  @ViewChild('download-qr-equip', { static: false }) download!: ElementRef;

  private map: L.Map | undefined;
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new EquipFilter();
  exportFilter = new BaseFilter();
  paginationResult = new PaginationResult();
  lstPlant: any = [];
  lstFloc: any = [];
  lstEqCat: any = [];
  lstEqGroup: any = [];
  lstEquip: any = [];
  lstEqWc: any = [];
  lstOrganize: any = [];
  lstUsageStatus: any = [];
  lstActiveStatus: any = [];
  lstAccount: any = [];
  loading: boolean = false;
  lat: number = 0;
  lng: number = 0;

  environment = environment;

  equipDocuments: any[] = [];
  equipPictures: any[] = [];
  uploadingDoc: boolean = false;
  uploadingPic: boolean = false;
  previewImage: string | undefined = '';
  previewVisible: boolean = false;
  docFileList: NzUploadFile[] = [];
  picFileList: NzUploadFile[] = [];
  currentEquipCode: string = '';
  selectedDocType: string = '';
  lstEqChar: any[] = []
  lstClassH: any[] = []
  lstClassD: any[] = []
  lstClassDSelect: any[] = []
  linkEqunr : string = ''

  constructor(
    private _sAccount: AccountService,
    private _sUsageStatus: UsageStatusService,
    private _sActiveStatus: ActiveStatusService,
    private _service: EquipService,
    private _servicePlant: PlantService,
    private _serviceFloc: FlocService,
    private _serviceCat: EqCatService,
    private _serviceWc: WcService,
    private _serviceEqGroup: EqGroupService,
    private _serviceEquipDoc: EquipDocService,
    private _serviceEquipPic: EquipPicService,
    private fb: NonNullableFormBuilder,
    public _global: GlobalService,
    private message: NzMessageService,
    private commonService: CommonService,
    private _sEqChar: EquipCharService,
    private router: Router,
    private classH: ClassHService,
    private classD: ClassDService,
    private route: ActivatedRoute,
  ) {
    this.validateForm = this.fb.group({
      equnr: ['', [Validators.required]],
      eqktx: [''],
      iwerk: [''],
      tplnr: [''],
      ingrp: [''],
      eqtyp: [''],
      eqart: [''],
      eqartSub: [''],
      hequi: [''],
      arbpl: [''],
      statAct: [''],
      statusTh: [''],
      anlnr: [''],
      anlun: [''],
      class: [''],
      lat: [null],
      long: [null],
      inbdt: [null],
      isActive: [true, [Validators.required]],
    });

    this._global.setBreadcrumb([
      {
        name: 'Thiết bị',
        path: 'master-data/equip',
      },
    ]);
    this._global.getLoading().subscribe((value) => {
      this.loading = value;
    });
  }
  ngOnDestroy() {
    this._global.setBreadcrumb([]);
  }

  ngOnInit(): void {
    this.search();
    this.getMasterData();
    this.route.paramMap.subscribe({
      next: (params) => {
        const equnr = params.get('equnr');
        if (equnr != '0') {
          this._service.getById(equnr).subscribe({
            next: (data) => {
              if(data != null) this.openEdit(data)
            }
          })
        }
      },
    });

  }

  close() {
    this.linkEqunr = '';
    this.isSubmit = false;
    this.visible = false;
    this.map = undefined;
    this.lat = 0;
    this.lng = 0;
    this.equipDocuments = [];
    this.equipPictures = [];
    this.uploadingDoc = false;
    this.uploadingPic = false;
    this.previewImage = '';
    this.previewVisible = false;
    this.docFileList = [];
    this.picFileList = [];
    this.currentEquipCode = '';
    this.selectedDocType = '';
    this.resetForm();
  }

  onTabChange(index: number): void {
    if (index === 4) {
      if (!this.map) {
        this.initMap();
      } else {
        setTimeout(() => this.map!.invalidateSize(), 0);
      }
    }
  }
  private initMap(): void {
    this.map = L.map('equip-map').setView([this.lat, this.lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([this.lat, this.lng]).addTo(this.map)
      .bindPopup(`Thiết bị: ${this.validateForm.get('eqktx')?.value || 'Chưa có tọa độ'}`)
      .openPopup();
  }

  getMasterData() {
    this._sAccount.getListUser().subscribe((r) => (this.lstAccount = r));
    this._sUsageStatus.getAll().subscribe((r) => (this.lstUsageStatus = r));
    this._sActiveStatus.getAll().subscribe((r) => (this.lstActiveStatus = r));
    this._service.getAll().subscribe((r) => (this.lstEquip = r));
    this._servicePlant.getAll().subscribe((r) => (this.lstPlant = r));
    this._serviceFloc.getAll().subscribe((r) => (this.lstFloc = r));
    this._serviceCat.getAll().subscribe((r) => (this.lstEqCat = r));
    this._serviceEqGroup.getAll().subscribe((r) => (this.lstEqGroup = r));
    this._serviceWc.getAll().subscribe((r) => (this.lstEqWc = r));
    this.classD.getAll().subscribe((r) => {
      this.lstClassD = r;
      this.lstClassDSelect = r;

    })
    this.classH.getAll().subscribe((r) => (this.lstClassH = r))
  }

  onSortChange(tplnrTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: tplnrTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
  exportExcel() {
    return this._service
      .exportExcel(this.exportFilter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        anchor.download = 'danh-sach-thiet-bi.xlsx';
        anchor.href = url;
        anchor.click();
      });
  }
  addEqChar() {
    const eClass = new EquipClassModel();
    eClass.equnr = this.currentEquipCode;
    this.lstEqChar = [...this.lstEqChar, eClass];
  }

  search() {
    this.isSubmit = false;
    this._service.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  onChangeClassH(e: any) {
    this.lstClassDSelect = this.lstClassD.filter(x => x.class == e)
  }

  setValueCat(code: any) {
    const category = this.lstEqCat.find(
      (cat: { eqtyp: any }) => cat.eqtyp === code
    );
    this.validateForm.get('ingrp')?.setValue(category.name);
  }

  isCodeExist(tplnr: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.tplnr === tplnr
    );
  }
  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.update(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
        this._sEqChar.create(this.lstEqChar).subscribe({
          next: (data) => { },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        const formData = this.validateForm.getRawValue();
        if (this.isCodeExist(formData.tplnr)) {
          this.message.error(
            `Mã ${formData.tplnr} đã tồn tại, vui lòng nhập lại`
          );
          return;
        }
        this._service.create(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.currentEquipCode = this.validateForm.get('equnr')?.value;
            this.edit = true;
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
        this._sEqChar.create(this.lstEqChar).subscribe({
          next: (data) => { },
          error: (response) => {
            console.log(response);
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  openCreate() {
    this.edit = false;
    this.visible = true;
    this.equipDocuments = [];
    this.equipPictures = [];
    this.docFileList = [];
    this.picFileList = [];
    this.currentEquipCode = '';
    this.lstEqChar = [];
  }

  resetForm() {
    this.validateForm.reset();
    this.isSubmit = false;
  }
  createIncident(): void {
    if (!this.currentEquipCode) {
      this.message.warning('Vui lòng chọn thiết bị trước khi tạo sự cố');
      return;
    }
    const queryParams = {
      equnr: this.currentEquipCode,
      eqart: this.validateForm.value.eqart,
      tplnr: this.validateForm.value.tplnr,
      eqktx: this.validateForm.value.eqktx,
      arbpl: this.validateForm.value.arbpl,
      ingrp: this.validateForm.value.ingrp,
      iwerk: this.validateForm.value.iwerk,
    };
    this.router.navigate(['/incident/create'], {
      queryParams: queryParams,
    });
  }

  deleteItem(tplnr: string) {
    this._service.delete(tplnr).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: any) {
    this.linkEqunr = `${environment.thisUrl}/master-data/equip-history/${data.equnr}`
    this.edit = true;
    this.visible = true;
    this.validateForm.patchValue(data);
    this.currentEquipCode = data.equnr;
    this.lat = data.lat || 0;
    this.lng = data.long || 0;
    this._sEqChar.getDetail(data.equnr).subscribe({
      next: (data) => {
        this.lstEqChar = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
    this.loadEquipFiles(this._serviceEquipDoc, 'equipDocuments', data.equnr);
    this.loadEquipFiles(this._serviceEquipPic, 'equipPictures', data.equnr);
  }

  pageSizeChange(size: number): void {
    this.filter.currentPage = 1;
    this.filter.pageSize = size;
    this.search();
  }

  pageIndexChange(index: number): void {
    this.filter.currentPage = index;
    this.search();
  }

  loadEquipFiles(
    service: { getByEqunr: (equnr: string) => Observable<any[]> },
    target: 'equipDocuments' | 'equipPictures',
    equnr: string,
  ) {
    service.getByEqunr(equnr).subscribe({
      next: (data) => {
        this[target] = data.map(i => ({
          ...i,
          path: `${environment.urlFiles}/${i.path}`
        }));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private validateUploadFile(file: NzUploadFile, isImage: boolean = false): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      try {
        if (!file?.name) {
          this.message.error('Lỗi: File không hợp lệ');
          observer.next(false);
        } else if (typeof file.size !== 'number' || file.size > 10 * 1024 * 1024) {
          this.message.error('Dung lượng file vượt quá 10MB');
          observer.next(false);
        } else if (isImage && !file.type?.startsWith('image/')) {
          this.message.error('Bạn chỉ có thể tải lên file hình ảnh!');
          observer.next(false);
        } else {
          observer.next(true);
        }
      } catch (err) {
        console.error(`Lỗi khi kiểm tra file ${isImage ? 'ảnh' : 'tài liệu'}:`, err);
        observer.next(false);
      } finally {
        observer.complete();
      }
    });
  }

  beforeDocUpload = (file: NzUploadFile): Observable<boolean> => this.validateUploadFile(file);
  beforePicUpload = (file: NzUploadFile): Observable<boolean> => this.validateUploadFile(file, true);

  private handleUpload = (
    item: NzUploadXHRArgs,
    type: 'doc' | 'pic'
  ): Subscription => {
    try {
      const file = item?.file?.originFileObj as File;
      if (!file) {
        this.message.error('Lỗi khi tải lên: File không hợp lệ');
        item?.onError?.(new Error('Invalid file object'), item.file);
        return new Subscription();
      }

      const equnr = (this.currentEquipCode || this.validateForm.get('equnr')?.value)?.trim().replace(/[\r\n]+/g, '');
      if (!equnr) {
        this.message.error(`Bạn cần nhập mã thiết bị trước khi tải lên ${type === 'doc' ? 'tài liệu' : 'hình ảnh'}!`);
        item.onError?.(new Error('Missing equipment code'), item.file);
        return new Subscription();
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('equnr', equnr);
      if (type === 'doc' && this.selectedDocType) {
        formData.append('docType', this.selectedDocType);
      }

      if (type === 'doc') this.uploadingDoc = true;
      else this.uploadingPic = true;

      const apiPath = type === 'doc' ? 'EquipDoc/Upload' : 'EquipPic/Upload';

      return this.commonService.post(apiPath, formData).subscribe({
        next: (data) => {
          if (type === 'doc') {
            this.uploadingDoc = false;
            this.message.success('Tải lên tài liệu thành công!');
            this.loadEquipFiles(this._serviceEquipDoc, 'equipDocuments', equnr);
          } else {
            this.uploadingPic = false;
            this.message.success('Tải lên hình ảnh thành công!');
            this.loadEquipFiles(this._serviceEquipPic, 'equipPictures', equnr);
          }
          item.onSuccess?.(data, item.file, null);
        },
        error: (error) => {
          if (type === 'doc') this.uploadingDoc = false;
          else this.uploadingPic = false;
          console.error('Upload error:', error);
          this.message.error(`Tải lên ${type === 'doc' ? 'tài liệu' : 'hình ảnh'} thất bại: ${error.message || error.status}`);
          item.onError?.(error, item.file);
        }
      });
    } catch (err) {
      console.error('Exception during upload:', err);
      this.message.error(`Lỗi không xác định khi tải lên ${type === 'doc' ? 'tài liệu' : 'hình ảnh'}`);
      item?.onError?.(err as Error, item.file);
      return new Subscription();
    }
  };

  handleDocUpload = (item: NzUploadXHRArgs): Subscription => this.handleUpload(item, 'doc');
  handlePicUpload = (item: NzUploadXHRArgs): Subscription => this.handleUpload(item, 'pic');


  deleteDocument(id: string): void {
    this._serviceEquipDoc.delete(id).subscribe({
      next: () => {
        this.message.success('Xóa tài liệu thành công!');
        this.loadEquipFiles(this._serviceEquipDoc, 'equipDocuments', this.currentEquipCode);
      },
      error: (error) => {
        this.message.error('Xóa tài liệu thất bại!');
        console.error('Error deleting document:', error);
      },
    });
  }

  deletePicture(id: string): void {
    this._serviceEquipPic.delete(id).subscribe({
      next: () => {
        this.message.success('Xóa hình ảnh thành công!');
        this.loadEquipFiles(this._serviceEquipPic, 'equipPictures', this.currentEquipCode);
      },
      error: (error) => {
        this.message.error('Xóa hình ảnh thất bại!');
        console.error('Error deleting picture:', error);
      },
    });
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this._global.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  handlePreviewCancel = (): void => {
    this.previewVisible = false;
    this.previewImage = '';
  };

  handleUploadChange(info: any, type: 'pic' | 'doc'): void {
    const isUploading = info.file.status === 'uploading';
    const isDone = info.file.status === 'done';
    const isError = info.file.status === 'error';

    if (isUploading) {
      type === 'pic' ? this.uploadingPic = true : this.uploadingDoc = true;
      return;
    }

    if (isDone) {
      type === 'pic' ? this.uploadingPic = false : this.uploadingDoc = false;

      if (info.file.response?.status) {
        this.message.success(`Tải lên ${type === 'pic' ? 'hình ảnh' : 'tài liệu'} thành công!`);
        if (type === 'pic') {
          info.file.url = info.file.response.data?.path;
          this.loadEquipFiles(this._serviceEquipPic, 'equipPictures', this.currentEquipCode || this.validateForm.get('equnr')?.value);
        } else {
          this.loadEquipFiles(this._serviceEquipDoc, 'equipDocuments', this.currentEquipCode || this.validateForm.get('equnr')?.value);
        }
      } else {
        this.message.error(`Tải lên ${type === 'pic' ? 'hình ảnh' : 'tài liệu'} thất bại: ${info.file.response?.messageObject?.message || 'Lỗi không xác định'}`);
      }

    } else if (isError) {
      type === 'pic' ? this.uploadingPic = false : this.uploadingDoc = false;
      this.message.error(`Tải lên ${type === 'pic' ? 'hình ảnh' : 'tài liệu'} thất bại: ${info.file.error?.status || 'Lỗi không xác định'}`);
    }
  }

  handlePicUploadChange(info: any): void {
    this.handleUploadChange(info, 'pic');
  }

  handleDocUploadChange(info: any): void {
    this.handleUploadChange(info, 'doc');
  }

  downloadQrCode(): void {
    const canvas = document.getElementById('download-qr-equip')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      this.download.nativeElement.href = canvas.toDataURL('image/png');
      this.download.nativeElement.download = 'ng-zorro-antd';
      const event = new MouseEvent('click');
      this.download.nativeElement.dispatchEvent(event);
    }
  }
}
