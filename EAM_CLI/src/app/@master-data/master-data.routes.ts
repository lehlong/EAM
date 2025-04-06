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

export const masterDataRoutes: Routes = [
  { path: 'account-type', component: AccountTypeComponent },
  { path: 'eq-cat', component: EqCatComponent },
  { path: 'eq-group', component: EqGroupComponent },
  { path: 'plant', component: PlantComponent },
  { path: 'wc', component: WcComponent },
  { path: 'noti-type', component: NotiTypeComponent },
  { path: 'order-type', component: OrderTypeComponent },
  { path: 'floc', component: FlocComponent },
  { path: 'equip', component: EquipComponent },
];
