import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassDService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('ClassD/Search', params);
  }

  getAll(): Observable<any> {
    return this.commonService.get('ClassD/GetAll');
  }

  create(params: any): Observable<any> {
    return this.commonService.post('ClassD/Insert', params);
  }

  update(params: any): Observable<any> {
    return this.commonService.put('ClassD/Update', params);
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`ClassD/Delete/${id}`);
  }
  exportExcel(params: any): Observable<any> {
    return this.commonService.downloadFile('ClassD/Export', params)
  }
} 