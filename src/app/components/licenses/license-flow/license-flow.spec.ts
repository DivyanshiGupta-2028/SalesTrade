import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseFlow } from './license-flow';

describe('LicenseFlow', () => {
  let component: LicenseFlow;
  let fixture: ComponentFixture<LicenseFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
