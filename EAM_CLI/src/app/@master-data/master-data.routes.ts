import { Routes } from '@angular/router';
import { AccountTypeComponent } from './account-type/account-type.component';
import { EqCatComponent } from './eq-cat/eq-cat.component';
import { EqGroupComponent } from './eq-group/eq-group.component';
import { PlantComponent } from './plant/plant.component';
import { WcComponent } from './wc/wc.component';

export const masterDataRoutes: Routes = [
  { path: 'account-type', component: AccountTypeComponent },
  { path: 'eq-cat', component: EqCatComponent },
  { path: 'eq-group', component: EqGroupComponent },
  { path: 'plant', component: PlantComponent },
  { path: 'wc', component: WcComponent },
];
