import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ShareModule } from '../shared/share-module';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseFilter, PaginationResult } from '../models/base.model';
import { GlobalService } from '../service/global.service';
import { EqGroupService } from '../service/master-data/eq-group.service';
import { EquipService } from '../service/master-data/equip.service';
import { FlocService } from '../service/master-data/floc.service';
import { NotiTypeService } from '../service/master-data/noti-type.service';
import { OrderTypeService } from '../service/master-data/order-type.service';
import { PlantService } from '../service/master-data/plant.service';
import { PlgrpService } from '../service/master-data/plgrp.service';
import { WcService } from '../service/master-data/wc.service';
import { AccountService } from '../service/system-manager/account.service';
import { NotiService } from '../service/tran/noti.service';
import { OrderService } from '../service/tran/order.service';
import { PriorityLevel } from '../shared/constants/select.constants';
declare var google: any;

@Component({
  selector: 'app-home',
  imports: [ShareModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  checked: boolean = false;
  filter = new BaseFilter();
  filterOrder = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  paginationOrder = new PaginationResult();
  lstFloc: any = [];
  lstUser: any = [];
  lstWc: any[] = [];
  lstEquip: any[] = [];
  lstEqGroup: any[] = [];
  lstPlgrp: any[] = [];
  lstPlant: any[] = [];
  lstPriorityLevel = PriorityLevel;
  lstNotiTp: any[] = [];
  lstOrderType: any[] = [];
  dataDashboard: any = {
    chartBar: [],
    chartDonut: [],
    order1: 0,
    order2: 0,
    order3: 0,
    order4: 0,
    noti1: 0,
    noti2: 0,
    noti3: 0,
    noti4: 0,
  };

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
    ltrmn: new Date(),
    qmdat: new Date(),
    isActive: true,
  };

  getDataDashboard() {
    this._sNoti.getDataDashboard(this.defaultTplnr).subscribe({
      next: (data) => {
        this.dataDashboard = data;
        setTimeout(() => {
          google.charts.load('current', { packages: ['corechart'] });
          google.charts.setOnLoadCallback(() => this.drawChartDonut());
          google.charts.setOnLoadCallback(() => this.drawChartBar());
        }, 200);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  drawChartDonut() {
    //var filter = this.dataDashboard.chartDonut.filter((x: { value: number; }) => x.value != 0)
    var filter = this.dataDashboard.chartDonut;
    var temp: any = [];
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Trạng thái');
    data.addColumn('number', '%');
    filter.forEach((i: any) => {
      temp.push([i.name, i.value]);
    });
    data.addRows(temp);

    var options = {
      chartArea: { width: '90%', height: '70%' },
      title: 'TRẠNG THÁI HỆ THỐNG THIẾT BỊ',
      pieHole: 0.5,
    };

    var chart = new google.visualization.PieChart(
      document.getElementById('donutchart')
    );
    chart.draw(data, options);
  }

  drawChartBar() {
    const filter = this.dataDashboard.chartBar;
    const temp: any[] = filter.map((i: any) => [i.name, i.value, i.value.toString()]);

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Nhóm hệ thống thiết bị');
    data.addColumn('number', 'Số lượng');
    data.addColumn({ type: 'string', role: 'annotation' }); // 👈 Thêm annotation

    data.addRows(temp);

    const chartWidth = Math.max(400, temp.length * 72);
    const chartHeight = 360;

    const options = {
      legend: 'none',
      title: 'PHÂN LOẠI HỆ THỐNG THIẾT BỊ',
      width: chartWidth,
      height: chartHeight,
      chartArea: {
        width: '90%',
        height: '70%',
      },
      hAxis: {
        slantedText: false,
        showTextEvery: 1,
        textStyle: {
          fontSize: 12,
        },
      },
      vAxis: {
        minValue: 0,
        textStyle: {
          fontSize: 12,
        },
      },
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById('chart_div')
    );
    chart.draw(data, options);
  }


  constructor(
    private router: Router,
    private _sOrder: OrderService,
    private _sOrderType: OrderTypeService,
    private _sNotiTp: NotiTypeService,
    private _sPlant: PlantService,
    private _sNoti: NotiService,
    private _sWc: WcService,
    private _sEquip: EquipService,
    public globalService: GlobalService,
    private message: NzMessageService,
    private _sFloc: FlocService,
    private _sAccount: AccountService,
    private _sEqGroup: EqGroupService,
    private _sPlgrp: PlgrpService
  ) { }
  changeRoute(router: string) {
    this.router.navigate([`${router}`]);
  }
  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }

  defaultTplnr: any;
  ngOnInit(): void {
    this.defaultTplnr = this.globalService.getUserInfo()?.tplnr || '';
    this.search();
    this.searchOrder();
    this.getAllFloc();
    this.getAllUser();
    this.getAllWc();
    this.getAllEquip();
    this.getAllEgGroup();
    this.getAllPlgrp();
    this.getAllPlant();
    this.getAllNotiTp();
    this.getAllOrderType();
    this.getDataDashboard();
  }
  exportExcel() {
    return this._sNoti.exportExcel(this.filter).subscribe((result: Blob) => {
      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.download = 'danh-sach-su-co.xlsx';
      anchor.href = url;
      anchor.click();
    });
  }

  search() {
    this._sNoti.search(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  searchOrder() {
    this._sOrder.searchOrderPlan(this.filterOrder).subscribe({
      next: (data) => {
        this.paginationOrder = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  visibleOrder: boolean = false;
  openAddOrder(data: any) {
    this.model = data;
    this.model.auart = 'PM02';
    this.visibleOrder = true;
  }
  closeOrder() {
    this.visibleOrder = false;
  }
  createOrder() {
    this._sOrder.create(this.model).subscribe({
      next: (data) => {
        this.search();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllPlant() {
    this._sPlant.getAll().subscribe({
      next: (data) => {
        this.lstPlant = data;
      },
    });
  }

  getAllOrderType() {
    this._sOrderType.getAll().subscribe({
      next: (data) => {
        this.lstOrderType = data;
      },
    });
  }

  getAllNotiTp() {
    this._sNotiTp.getAll().subscribe({
      next: (data) => {
        this.lstNotiTp = data;
      },
    });
  }

  getAllPlgrp() {
    this._sPlgrp.getAll().subscribe({
      next: (data) => {
        this.lstPlgrp = data;
      },
    });
  }

  getAllEgGroup() {
    this._sEqGroup.getAll().subscribe({
      next: (data) => {
        this.lstEqGroup = data;
      },
    });
  }

  getAllUser() {
    this._sAccount.getListUser().subscribe({
      next: (data) => {
        this.lstUser = data;
      },
    });
  }

  getAllWc() {
    this._sWc.getAll().subscribe({
      next: (data) => {
        this.lstWc = data;
      },
    });
  }

  getAllEquip() {
    this._sEquip.getAll().subscribe({
      next: (data) => {
        this.lstEquip = data;
      },
    });
  }

  updateStatusNoti(data: any, status: string) {
    data.statAct = status;
    this._sNoti.update(data).subscribe({
      next: () => {
        this.search();
      },
    });
  }

  getFullNameUser(username: any) {
    return this.lstUser.find(
      (x: { userName: string }) => x.userName == username
    )?.fullName;
  }
  getNameWc(code: any) {
    return this.lstWc.find((x) => x.arbpl == code)?.arbplTxt;
  }

  getNameEquip(code: any) {
    return this.lstEquip.find((x) => x.equnr == code)?.eqktx;
  }

  getAllFloc() {
    this._sFloc.getAll().subscribe({
      next: (data) => {
        this.lstFloc = data;
      },
    });
  }
  getFlocName(code: any) {
    return this.lstFloc.find((x: { tplnr: string }) => x.tplnr == code)
      ?.descript;
  }

  getPriorityText(priok: string): string {
    switch (priok) {
      case '1':
        return 'Rất Cao';
      case '2':
        return 'Cao';
      case '3':
        return 'Trung Bình';
      case '4':
        return 'Thấp';
      case '5':
        return 'Rất Thấp';
      default:
        return priok || '';
    }
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
