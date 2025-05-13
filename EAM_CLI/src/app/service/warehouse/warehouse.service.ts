import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Warehouse/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Warehouse/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Warehouse/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Warehouse/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Warehouse/Delete/${id}`)
  }
   exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('Warehouse/Export', params)
  }
}
