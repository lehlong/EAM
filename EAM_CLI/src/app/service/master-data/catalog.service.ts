import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Catalog/Search', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Catalog/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Catalog/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Catalog/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Catalog/Delete/${id}`)
  }
} 