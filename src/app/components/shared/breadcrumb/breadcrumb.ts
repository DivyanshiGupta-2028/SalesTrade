import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})

export class Breadcrumb {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  private updateBreadcrumbs() {
    let route = this.route.root;
    let url = '';
    let newBreadcrumb: { label: string; url: string } | null = null;

    const currentUrl = this.router.url;
  if (currentUrl === '/license-dashboard') {
    this.breadcrumbs = [];
    return;
  }
    while (route.firstChild) {
      route = route.firstChild;
const routeURL = route.snapshot.url.map(segment => segment.path).join('>>');
if (routeURL) url += `>>${routeURL}`;


      const label = route.snapshot.data['breadcrumb'];

      if (label === false) continue;

      if (label && typeof label === 'string') {
        newBreadcrumb = { label, url };
      }
    }

    if (newBreadcrumb) {
      const index = this.breadcrumbs.findIndex(bc => bc.url === newBreadcrumb!.url);

      if (index === -1) {

        this.breadcrumbs.push(newBreadcrumb);
      } else {

        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      }
    }
  }
}
