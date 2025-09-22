import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, map, filter } from 'rxjs';

@Component({
  selector: 'app-exchangenavbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exchangenavbar.html',
  styleUrl: './exchangenavbar.scss'
})
export class Exchangenavbar {
  exchangeId$: Observable<number | null>;
  activeRoute$: Observable<string>;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

  
    this.exchangeId$ = this.activatedRoute.queryParams.pipe(
      map(params => params['exchangeId'] ? +params['exchangeId'] : null)
    );


    this.activeRoute$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const urlSegments = this.router.url.split('/');
        return urlSegments[2] || '';
      })
    );
  }
}
