import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TranEqCounterService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('TranEqCounter/Search', params)
  }
  GetByAufnr(aufnr: string): Observable<any> {
    return this.commonService.get(`TranEqCounter/GetByAufnr/${aufnr}`)
  }

  getAll(): Observable<any> {
    return this.commonService.get('TranEqCounter/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('TranEqCounter/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('TranEqCounter/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`TranEqCounter/Delete/${id}`)
  }
  addTranEqCounter(aufnr: string, equnr: string): Observable<any> {
    const data = {
      aufnr: aufnr,
      equnr: equnr,
      isActive: true
    };
    return this.commonService.post('TranEqCounter/AddTranEqCounter', data)
  }
}
