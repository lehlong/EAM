import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EquipCharService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('EquipChar/Search', params)
  }
  getDetail(equnr: string): Observable<any> {
    return this.commonService.get(`EquipChar/GetDetail/${equnr}`)
  }
  getAll(): Observable<any> {
    return this.commonService.get('EquipChar/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('EquipChar/Insert', params, false)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('EquipChar/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`EquipChar/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('EquipChar/Export', params)
  }
}
