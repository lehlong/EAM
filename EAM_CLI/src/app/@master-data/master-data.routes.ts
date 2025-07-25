import { TasklistComponent } from './task-list/task-list.component';
import { Routes } from '@angular/router';
import { AccountTypeComponent } from './account-type/account-type.component';
import { EqCatComponent } from './eq-cat/eq-cat.component';
import { EqGroupComponent } from './eq-group/eq-group.component';
import { PlantComponent } from './plant/plant.component';
import { WcComponent } from './wc/wc.component';
import { NotiTypeComponent } from './noti-type/noti-type.component';
import { OrderTypeComponent } from './order-type/order-type.component';
import { FlocComponent } from './floc/floc.component';
import { EquipComponent } from './equip/equip.component';
import { CharComponent } from './char/char.component';
import { ClassDComponent } from './class-d/class-d.component';
import { ClassHComponent } from './class-h/class-h.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CataTypeComponent } from './cata-type/cata-type.component';
import { UsageStatusComponent } from './usage-status/usage-status.component';
import { ActiveStatusComponent } from './active-status/active-status.component';
import { PlgrpComponent } from './plgrp/plgrp.component';
import { UnitComponent } from './unit/unit.component';
import { EquipHistoryComponent } from './equip-history/equip-history.component';

export const masterDataRoutes: Routes = [
  { path: 'account-type', component: AccountTypeComponent },
  { path: 'eq-cat', component: EqCatComponent },
  { path: 'eq-group', component: EqGroupComponent },
  { path: 'plant', component: PlantComponent },
  { path: 'wc', component: WcComponent },
  { path: 'noti-type', component: NotiTypeComponent },
  { path: 'order-type', component: OrderTypeComponent },
  { path: 'floc', component: FlocComponent },
  { path: 'equip/:equnr', component: EquipComponent },
  { path: 'task-list', component: TasklistComponent },
  { path: 'char', component: CharComponent },
  { path: 'class-h', component: ClassHComponent },
  { path: 'class-d', component: ClassDComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'cata-type', component: CataTypeComponent },
  { path: 'usage-status', component: UsageStatusComponent },
  { path: 'active-status', component: ActiveStatusComponent },
  { path: 'plgrp', component: PlgrpComponent },
  { path: 'unit', component: UnitComponent },
  { path: 'equip-history/:equnr', component: EquipHistoryComponent },

];
