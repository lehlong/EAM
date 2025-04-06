import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FlocService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Floc/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Floc/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Floc/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Floc/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Floc/Delete/${id}`)
  }
}
