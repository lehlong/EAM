import { Routes } from '@angular/router';
import { IncidentApprovalComponent } from './incident-approval/incident-approval.component';
import { IncidentCloseComponent } from './incident-close/incident-close.component';
import { IncidentCorrectComponent } from './incident-correct/incident-correct.component';
import { IncidentCreateComponent } from './incident-create/incident-create.component';
import { IncidentListComponent } from './incident-list/incident-list.component';

export const incidentRoutes: Routes = [
  { path: 'approval', component: IncidentApprovalComponent },
  { path: 'close', component: IncidentCloseComponent },
  { path: 'correct/:aufnr', component: IncidentCorrectComponent },
  { path: 'create', component: IncidentCreateComponent },
  { path: 'list', component: IncidentListComponent },
];
