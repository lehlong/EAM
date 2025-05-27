import { Component, ViewChild } from '@angular/core'
import { ShareModule } from '../../../shared/share-module'
import { GlobalService } from '../../../service/global.service'
import { DropdownService } from '../../../service/dropdown/dropdown.service'
import { PaginationResult } from '../../../models/base.model'
import { AccountService } from '../../../service/system-manager/account.service'
import { AccountCreateComponent } from '../account-create/account-create.component'
import { AccountFilter } from '../../../models/system-manager/account.model'
import { AccountEditComponent } from '../account-edit/account-edit.component'
import { AccountGroupEditComponent } from '../../account-group/account-group-edit/account-group-edit.component'
import { ActivatedRoute, Router } from '@angular/router'
import { ADMIN_RIGHTS } from '../../../shared/constants'
import { AccountTypeService } from '../../../service/master-data/account-type.service'

@Component({
  selector: 'app-account-index',
  standalone: true,
  imports: [
    ShareModule,
    AccountCreateComponent,
    AccountEditComponent,
    AccountGroupEditComponent,
  ],
  templateUrl: './account-index.component.html',
  styleUrl: './account-index.component.scss',
})
export class AccountIndexComponent {
  filter = new AccountFilter()
  paginationResult = new PaginationResult()
  showCreate: boolean = false
  showEdit: boolean = false
  userName: string = ''

  listAccountGroup: any[] = []
  accountType: any[] = []
  listStatus: any[] = [
    { id: 'true', name: 'Kích hoạt' },
    { id: 'false', name: 'Khoá' },
  ]

  showEditAcg: boolean = false
  idDetail: number | string = 0

  @ViewChild(AccountEditComponent) accountEditComponent!: AccountEditComponent
  @ViewChild(AccountGroupEditComponent)
  accountGroupEditComponent!: AccountGroupEditComponent
 ADMIN_RIGHTS = ADMIN_RIGHTS
  constructor(
    private dropdownService: DropdownService,
    private _as: AccountService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private _sAccountType : AccountTypeService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách tài khoản',
        path: 'system-manager/account',
      },
    ])
  }

  ngOnDestroy() {
    this.globalService.setBreadcrumb([])
  }

  ngOnInit(): void {
    this.loadInit();
    this.getAllAccountType()
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['user_name']) {
        this.openEdit(params['user_name'])
      }
      if (params['create_nmtv']) {
        this.openCreate()
      }
    })
  }

  onSortChange(key: string, value: string | null) {
    this.filter = {
      ...this.filter,
      SortColumn: key,
      IsDescending: value === 'descend',
    }
    this.search()
  }

  loadInit() {
    this.getAllAccountGroup()
    this.search()
  }

  openCreate() {
    this.showCreate = true
  }

  openEdit(userName: string) {
    this.userName = userName
    this.showEdit = true
    this.accountEditComponent?.getDetail(this.userName)
    const params = { user_name: userName }
    this.router.navigate(['/system-manager/account'], { queryParams: params })
  }

  close() {
    this.showCreate = false
    this.showEdit = false
    this.showEditAcg = false
    this.loadInit()
  }

  search() {
    this._as
      .search({
        ...this.filter,
      })
      .subscribe({
        next: (data) => {
          this.paginationResult = data
        },
        error: (response) => {
          console.log(response)
        },
      })
  }
  getAllAccountGroup() {
    this.dropdownService.getAllAccountGroup().subscribe({
      next: (data) => {
        this.listAccountGroup = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  getAllAccountType() {
    this._sAccountType.getAll().subscribe({
      next: (data) => {
        this.accountType = data
console.log(this.accountType)
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  getAccountTypeName(code : any) {
    return this.accountType.find((item) => item.code === code)?.name || ''
  }

  reset() {
    this.filter = new AccountFilter()
    this.loadInit()
  }

  pageSizeChange(size: number): void {
    this.filter.currentPage = 1
    this.filter.pageSize = size
    this.loadInit()
  }

  pageIndexChange(index: number): void {
    this.filter.currentPage = index
    this.loadInit()
  }

  handleAccountGroup(id: number | string) {
    this.idDetail = id
    this.showEditAcg = true
    this.accountGroupEditComponent.loadDetail(this.idDetail)
  }
}
