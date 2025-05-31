import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EqCounterService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('EqCounter/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('EqCounter/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('EqCounter/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('EqCounter/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`EqCounter/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
      return this.commonService.downloadFile('EqCounter/Export', params)
    }
}
