import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EquipPicService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('EquipPic/Search', params)
  }

  getByEqunr(equnr: string): Observable<any> {
    return this.commonService.get(`EquipPic/GetByEqunr/${equnr}`)
  }

  upload(file: File, equnr: string): Observable<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('equnr', equnr)
    return this.commonService.post('EquipPic/Upload', formData)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`EquipPic/Delete/${id}`)
  }
} 