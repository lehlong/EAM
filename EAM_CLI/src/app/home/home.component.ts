import { Component } from '@angular/core';
import { ShareModule } from '../shared/share-module';

@Component({
  selector: 'app-home',
  imports: [ShareModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone:true,
})
export class HomeComponent {

}
