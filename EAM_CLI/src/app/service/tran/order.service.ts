import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private commonService: CommonService) {}

  search(params: any): Observable<any> {
    return this.commonService.get('Order/Search', params);
  }

  searchOrderPlan(params: any): Observable<any> {
    return this.commonService.get('Order/SearchOrderPlan', params);
  }

  searchApproval(params: any): Observable<any> {
    return this.commonService.get('Order/SearchApproval', params);
  }

  exportExcelOrder(aufnr: string): Observable<any> {
    return this.commonService.get(`Order/ExportExcel?aufnr=${aufnr}`);
  }

  searchClose(params: any): Observable<any> {
    return this.commonService.get('Order/SearchClose', params);
  }

  getAll(): Observable<any> {
    return this.commonService.get('Order/GetAll');
  }

  getDetail(code: any): Observable<any> {
    return this.commonService.get(`Order/GetDetail?code=${code}`);
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Order/Insert', params);
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Order/Update', params);
  }

  updateListOrder(params: any): Observable<any> {
    return this.commonService.put('Order/UpdateListOrder', params);
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Order/Delete/${id}`);
  }

  getLastQmnum(qmart?: string): Observable<any> {
    const url = qmart
      ? `Order/GetLastQmnum?qmart=${qmart}`
      : 'Order/GetLastQmnum';
    return this.commonService.get(url).pipe(
      map((response) => {
        console.log('Raw API response:', response);
        return response;
      })
    );
  }
}
