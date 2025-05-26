import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TasklistService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Tasklist/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Tasklist/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Tasklist/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Tasklist/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Tasklist/Delete/${id}`)
  }
    exportExcel(params: any): Observable<any> {
      return this.commonService.downloadFile('Tasklist/Export', params)
    }
}
