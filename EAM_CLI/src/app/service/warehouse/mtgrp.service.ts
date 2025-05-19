import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MtgrpService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Mtgrp/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Mtgrp/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Mtgrp/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Mtgrp/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Mtgrp/Delete/${id}`)
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('Mtgrp/Export', params)
  }
}
