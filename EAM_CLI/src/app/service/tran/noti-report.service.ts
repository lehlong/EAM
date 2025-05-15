import { Injectable } from '@angular/core'
import { CommonService } from '../common.service'
import { Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NotiReportService {
  constructor(private commonService: CommonService) { }
saveReport(params: any): Observable<any> {
  return this.commonService.post('NotiReport/SaveReport', params)
}

getReportByQmnumAndType(qmnum: string, rpType: string): Observable<any> {
  return this.commonService.get(`NotiReport/GetReportByQmnumAndType?qmnum=${qmnum}&rpType=${rpType}`)
}

getReportsByQmnum(qmnum: string): Observable<any> {
  return this.commonService.get(`NotiReport/GetReportsByQmnum/${qmnum}`)
}
  delete(id: string): Observable<any> {
    return this.commonService.delete(`NotiReport/Delete/${id}`)
  }

}
