import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';

@Component({
  selector: 'app-incident-list',
  imports: [ShareModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent {

}
