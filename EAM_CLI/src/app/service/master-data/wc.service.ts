import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class WcService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Wc/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Wc/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Wc/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Wc/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Wc/Delete/${id}`)
  }
}
