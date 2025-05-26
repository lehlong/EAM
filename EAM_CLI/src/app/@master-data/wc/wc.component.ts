import { Component } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { WcService } from '../../service/master-data/wc.service';
import { ShareModule } from '../../shared/share-module';
import { PlantService } from '../../service/master-data/plant.service';

@Component({
  selector: 'app-plan',
  imports: [ShareModule],
  templateUrl: './wc.component.html',
  styleUrl: './wc.component.scss',
})
export class WcComponent {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstPlants: any[] = [];

  constructor(
    private _service: WcService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private message: NzMessageService,
    private plant: PlantService
  ) {
    this.validateForm = this.fb.group({
      arbpl: ['', [Validators.required]],
      arbplTxt: ['', [Validators.required]],
      iwerk: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Bộ phận sửa chữa',
        path: 'master-data/wc',
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
    this.getPlants();
  }

  getPlants() {
    this.plant.getAll().subscribe({
      next: (data) => {
        this.lstPlants = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getNamePlant(iwerk: string): string {
    const plant = this.lstPlants.find((plant) => plant.iwerk === iwerk);
    return plant ? plant.iwerkTxt : iwerk;
  }

  onSortChange(iwerkTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: iwerkTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
 exportExcel() {
    return this._service
      .exportExcel(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-bo-phan-bao-tri.xlsx'
        anchor.href = url
        anchor.click()
      })
  }
  search() {
    this.isSubmit = false;
    this._service.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
        console.log(this.paginationResult);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  isCodeExist(iwerk: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.iwerk === iwerk
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
      } else {
        const formData = this.validateForm.getRawValue();
        if (this.isCodeExist(formData.iwerk)) {
          this.message.error(
            `Mã ${formData.iwerk} đã tồn tại, vui lòng nhập lại`
          );
          return;
        }
        this._service.create(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
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
    this.resetForm();
  }

  reset() {
    this.filter = new BaseFilter();
    this.search();
  }

  openCreate() {
    this.edit = false;
    this.visible = true;
  }

  resetForm() {
    this.validateForm.reset();
    this.isSubmit = false;
  }

  deleteItem(iwerk: string) {
    this._service.delete(iwerk).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: any) {
    this.validateForm.setValue({
      arbpl: data.arbpl,
      arbplTxt: data.arbplTxt,
      iwerk: data.iwerk,
      isActive: data.isActive,
    });
    setTimeout(() => {
      this.edit = true;
      this.visible = true;
    }, 200);
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
}

