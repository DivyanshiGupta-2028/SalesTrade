import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { ConfirmBoxConfigModule, NgxAwesomePopupModule } from '@costlydeveloper/ngx-awesome-popup';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    AuthService,
     provideCharts(withDefaultRegisterables()) ,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
        provideToastr(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(MatDialogModule),  

  ]
};


