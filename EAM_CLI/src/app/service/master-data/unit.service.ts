import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Unit/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Unit/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Unit/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Unit/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Unit/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('Unit/Export', params)
  }
}
