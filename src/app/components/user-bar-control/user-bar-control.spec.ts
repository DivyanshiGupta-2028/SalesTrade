import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBarControl } from './user-bar-control';

describe('UserBarControl', () => {
  let component: UserBarControl;
  let fixture: ComponentFixture<UserBarControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBarControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBarControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
