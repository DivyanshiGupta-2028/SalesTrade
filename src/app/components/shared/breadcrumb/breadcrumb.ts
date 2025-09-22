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
// export class Breadcrumb {



//   breadcrumbs: { label: string, url: string }[] = [];

//   constructor(private route: ActivatedRoute, private router: Router) {
//     this.router.events
//       .pipe(filter(e => e instanceof NavigationEnd))
//       .subscribe(() => {
//         this.breadcrumbs = this.buildBreadcrumb(this.route.root);
//       });
//   }

//   // private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: { label: string, url: string }[] = []): any {
//   //   const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
//   //   let children: ActivatedRoute[] = route.children;

//   //   if (children.length === 0) {
//   //     return breadcrumbs;
//   //   }

//   //   for (let child of children) {
//   //     if (child.outlet !== 'primary') {
//   //       continue;
//   //     }

//   //     let routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
//   //     if (routeURL) {
//   //       url += `/${routeURL}`;
//   //     }

//   //     let label = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
//   //     if (!label) {
//   //       label = routeURL || 'Dashboard';
//   //     }

//   //     breadcrumbs.push({ label, url });

//   //     return this.buildBreadcrumb(child, url, breadcrumbs);
//   //   }

//   //   return breadcrumbs;
//   // }

//   private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: { label: string, url: string }[] = []): any {
//   const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
//   let children: ActivatedRoute[] = route.children;
//   if (children.length === 0) {
//     return breadcrumbs;
//   }
//   for (let child of children) {
//     if (child.outlet !== 'primary') {
//       continue;
//     }
//     let routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
//     if (routeURL) {
//       url += `/${routeURL}`;
//     }
//     let label = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
//     // Remove fallback 'Dashboard' so no default forced label
//     if (!label) {
//       label = routeURL; // or label = ''; to skip blank breadcrumb
//     }
//     if (label) { // Only push if label exists
//       breadcrumbs.push({ label, url });
//     }
//     return this.buildBreadcrumb(child, url, breadcrumbs);
//   }
//   return breadcrumbs;
// }

// }



// export class Breadcrumb {
//   breadcrumbs: { label: string, url: string }[] = [];

//   constructor(private route: ActivatedRoute, private router: Router) {
//     this.router.events
//       .pipe(filter(e => e instanceof NavigationEnd))
//       .subscribe(() => {
//         const bc = this.createBreadcrumb(this.route.root);
//         // Only add if different from current last bc item to avoid duplicate
//         if (bc.length) {
//           const last = this.breadcrumbs[this.breadcrumbs.length - 1];
//           if (!last || last.url !== bc[bc.length - 1].url) {
//             this.breadcrumbs = [...this.breadcrumbs, ...bc];
//           }
//         }
//       });
//   }

//   private createBreadcrumb(route: ActivatedRoute, url: string = ''): { label: string, url: string }[] {
//     const breadcrumbs: { label: string, url: string }[] = [];
//     let currentRoute = route;
//     while (currentRoute) {
//       const childRoutes = currentRoute.children.filter(r => r.outlet === 'primary');
//       if (!childRoutes.length) break;
//       currentRoute = childRoutes[0];
//       const routeURL = currentRoute.snapshot.url.map(segment => segment.path).join('/');
//       url += `/${routeURL}`;
//       const label = currentRoute.snapshot.data['breadcrumb'] || routeURL || '';
//       if (label) {
//         breadcrumbs.push({ label, url });
//       }
//     }
//     return breadcrumbs;
//   }

//   // Optional method to reset breadcrumbs if needed
//   resetBreadcrumbs() {
//     this.breadcrumbs = [];
//   }
// }




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
    // Find the primary activated route with breadcrumb data
    while (route.firstChild) {
      route = route.firstChild;
const routeURL = route.snapshot.url.map(segment => segment.path).join('>>');
if (routeURL) url += `>>${routeURL}`;


      const label = route.snapshot.data['breadcrumb'];

      // Skip if breadcrumb is explicitly false
      if (label === false) continue;

      if (label && typeof label === 'string') {
        newBreadcrumb = { label, url };
      }
    }

    if (newBreadcrumb) {
      const index = this.breadcrumbs.findIndex(bc => bc.url === newBreadcrumb!.url);

      if (index === -1) {
        // Not present, add to breadcrumb trail
        this.breadcrumbs.push(newBreadcrumb);
      } else {
        // Already present, trim trailing crumbs after this
        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      }
    }
  }
}
