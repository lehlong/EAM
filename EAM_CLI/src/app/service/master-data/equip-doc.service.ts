import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EquipDocService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('EquipDoc/Search', params)
  }

  getByEqunr(equnr: string): Observable<any> {
    return this.commonService.get(`EquipDoc/GetByEqunr/${equnr}`)
  }

  upload(file: File, equnr: string, docType?: string): Observable<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('equnr', equnr)
    if (docType) {
      formData.append('docType', docType)
    }
    return this.commonService.post('EquipDoc/Upload', formData)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`EquipDoc/Delete/${id}`)
  }
} 