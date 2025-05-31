import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private loading: BehaviorSubject<boolean>;
  private apiCallCount: number = 0;
  private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  rightSubject: Subject<string> = new Subject<string>();
  rightData: any = [];
  breadcrumbSubject: Subject<boolean> = new Subject<boolean>();
  breadcrumb: any = [];

  constructor(private message: NzMessageService) {
    this.loading = new BehaviorSubject<boolean>(false);
    this.rightSubject.subscribe((value) => {
      localStorage.setItem('userRights', value);
      this.rightData = value;
    });
    this.breadcrumbSubject.subscribe((value) => {
      this.breadcrumb = value;
    });
  }
  setUserName(userName: string): void {
    this.userNameSubject.next(userName);
    localStorage.setItem('userName', userName);
  }

  getUserName() {
    var usString: any = localStorage.getItem('userName');
    return usString;
  }

  loadUserNameFromStorage(): void {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      this.userNameSubject.next(storedUserName);
    }
  }

  setBreadcrumb(value: any) {
    localStorage.setItem('breadcrumb', JSON.stringify(value));
    this.breadcrumbSubject.next(value);
  }

  getBreadcrumb() {
    try {
      if (this.breadcrumb && this.breadcrumb?.length > 0) {
        return this.breadcrumb;
      }
      const breadcrumb = localStorage.getItem('breadcrumb');
      return breadcrumb ? JSON.parse(breadcrumb) : null;
    } catch (e) {
      return null;
    }
  }

  getUserInfo() {
    try {
      const info = localStorage.getItem('UserInfo');
      return info ? JSON.parse(info) : null;
    } catch (e) {
      return null;
    }
  }

  setUserInfo(value: any) {
    localStorage.setItem('UserInfo', JSON.stringify(value));
  }

  setRightData(data: any) {
    this.rightSubject.next(data);
    localStorage.setItem('userRights', data);
  }

  getRightData() {
    try {
      if (this.rightData?.length > 0) {
        return this.rightData;
      }
      const rights = localStorage.getItem('userRights');
      return rights ? JSON.parse(rights) : null;
    } catch (e) {
      return null;
    }
  }

  checkPermissions(permissions: string) {
    try {
      const listPermissions = this.getRightData();
      if (listPermissions) {
        return listPermissions?.includes(permissions);
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  getLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  setLoading(newValue: boolean): void {
    setTimeout(() => {
      this.loading.next(newValue);
    });
  }

  incrementApiCallCount(): void {
    this.apiCallCount++;
    this.setLoading(true);
  }

  decrementApiCallCount(): void {
    this.apiCallCount--;
    if (this.apiCallCount === 0) {
      this.setLoading(false);
    }
  }

  incrementApiCallCountNoLoading(): void {
    this.apiCallCount++;
  }

  decrementApiCallCountNoLoading(): void {
    this.apiCallCount--;
  }

  isValidSelected() {}

  getNameFloc(
    data: { tplnr: string; descript: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.tplnr === code)?.descript;
  }

  getNameEquip(
    data: { equnr: string; eqktx: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.equnr === code)?.eqktx;
  }

   getNameUnit(
    data: { code: string; name: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.code === code)?.name;
  }

  getNameWc(
    data: { arbpl: string; arbplTxt: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.arbpl === code)?.arbplTxt;
  }

  getNamePoint(
    data: { point: string; pttxt: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.point === code)?.pttxt;
  }

  getNameEqGroup(
    data: { eqart: string; eqartTxt: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.eqart === code)?.eqartTxt;
  }

  getNameEqCat(
    data: { eqtyp: string; eqtypTxt: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.eqtyp === code)?.eqtypTxt;
  }

  getNamePlgrp(
    data: { ingrp: string; ingrpTxt: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.ingrp === code)?.ingrpTxt;
  }

  getNameOrderType(
    data: { code: string; name: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.code === code)?.name;
  }

  getFullNameUser(
    data: { userName: string; fullName: string }[] = [],
    username: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !username) return undefined;
    return data.find((user) => user.userName === username)?.fullName;
  }

  getPriorityText(priok: string): string {
    switch (priok) {
      case '1':
        return 'Rất Cao';
      case '2':
        return 'Cao';
      case '3':
        return 'Trung Bình';
      case '4':
        return 'Thấp';
      case '5':
        return 'Rất Thấp';
      default:
        return priok || '';
    }
  }

  getNameClassH(
    data: { class: string; classTxt: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.class === code)?.classTxt;
  }

  getNameClassD(
    data: { id: string; aname: string }[] = [],
    code: string | null | undefined
  ): string | undefined {
    if (!Array.isArray(data) || !code) return undefined;
    return data.find((item) => item.id === code)?.aname;
  }

  getMimeType(fileType: string): string {
    const lowerType = fileType.toLowerCase();
    if (['jpg', 'jpeg'].includes(lowerType)) return 'image/jpeg';
    if (lowerType === 'png') return 'image/png';
    if (lowerType === 'gif') return 'image/gif';
    if (lowerType === 'bmp') return 'image/bmp';
    if (lowerType === 'txt') return 'text/plain';
    if (lowerType === 'pdf') return 'application/pdf';
    if (['doc', 'docx'].includes(lowerType)) return 'application/msword';
    if (['xls', 'xlsx'].includes(lowerType)) return 'application/vnd.ms-excel';
    return 'application/octet-stream';
  }

  isImageType(fileType: string): boolean {
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(
      fileType.toLowerCase()
    );
  }

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  formatTime(time: any): string {
    if (typeof time.format === 'function') {
      return time.format('HH:mm:ss');
    }
    if (time instanceof Date) {
      return time.toTimeString().slice(0, 8);
    }
    return time;
  }

  formatDate(date: any): string {
    if (typeof date.format === 'function') {
      return date.format('YYYY-MM-DDTHH:mm:ss');
    }
    if (date instanceof Date) {
      return date.toISOString();
    }
    return date;
  }

  parseTimeStringToDate(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, s || 0, 0);
    return d;
  }

  generateDateList(
    unit: 'D' | 'W' | 'M',
    frequency: number,
    durationInYears: number,
    startDate: string
  ): string[] {
    const result: string[] = [];
    const [day, month, year] = startDate.split('/').map(Number);
    const start = new Date(year, month - 1, day);

    const totalIterations = (() => {
      switch (unit) {
        case 'D':
          return Math.ceil((365 * durationInYears) / frequency);
        case 'W':
          return Math.ceil((52 * durationInYears) / frequency);
        case 'M':
          return Math.ceil((12 * durationInYears) / frequency);
        default:
          return 0;
      }
    })();

    for (let i = 0; i < totalIterations; i++) {
      const date = new Date(start.getTime());
      switch (unit) {
        case 'D':
          date.setDate(start.getDate() + i * frequency);
          break;
        case 'W':
          date.setDate(start.getDate() + i * frequency * 7);
          break;
        case 'M':
          date.setMonth(start.getMonth() + i * frequency);
          break;
      }
      result.push(this.formatDatePlan(date));
    }

    return result;
  }

  formatDatePlan(date: Date): string {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDatePlanFilter(date: Date): string {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  convertToIsoDateString(dateStr: string): string {
    const [dd, mm, yyyy] = dateStr.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  validateRequired(field: any, message: string): boolean {
    if (
      field === undefined ||
      field === null ||
      (typeof field === 'string' && field.trim() === '')
    ) {
      this.message.error(message);
      return false;
    }
    return true;
  }
}
