import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Plant/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Plant/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Plant/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Plant/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Plant/Delete/${id}`)
  }
    exportExcel(params: any): Observable<any> {
      return this.commonService.downloadFile('Plant/Export', params)
    }
}
