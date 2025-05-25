import { Routes } from '@angular/router';
import { PlanManagerComponent } from './plan-manager/plan-manager.component';
import { PlanOrderComponent } from './plan-order/plan-order.component';
import { LevelMaintenanceComponent } from './level-maintenance/level-maintenance.component';
import { SingleMaintenanceComponent } from './single-maintenance/single-maintenance.component';
import { ListOrderComponent } from './list-order/list-order.component';

export const planRoutes: Routes = [
  { path: 'manager', component: PlanManagerComponent },
  { path: 'order', component: PlanOrderComponent },
  { path: 'single-maintenance', component: SingleMaintenanceComponent },
  { path: 'level-maintenance', component: LevelMaintenanceComponent },
   { path: 'list-order', component: ListOrderComponent },
];
