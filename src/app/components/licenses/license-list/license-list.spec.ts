import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseList } from './license-list';

describe('LicenseList', () => {
  let component: LicenseList;
  let fixture: ComponentFixture<LicenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
