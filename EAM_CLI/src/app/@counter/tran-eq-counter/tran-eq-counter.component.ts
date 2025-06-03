import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { EqCounterService } from '../../service/master-data/equip-counter.service';
import { ShareModule } from '../../shared/share-module';
import { TranEqCounterService } from '../../service/tran/tran-eq-counter.service';
import { EquipService } from '../../service/master-data/equip.service';

@Component({
  selector: 'app-tran-eq-counter',
  imports: [ShareModule],
  templateUrl: './tran-eq-counter.component.html',
  styleUrl: './tran-eq-counter.component.scss'
})
export class TranEqCounterComponent {

  filter = new BaseFilter();
  loading: boolean = false;
  lstEquip: any = [];
  lstEqCounter: any[] = []
  lstUnit: any[] = []

  model: any = {
    mdocm: 'A',
    point: '',
    equnr: '',
    iDate: '',
    reading: 0,
    dvt: '',
    difValue: 0,
    readText: '',
    isActive: true
  }

  minDate: any = '';
  maxValue: any = '';
  type: any = '';

  constructor(
    private _sCounter: EqCounterService,
    public globalService: GlobalService,
    private message: NzMessageService,
    private _sTranCounter: TranEqCounterService,
    private _sEquip: EquipService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Cập nhật chỉ số hoạt động',
        path: 'master-data/tran-eq-counter',
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
    this.getAllEquip();
  }

  onChangeEquip(e: any) {
    this.filter.equnr = e;
    this._sCounter.search(this.filter).subscribe({
      next: (data) => {
        this.lstEqCounter = data.data.filter((x: any) => x.isActive == true);
        this.model.point = '';
        if (this.lstEqCounter.length == 0) {
          this.message.error('Không có bộ đếm nào cho thiết bị này!')
        }
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  onCreateCounter() {
    const validations = [
      { value: this.model.equnr, message: 'Vui lòng chọn thiết bị' },
      { value: this.model.point, message: 'Vui lòng chọn bộ đếm' },
      { value: this.model.iDate, message: 'Vui lòng chọn ngày đo' },
      { value: this.model.reading, message: 'Vui lòng nhập chỉ số hoạt động' },
    ];

    for (const { value, message } of validations) {
      if (!this.globalService.validateRequired(value, message)) {
        return;
      }
    }
    if (this.model.reading < this.maxValue) {
      this.message.error(`Vui lòng nhập Chỉ số đo >= ${this.maxValue}`);
      return;
    }
    if (this.minDate != '' && this.minDate != null) {
      if (new Date(this.model.iDate) < new Date(this.minDate)) {
        this.message.error(`Vui lòng nhập Ngày đo >= Ngày đo gần nhất!`);
        return;
      }
    }

    this.model.difValue = this.model.reading - this.maxValue
    this.model.iDate = this.globalService.formatDateToSendServer(this.model.iDate);
    this._sTranCounter.create(this.model).subscribe({
      next: (data) => {
        this.reset();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


  onChangePoint(e: any) {
    this.model.dvt = ''
    this.minDate = ''
    var counter = this.lstEqCounter.find(x => x.point == e)
    this.model.dvt = counter.dvt
    this.type = counter.mptyp;
    if (counter.mptyp == '01') {
      this._sTranCounter.GetMaxPoint(counter.equnr, counter.point).subscribe({
        next: (data) => {
          this.maxValue = data.reading
          this.model.reading = data.reading
          this.minDate = data.iDate
        }
      })
    } else {
      this.model.reading = 0;
      this.type = '02';
      this.maxValue = 0;
      this.minDate = '';
    }
  }

  getAllEquip() {
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  reset() {
    this.minDate = ''
    this.filter = new BaseFilter();
    this.model = {
      mdocm: 'A',
      point: '',
      equnr: '',
      iDate: '',
      reading: 0,
      dvt: '',
      difValue: 0,
      readText: '',
      isActive: true
    }
  }
}

