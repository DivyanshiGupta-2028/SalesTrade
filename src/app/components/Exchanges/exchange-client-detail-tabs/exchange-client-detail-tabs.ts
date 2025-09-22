import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-exchange-client-detail-tabs',
  templateUrl: './exchange-client-detail-tabs.html',
  styleUrls: ['./exchange-client-detail-tabs.scss'],
  standalone: true,
  imports: [CommonModule, MatTabsModule,  RouterModule],
})
export class ExchangeClientDetailTabs {
  selectedTabIndex = 0;

  constructor(private router: Router, private route: ActivatedRoute) {
    // Update tab index based on route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('/summary')) this.selectedTabIndex = 0;
        else if (url.includes('/contacts')) this.selectedTabIndex = 1;
        else if (url.includes('/addresses')) this.selectedTabIndex = 2;
      }
    });
  }

  onTabChange(index: number) {
    const exchangeClientId = this.route.snapshot.paramMap.get('id');

    switch (index) {
      case 0:
        this.router.navigate([`/client/${exchangeClientId}/summary`]);
        break;
      case 1:
        this.router.navigate([`/client/${exchangeClientId}/contacts`]);
        break;
      case 2:
        this.router.navigate([`/client/${exchangeClientId}/addresses`]);
        break;
    }
  }
}
