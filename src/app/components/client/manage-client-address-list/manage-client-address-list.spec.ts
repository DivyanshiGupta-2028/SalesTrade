import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientAddressList } from './manage-client-address-list';

describe('ManageClientAddressList', () => {
  let component: ManageClientAddressList;
  let fixture: ComponentFixture<ManageClientAddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClientAddressList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClientAddressList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
