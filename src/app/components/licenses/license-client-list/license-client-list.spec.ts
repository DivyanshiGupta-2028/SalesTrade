import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseClientList } from './license-client-list';

describe('ExchangeClientList', () => {
  let component: LicenseClientList;
  let fixture: ComponentFixture<LicenseClientList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseClientList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseClientList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
