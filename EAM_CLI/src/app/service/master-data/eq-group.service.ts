import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EqGroupService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('EqGroup/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('EqGroup/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('EqGroup/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('EqGroup/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`EqGroup/Delete/${id}`)
  }
}
