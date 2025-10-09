import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { importProvidersFrom, inject } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { RoleService } from './app/services/Roles/role-service';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { APP_INITIALIZER } from '@angular/core';
import { environment } from './app/environments/environment.development';
import { authInterceptor } from './app/services/auth.interceptor';
import { AuthService } from './app/services/auth.service';


export function initApp(roleService: RoleService, http: HttpClient) {
  return () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      roleService.setRoles([]);
      return Promise.resolve();
    }

    return http.get<string[]>(`${environment.apiUrl}/Roles/GetRolesByUserId/${userId}`)
      .toPromise()
      .then(roles => {
        roleService.setRoles(roles || []);
        return;
      })
      .catch(() => {
        roleService.setRoles([]);
        return;
      });
  };
}




bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    AuthService,
  

    provideClientHydration(),
         provideAnimations(),
        provideToastr(),

    ...(appConfig.providers || []),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
    RoleService,
    provideRouter(routes),
    



    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [RoleService, HttpClient],
      multi: true
    }

  ]
}).catch(err => console.error(err));
