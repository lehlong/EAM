import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { BaseFilter, PaginationResult } from '../../models/base.model';
import { GlobalService } from '../../service/global.service';
import { NotiService } from '../../service/tran/noti.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-incident-list',
  imports: [ShareModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent {
  filter = new BaseFilter();
  loading: boolean = false;
  paginationResult = new PaginationResult();
  constructor(
    private _sNoti: NotiService,
    private globalService: GlobalService,
    private message: NzMessageService

  ) {

    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách sự cố',
        path: 'incident/incident-list',
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
  deleteIncident(qmnum: string): void {
    this._sNoti.delete(qmnum).subscribe({
      next: (res) => {
        if (res && res.status) {
          this.message.success('Xóa sự cố thành công');
          this.search();
        } else {
          this.message.error('Xóa sự cố thất bại');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('Đã xảy ra lỗi khi xóa sự cố');
      }
    });
  }
  printIncident(qmnum: string): void {
    this.message.info(`Đang chuẩn bị in sự cố ${qmnum}`);
    // Triển khai chức năng in
  }
  getPriorityText(priok: string): string {
    switch(priok) {
      case '1': return 'Rất Cao';
      case '2': return 'Cao';
      case '3': return 'Trung Bình';
      case '4': return 'Thấp';
      case '5': return 'Rất Thấp';
      default: return priok || '';
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
