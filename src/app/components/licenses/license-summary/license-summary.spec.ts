import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseSummary } from './license-summary';

describe('LicenseSummary', () => {
  let component: LicenseSummary;
  let fixture: ComponentFixture<LicenseSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
