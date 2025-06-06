import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanHService {
  constructor(private commonService: CommonService) {}

  search(params: any): Observable<any> {
    return this.commonService.get('PlanH/Search', params);
  }

  searchPlan(params: any): Observable<any> {
    return this.commonService.get('PlanH/SearchPlan', params);
  }

  genarateOrder(params: any): Observable<any> {
    return this.commonService.get('PlanH/GenarateOrder', params);
  }

  genarateOrderSelect(params: any): Observable<any> {
    return this.commonService.post('PlanH/GenarateOrderSelect', params);
  }

  exportReport(params: any): Observable<any> {
    return this.commonService.get('PlanH/ExportReport', {});
  }

  genarateCode(params: any): Observable<any> {
    return this.commonService.get(`PlanH/GenarateCode?m=${params}`);
  }

  getAll(): Observable<any> {
    return this.commonService.get('PlanH/GetAll');
  }

  create(params: any): Observable<any> {
    return this.commonService.post('PlanH/Insert', params);
  }

  update(params: any): Observable<any> {
    return this.commonService.put('PlanH/Update', params);
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`PlanH/Delete/${id}`);
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('PlanH/Export', params);
  }
}
