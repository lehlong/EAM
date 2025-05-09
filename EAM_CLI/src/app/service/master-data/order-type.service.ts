import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class OrderTypeService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('OrderType/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('OrderType/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('OrderType/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('OrderType/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`OrderType/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('OrderType/Export', params)
  }
}
