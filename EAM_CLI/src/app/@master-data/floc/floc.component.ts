import { Component } from '@angular/core';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../service/global.service';
import { FlocService } from '../../service/master-data/floc.service';
import { ShareModule } from '../../shared/share-module';
import { PlantService } from '../../service/master-data/plant.service';

@Component({
  selector: 'app-floc',
  imports: [ShareModule],
  templateUrl: './floc.component.html',
  styleUrl: './floc.component.scss',
})
export class FlocComponent {
  validateForm: FormGroup;
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new BaseFilter();
  paginationResult = new PaginationResult();
  lstPlants: any = [];
  lstFloc: any = [];
  loading: boolean = false;

  constructor(
    private _service: FlocService,
    private _servicePlant: PlantService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      tplnr: ['', [Validators.required]],
      iwerk: [''],
      ingrp: [''],
      descript: [''],
      supfloc: [''],
      arbpl: [''],
      startUpdate: [''],
      txt30: [''],
      isActive: [true, [Validators.required]],
    });
    this.globalService.setBreadcrumb([
      {
        name: 'Khu vực chức năng',
        path: 'master-data/floc',
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
    this.getLstPlants();
    this.getAllFloc();
  }

  onSortChange(tplnrTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: tplnrTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
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

  getAllFloc() {
    this._service.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getNameFloc(tplnr: string): string {
    const floc = this.lstFloc.find((x: { tplnr: string }) => x.tplnr === tplnr);
    return floc ? floc.descript : tplnr;
  }
  getLstPlants() {
    this._servicePlant.getAll().subscribe({
      next: (data) => {
        this.lstPlants = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getNamePlant(iwerk: string): string {
    const plant = this.lstPlants.find(
      (x: { iwerk: string }) => x.iwerk === iwerk
    );
    return plant ? plant.iwerkTxt : iwerk;
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
    this.validateForm.setValue({
      tplnr: data.tplnr,
      ingrp: data.ingrp,
      iwerk: data.iwerk,
      descript: data.descript,
      supfloc: data.supfloc,
      arbpl: data.arbpl,
      startUpdate: data.startUpdate,
      txt30: data.txt30,
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

