import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ClassHService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('ClassH/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('ClassH/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('ClassH/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('ClassH/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`ClassH/Delete/${id}`)
  }
}
