import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLicenseSummary } from './license-summary';

describe('LicenseSummary', () => {
  let component: UserLicenseSummary;
  let fixture: ComponentFixture<UserLicenseSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLicenseSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLicenseSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
