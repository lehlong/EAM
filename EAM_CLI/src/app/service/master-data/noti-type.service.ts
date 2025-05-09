import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NotiTypeService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('NotiType/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('NotiType/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('NotiType/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('NotiType/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`NotiType/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('NotiType/Export', params)
  }
}
