import { Routes } from "@angular/router";
import { WarehouseListComponent } from "./warehouse-list/warehouse-list.component";
import { MtypeComponent } from "./mtype/mtype.component";
import { MtgrpComponent } from "./mtgrp/mtgrp.component";
import { ItemComponent } from "./item/item.component";

export const warehouseRoutes: Routes = [
  { path: 'list', component: WarehouseListComponent },
  { path: 'mtype', component: MtypeComponent },
  { path: 'mtgrp', component: MtgrpComponent },
  { path: 'item', component: ItemComponent},
 
];