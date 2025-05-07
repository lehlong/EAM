import { Component } from '@angular/core';
import { ShareModule } from '../shared/share-module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ShareModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  constructor(private router: Router) {}
  changeRoute(router: string) {
    this.router.navigate([`${router}`]);
  }
}
