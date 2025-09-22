import { TestBed } from '@angular/core/testing';

import { LicenseClientService } from './license-client-service';

describe('LicenseClientService', () => {
  let service: LicenseClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
