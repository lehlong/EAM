import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MTypeService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Mtype/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Mtype/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Mtype/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Mtype/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Mtype/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('Mtype/Export', params)
  }
}
