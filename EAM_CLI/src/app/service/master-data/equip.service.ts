import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EquipService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Equip/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Equip/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Equip/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Equip/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Equip/Delete/${id}`)
  }
}
