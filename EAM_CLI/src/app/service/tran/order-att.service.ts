import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class OrderAttService {
    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) { }

    search(params: any): Observable<any> {
        return this.commonService.get('OrderAtt/Search', params);
    }

    GetByAufnr(aufnr: string): Observable<any> {
        return this.commonService.get(`OrderAtt/GetByAufnr/${aufnr}`);
    }

    uploadFile(formData: FormData, aufnr: string): Promise<any> {
        const url = `${environment.apiUrl}/OrderAtt/Upload?aufnr=${aufnr}`;
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
        return this.commonService.delete(`OrderAtt/Delete/${id}`);
    }
} 