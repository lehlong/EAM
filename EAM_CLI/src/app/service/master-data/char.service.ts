import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CharService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Char/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Char/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Char/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Char/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Char/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('Char/Export', params)
  }
}
