import { Component } from '@angular/core';
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
import { OrganizeService } from '../../service/system-manager/organize.service';
import { UsageStatusService } from '../../service/master-data/usage-status.service';
import { ActiveStatusService } from '../../service/master-data/active-status.service';
import { AccountService } from '../../service/system-manager/account.service';
import { EquipFilter } from '../../filter/master-data/equiq-filter';
import { EquipCharService } from '../../service/master-data/equiq-char.service';
import { EquiqCharModel } from '../../models/master-data/eqchar.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equip',
  imports: [ShareModule],
  templateUrl: './equip.component.html',
  styleUrl: './equip.component.scss',
})
export class EquipComponent {
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
  lstEqChar: any = [];
  loading: boolean = false;

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
    private _sOrganize: OrganizeService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private message: NzMessageService,
    private commonService: CommonService,
    private _sEqChar: EquipCharService,
    private router: Router,
  ) {
    this.validateForm = this.fb.group({
      equnr: ['', [Validators.required]],
      eqktx: [''],
      iwerk: [''],
      datab: [''],
      datbi: [''],
      tplnr: [''],
      ingrp: [''],
      eqtyp: [''],
      eqart: [''],
      eqartSub: [''],
      eqartTp: [''],
      hequi: [''],
      parentFlg: [''],
      childCnt: [0],
      arbpl: [''],
      kostl: [''],
      beber: [''],
      statAct: [''],
      statActT: [''],
      statusTh: [''],
      anlnr: [''],
      anlun: [''],
      klart: [''],
      class: [''],
      auspFlg: [''],
      delFlg: [''],
      delDate: [''],
      inactFlg: [''],
      inactDate: [''],
      inbdt: [''],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Thiết bị',
        path: 'master-data/equip',
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
    this.getEqGroup();
    this.searchFlant();
    this.searchFloc();
    this.searchCat();
    this.getAllEquip();
    this.getEqWc();
    this.getAllOrganize();
    this.getAllActiveStatus();
    this.getAllUsageStatus();
    this.getAllAccount();
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
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-thiet-bi.xlsx'
        anchor.href = url
        anchor.click()
      })
  }
  addEqChar() {
    const EquipChar = new EquiqCharModel();
    EquipChar.equnr = this.currentEquipCode;
    this.lstEqChar = [...this.lstEqChar, EquipChar];
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

  getAllAccount() {
    this._sAccount.getListUser().subscribe({
      next: (data) => {
        this.lstAccount = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getAllUsageStatus() {
    this._sUsageStatus.getAll().subscribe({
      next: (data) => {
        this.lstUsageStatus = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getAllActiveStatus() {
    this._sActiveStatus.getAll().subscribe({
      next: (data) => {
        this.lstActiveStatus = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getAllEquip() {
    this._service.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getAllOrganize() {
    this._sOrganize.getOrg().subscribe({
      next: (data) => {
        this.lstOrganize = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchFlant() {
    this.isSubmit = false;
    this._servicePlant.getAll().subscribe({
      next: (data) => {
        this.lstPlant = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  searchFloc() {
    this.isSubmit = false;
    this._serviceFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Retrieves a list of equipment categories from the service and updates the
   * `lstEqCat` property with the retrieved data. Resets the `isSubmit` flag to false.
   * Logs any error responses received during the data retrieval process.
   */

  /*******  8d15dc4e-0540-4331-9832-af3a2506f521  *******/
  searchCat() {
    this.isSubmit = false;
    this._serviceCat.getAll().subscribe({
      next: (data) => {
        this.lstEqCat = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getEqGroup() {
    this.isSubmit = false;
    this._serviceEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getEqWc() {
    this.isSubmit = false;
    this._serviceWc.getAll().subscribe({
      next: (data) => {
        this.lstEqWc = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getNameEquart(code: string) {
    return this.lstEqGroup.find((x: { eqart: string }) => x.eqart == code)
      ?.eqartTxt;
  }

  getNameFloc(code: string) {
    return this.lstFloc.find((x: { tplnr: string }) => x.tplnr == code)
      ?.descript;
  }

  getEquipmentCategoryName(code: string) {
    return this.lstEqCat.find((x: { eqtyp: string }) => x.eqtyp == code)
      ?.eqtypTxt;
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
            this.message.success('Cập nhật thiết bị thành công!');
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
        this._sEqChar.create(this.lstEqChar).subscribe({
          next: (data) => {
          },
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
            this.message.success('Tạo thiết bị mới thành công!');
            // Set the currentEquipCode to enable file uploads after creating the equipment
            this.currentEquipCode = this.validateForm.get('equnr')?.value;
            // Set edit mode to true to enable editing uploaded files
            this.edit = true;
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
        this._sEqChar.create(this.lstEqChar).subscribe({
          next: (data) => {
          },
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

  close() {
    this.visible = false;
    this.selectedDocType = '';
    this.equipDocuments = [];
    this.equipPictures = [];
    this.currentEquipCode = '';
    this.lstEqChar = [];
  }

  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  openCreate() {
    this.edit = false;
    this.visible = true;
    this.resetForm();

    // Reset documents and pictures
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
  console.log('Query Params:', queryParams);
  this.router.navigate(['/incident/create'], { 
    queryParams: queryParams 
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
    this.edit = true;
    this.visible = true;
    this.resetForm();
    this.validateForm.patchValue(data);
    this.currentEquipCode = data.equnr;
    this._sEqChar.getDetail(data.equnr).subscribe({
      next: (data) => {
        this.lstEqChar = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
    this.loadEquipDocuments(data.equnr);
    this.loadEquipPictures(data.equnr);
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
  loadEquipDocuments(equnr: string) {
    this._serviceEquipDoc.getByEqunr(equnr).subscribe({
      next: (data) => {
        this.equipDocuments = data;
        this.equipDocuments.forEach((i) => {
          i.path = environment.urlFiles + '/' + i.path;
        });
      },
      error: (error) => {
        console.error('Error loading equipment documents:', error);
      },
    });
  }

  // Method to load equipment pictures
  loadEquipPictures(equnr: string) {
    this._serviceEquipPic.getByEqunr(equnr).subscribe({
      next: (data) => {
        this.equipPictures = data;
        this.equipPictures.forEach((i) => {
          i.path = environment.urlFiles + '/' + i.path;
        });
      },
      error: (error) => {
        console.error('Error loading equipment pictures:', error);
      },
    });
  }

  // Document upload beforeUpload handler
  beforeDocUpload = (file: NzUploadFile): Observable<boolean> => {
    return new Observable((observer: Observer<boolean>) => {
      try {
        console.log('Document beforeUpload:', {
          file: 'File object exists: ' + (file !== null && file !== undefined),
          filename: file?.name || 'N/A',
          filetype: file?.type || 'N/A',
        });

        if (!file || !file.name) {
          this.message.error('Lỗi: File không hợp lệ');
          observer.next(false);
          observer.complete();
          return;
        }

        observer.next(true);
        observer.complete();
      } catch (err) {
        console.error('Error in beforeDocUpload:', err);
        observer.next(false);
        observer.complete();
      }
    });
  };

  // Picture upload beforeUpload handler
  beforePicUpload = (file: NzUploadFile): Observable<boolean> => {
    return new Observable((observer: Observer<boolean>) => {
      try {
        console.log('Picture beforeUpload:', {
          file: 'File object exists: ' + (file !== null && file !== undefined),
          filename: file?.name || 'N/A',
          filetype: file?.type || 'N/A',
        });

        if (!file || !file.name) {
          this.message.error('Lỗi: File không hợp lệ');
          observer.next(false);
          observer.complete();
          return;
        }

        const isImageType = file.type?.startsWith('image/');
        if (!isImageType) {
          this.message.error('Bạn chỉ có thể tải lên file hình ảnh!');
          observer.next(false);
          observer.complete();
          return;
        }

        observer.next(true);
        observer.complete();
      } catch (err) {
        console.error('Error in beforePicUpload:', err);
        observer.next(false);
        observer.complete();
      }
    });
  };

  // Handle document upload custom request
  handleDocUpload = (item: NzUploadXHRArgs): Subscription => {
    try {
      // Check if item and file exist
      if (!item || !item.file) {
        this.message.error('Lỗi khi tải lên: Không tìm thấy file');
        return new Subscription();
      }

      // Get the actual File object (not the NzUploadFile wrapper)
      const file = item.file.originFileObj as File;

      // Check if file is valid
      if (!file) {
        this.message.error('Lỗi khi tải lên: File không hợp lệ');
        item.onError!(new Error('Invalid file object'), item.file);
        return new Subscription();
      }

      // Check if we have a valid equipment code
      if (!this.currentEquipCode) {
        // If creating a new equipment, use the form value
        this.currentEquipCode = this.validateForm.get('equnr')?.value;

        if (!this.currentEquipCode) {
          this.message.error(
            'Bạn cần nhập mã thiết bị trước khi tải lên tài liệu!'
          );
          item.onError!(new Error('Missing equipment code'), item.file);
          return new Subscription();
        }
      }

      // Clean the equnr value by removing any whitespace and newline characters
      const cleanEqunr = this.currentEquipCode.trim().replace(/[\r\n]+/g, '');

      // Log the values being sent to help debug
      console.log('Uploading document with params:', {
        file: 'File object exists: ' + (file !== null && file !== undefined),
        filename: file?.name || 'N/A',
        filesize: file?.size || 'N/A',
        filetype: file?.type || 'N/A',
        equnr: cleanEqunr,
        docType: this.selectedDocType,
      });

      this.uploadingDoc = true;

      // Directly create FormData to ensure it's constructed correctly
      const formData = new FormData();
      formData.append('file', file);
      formData.append('equnr', cleanEqunr);
      if (this.selectedDocType) {
        formData.append('docType', this.selectedDocType);
      }

      // Use the CommonService directly with the constructed FormData
      return this.commonService.post('EquipDoc/Upload', formData).subscribe({
        next: (data) => {
          this.uploadingDoc = false;
          this.message.success('Tải lên tài liệu thành công!');
          this.loadEquipDocuments(cleanEqunr);
          item.onSuccess!(data, item.file, null);
        },
        error: (error) => {
          this.uploadingDoc = false;
          console.error('Upload error:', error);
          this.message.error(
            'Tải lên tài liệu thất bại: ' + (error.message || error.status)
          );
          item.onError!(error, item.file);
        },
      });
    } catch (err) {
      console.error('Exception during document upload:', err);
      this.message.error('Lỗi không xác định khi tải lên tài liệu');
      if (item && item.onError) {
        item.onError(err as Error, item.file);
      }
      return new Subscription();
    }
  };

  // Handle picture upload custom request
  handlePicUpload = (item: NzUploadXHRArgs): Subscription => {
    try {
      // Check if item and file exist
      if (!item || !item.file) {
        this.message.error('Lỗi khi tải lên: Không tìm thấy file');
        return new Subscription();
      }

      // Get the actual File object (not the NzUploadFile wrapper)
      const file = item.file.originFileObj as File;

      // Check if file is valid
      if (!file) {
        this.message.error('Lỗi khi tải lên: File không hợp lệ');
        item.onError!(new Error('Invalid file object'), item.file);
        return new Subscription();
      }

      // Check if we have a valid equipment code
      if (!this.currentEquipCode) {
        // If creating a new equipment, use the form value
        this.currentEquipCode = this.validateForm.get('equnr')?.value;

        if (!this.currentEquipCode) {
          this.message.error(
            'Bạn cần nhập mã thiết bị trước khi tải lên hình ảnh!'
          );
          item.onError!(new Error('Missing equipment code'), item.file);
          return new Subscription();
        }
      }

      // Clean the equnr value by removing any whitespace and newline characters
      const cleanEqunr = this.currentEquipCode.trim().replace(/[\r\n]+/g, '');

      // Log the values being sent to help debug
      console.log('Uploading picture with params:', {
        file: 'File object exists: ' + (file !== null && file !== undefined),
        filename: file?.name || 'N/A',
        filesize: file?.size || 'N/A',
        filetype: file?.type || 'N/A',
        equnr: cleanEqunr,
      });

      this.uploadingPic = true;

      // Directly create FormData to ensure it's constructed correctly
      const formData = new FormData();
      formData.append('file', file);
      formData.append('equnr', cleanEqunr);

      // Use the CommonService directly with the constructed FormData
      return this.commonService.post('EquipPic/Upload', formData).subscribe({
        next: (data) => {
          this.uploadingPic = false;
          this.message.success('Tải lên hình ảnh thành công!');
          this.loadEquipPictures(cleanEqunr);
          item.onSuccess!(data, item.file, null);
        },
        error: (error) => {
          this.uploadingPic = false;
          console.error('Upload error:', error);
          this.message.error(
            'Tải lên hình ảnh thất bại: ' + (error.message || error.status)
          );
          item.onError!(error, item.file);
        },
      });
    } catch (err) {
      console.error('Exception during picture upload:', err);
      this.message.error('Lỗi không xác định khi tải lên hình ảnh');
      if (item && item.onError) {
        item.onError(err as Error, item.file);
      }
      return new Subscription();
    }
  };

  // Delete equipment document
  deleteDocument(id: string): void {
    this._serviceEquipDoc.delete(id).subscribe({
      next: () => {
        this.message.success('Xóa tài liệu thành công!');
        this.loadEquipDocuments(this.currentEquipCode);
      },
      error: (error) => {
        this.message.error('Xóa tài liệu thất bại!');
        console.error('Error deleting document:', error);
      },
    });
  }

  // Delete equipment picture
  deletePicture(id: string): void {
    this._serviceEquipPic.delete(id).subscribe({
      next: () => {
        this.message.success('Xóa hình ảnh thành công!');
        this.loadEquipPictures(this.currentEquipCode);
      },
      error: (error) => {
        this.message.error('Xóa hình ảnh thất bại!');
        console.error('Error deleting picture:', error);
      },
    });
  }

  // Preview image
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result!.toString());
      reader.onerror = (error) => reject(error);
    });

  // Close image preview
  handlePreviewCancel = (): void => {
    this.previewVisible = false;
    this.previewImage = '';
  };

  handlePicUploadChange(info: any): void {
    if (info.file.status === 'uploading') {
      this.uploadingPic = true;
      return;
    }

    if (info.file.status === 'done') {
      this.uploadingPic = false;
      if (info.file.response && info.file.response.status) {
        this.message.success('Tải lên hình ảnh thành công!');
        info.file.url = info.file.response.data?.path;
        this.loadEquipPictures(
          this.currentEquipCode || this.validateForm.get('equnr')?.value
        );
      } else {
        this.message.error(
          'Tải lên hình ảnh thất bại: ' +
          (info.file.response?.messageObject?.message || 'Lỗi không xác định')
        );
      }
    } else if (info.file.status === 'error') {
      this.uploadingPic = false;
      this.message.error(
        'Tải lên hình ảnh thất bại: ' +
        (info.file.error?.status || 'Lỗi không xác định')
      );
    }
  }

  handleDocUploadChange(info: any): void {
    if (info.file.status === 'uploading') {
      this.uploadingDoc = true;
      return;
    }

    if (info.file.status === 'done') {
      this.uploadingDoc = false;
      if (info.file.response && info.file.response.status) {
        this.message.success('Tải lên tài liệu thành công!');
        this.loadEquipDocuments(
          this.currentEquipCode || this.validateForm.get('equnr')?.value
        );
      } else {
        this.message.error(
          'Tải lên tài liệu thất bại: ' +
          (info.file.response?.messageObject?.message || 'Lỗi không xác định')
        );
      }
    } else if (info.file.status === 'error') {
      this.uploadingDoc = false;
      this.message.error(
        'Tải lên tài liệu thất bại: ' +
        (info.file.error?.status || 'Lỗi không xác định')
      );
    }
  }
}
