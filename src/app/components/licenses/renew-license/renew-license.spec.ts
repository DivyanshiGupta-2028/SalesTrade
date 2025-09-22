import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewLicense } from './renew-license';

describe('RenewLicense', () => {
  let component: RenewLicense;
  let fixture: ComponentFixture<RenewLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
