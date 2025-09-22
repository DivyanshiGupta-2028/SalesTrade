import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClientList } from './manage-client-list';

describe('ManageClientList', () => {
  let component: ManageClientList;
  let fixture: ComponentFixture<ManageClientList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClientList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClientList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
