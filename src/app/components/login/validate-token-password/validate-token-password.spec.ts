import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTokenPassword } from './validate-token-password';

describe('ValidateTokenPassword', () => {
  let component: ValidateTokenPassword;
  let fixture: ComponentFixture<ValidateTokenPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateTokenPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateTokenPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
