import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotiAttService {
  constructor(
    private commonService: CommonService,
    private http: HttpClient
  ) {}

  search(params: any): Observable<any> {
    return this.commonService.get('NotiAtt/Search', params);
  }

  getByQmnum(qmnum: string): Observable<any> {
    return this.commonService.get(`NotiAtt/GetByQmnum/${qmnum}`);
  }

  uploadFile(formData: FormData, qmnum: string): Promise<any> {
    const url = `${environment.apiUrl}/NotiAtt/Upload?qmnum=${qmnum}`;
    return firstValueFrom(
      this.http.post(url, formData)
        .pipe(
          catchError(error => {
            console.error('HTTP Error in uploadFile:', error);
            throw error;
          })
        )
    );
  }

  delete(id: string): Observable<any> {
    return this.commonService.delete(`NotiAtt/Delete/${id}`);
  }
} 