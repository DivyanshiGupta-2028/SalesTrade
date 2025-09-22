import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseClientFlow } from './license-client-flow';

describe('LicenseClientFlow', () => {
  let component: LicenseClientFlow;
  let fixture: ComponentFixture<LicenseClientFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseClientFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseClientFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
