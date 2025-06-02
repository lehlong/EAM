import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DropdownService } from '../../service/dropdown/dropdown.service';
import { NonNullableFormBuilder } from '@angular/forms';
import { TranEqCounterService } from '../../service/tran/tran-eq-counter.service';
import { TranEqFilter } from '../../filter/tran/tran-eq.filter';

@Component({
  selector: 'app-counter-list',
  imports: [ShareModule],
  templateUrl: './counter-list.component.html',
  styleUrl: './counter-list.component.scss'
})
export class CounterListComponent {
 
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new TranEqFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  lstUnit: any = [];
  lstEquip: any = [];

  constructor(
    private _service: TranEqCounterService,
    private fb: NonNullableFormBuilder,
    public globalService: GlobalService,
    private message: NzMessageService,
    private dropdownService: DropdownService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Bộ đếm thiết bị',
        path: 'master-data/eq-counter',
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
    this.getallUnit();
    this.getAllEquip();
  }

  onSortChange(eqtypTxt: string, value: any) {
    this.filter = {
      ...this.filter,
      //SortColumn: eqtypTxt,
      //IsDescending: value === 'descend',
    };
    this.search();
  }
  getallUnit() {
    this.dropdownService.getAllUnit().subscribe({
      next: (data) => {
        this.lstUnit = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  getAllEquip() {
    this.dropdownService.getAllEquip().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  search() {
     const filter : any = { ...this.filter };
    if (filter.fromDate) {
      filter.fromDate = this.globalService.formatDatePlanFilter(filter.fromDate);
    }
    if (filter.toDate) {
      filter.toDate = this.globalService.formatDatePlanFilter(filter.toDate);
    }
    this.isSubmit = false;
    this._service.search(filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  
  isCodeExist(eqtyp: string): boolean {
    return this.paginationResult.data?.some(
      (accType: any) => accType.eqtyp === eqtyp
    );
  }


  reset() {
    this.filter = new BaseFilter();
    this.search();
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
