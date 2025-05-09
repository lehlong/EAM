import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CataTypeService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('CataType/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('CataType/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('CataType/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('CataType/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`CataType/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('CataType/Export', params)
  }
} 