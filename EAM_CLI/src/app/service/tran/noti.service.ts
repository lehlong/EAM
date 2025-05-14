import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NotiService {
  constructor(private commonService: CommonService) { }

  search(params: any): Observable<any> {
    return this.commonService.get('Noti/Search', params)
  }

  searchApproval(params: any): Observable<any> {
    return this.commonService.get('Noti/SearchApproval', params)
  }

  searchClose(params: any): Observable<any> {
    return this.commonService.get('Noti/SearchClose', params)
  }

  getAll(): Observable<any> {
    return this.commonService.get('Noti/GetAll')
  }

  create(params: any): Observable<any> {
    return this.commonService.post('Noti/Insert', params)
  }

  update(params: any): Observable<any> {
    return this.commonService.put('Noti/Update', params)
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`Noti/Delete/${id}`)
  }
    exportExcel(params: any): Observable<any> {
      return this.commonService.downloadFile('Noti/Export', params)
    }

  getLastQmnum(qmart?: string): Observable<any> {
    const url = qmart ? `Noti/GetLastQmnum?qmart=${qmart}` : 'Noti/GetLastQmnum';
    return this.commonService.get(url)
      .pipe(
        map(response => {
          console.log('Raw API response:', response);
          return response;
        })
      );
  }
}
