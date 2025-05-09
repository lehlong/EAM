import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ActiveStatusService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('ActiveStatus/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('ActiveStatus/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('ActiveStatus/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('ActiveStatus/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`ActiveStatus/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('ActiveStatus/Export', params)
  }
} 