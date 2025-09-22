import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseDashboard } from './license-dashboard';

describe('LicenseDashboard', () => {
  let component: LicenseDashboard;
  let fixture: ComponentFixture<LicenseDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
