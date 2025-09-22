import { Injectable } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  isBrowser(): boolean {   
    return isPlatformBrowser(this.platformId);
  }
  isServer(): boolean {   
    return isPlatformServer(this.platformId);
  }
}
