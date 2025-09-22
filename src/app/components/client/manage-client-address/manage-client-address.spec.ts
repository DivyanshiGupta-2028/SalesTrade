import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientAddress } from './manage-client-address';

describe('ManageClientAddress', () => {
  let component: ManageClientAddress;
  let fixture: ComponentFixture<ManageClientAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClientAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClientAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
