import { Routes } from "@angular/router";
import { EquipCounterComponent } from "./equip-counter/equip-counter.component";
import { TranEqCounterComponent } from "./tran-eq-counter/tran-eq-counter.component";
import { CounterListComponent } from "./counter-list/counter-list.component";

export const counterRoutes: Routes = [

  { path: 'equip-counter', component: EquipCounterComponent },
  { path: 'tran-eq-counter', component: TranEqCounterComponent },
  { path: 'counter-list', component: CounterListComponent },

];
