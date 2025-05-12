import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UsageStatusService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('UsageStatus/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('UsageStatus/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('UsageStatus/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('UsageStatus/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`UsageStatus/Delete/${id}`)
  }
  
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('UsageStatus/Export', params)
  }
} 