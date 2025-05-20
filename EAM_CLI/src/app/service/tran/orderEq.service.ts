import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class OrderEqService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('OrderEq/Search', params)
  }
  GetByAufnr(aufnr: string): Observable<any> {
    return this.commonService.get(`OrderEq/GetByAufnr/${aufnr}`)
  }

  getAll(): Observable<any> {
    return this.commonService.get('OrderEq/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('OrderEq/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('OrderEq/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`OrderEq/Delete/${id}`)
  }
  addOrderEq(aufnr: string, equnr: string): Observable<any> {
    const data = {
      aufnr: aufnr,
      equnr: equnr,
      isActive: true
    };
    return this.commonService.post('OrderEq/AddOrderEq', data)
  }
}
