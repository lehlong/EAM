import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Item/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Item/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Item/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Item/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Item/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('Item/Export', params)
  }
}
