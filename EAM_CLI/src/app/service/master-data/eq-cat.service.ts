import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EqCatService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('EqCat/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('EqCat/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('EqCat/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('EqCat/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`EqCat/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
      return this.commonService.downloadFile('EqCat/Export', params)
    }
}
