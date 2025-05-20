import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class OrderVtService {
  constructor(private commonService: CommonService) { }
saveOrderVt(params: any): Observable<any> {
  return this.commonService.post('OrderVt/SaveOrderVt', params)
}

getByAufnrAndType(aufnr: string, category: string): Observable<any> {
  return this.commonService.get(`OrderVt/GetByAufnrAndType?aufnr=${aufnr}&category=${category}`)
}

getByAufnr(aufnr: string): Observable<any> {
  return this.commonService.get(`OrderVt/GetByAufnr/${aufnr}`)
}
delete(id: string): Observable<any> {
    return this.commonService.delete(`OrderVt/Delete/${id}`)
  }

}
