import { TestBed } from '@angular/core/testing';
import { AdminLicenseService } from './admin-license-service.service';

describe('LicenseService', () => {
  let service: AdminLicenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLicenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
