import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NotiCatalogService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('NotiCatalog/Search', params)
  }
  getByQmnum(qmnum: string): Observable<any> {
  return this.commonService.get(`NotiCatalog/GetByQmnum/${qmnum}`);
}
  getAll(): Observable<any> {
    return this.commonService.get('NotiCatalog/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('NotiCatalog/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('NotiCatalog/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`NotiCatalog/Delete/${id}`)
  }
}
