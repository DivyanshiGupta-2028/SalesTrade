import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLicenseList } from './license-list';

describe('LicenseList', () => {
  let component: AdminLicenseList;
  let fixture: ComponentFixture<AdminLicenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLicenseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLicenseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
