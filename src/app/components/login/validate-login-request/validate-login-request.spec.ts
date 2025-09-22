import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateLoginRequest } from './validate-login-request';

describe('ValidateLoginRequest', () => {
  let component: ValidateLoginRequest;
  let fixture: ComponentFixture<ValidateLoginRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateLoginRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateLoginRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
