import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PlgrpService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Plgrp/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Plgrp/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Plgrp/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Plgrp/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Plgrp/Delete/${id}`)
  }
} 