import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicense } from './edit-license';

describe('EditLicenseComponent', () => {
  let component: EditLicense;
  let fixture: ComponentFixture<EditLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
