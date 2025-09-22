import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClients } from './manage-clients';

describe('ManageClients', () => {
  let component: ManageClients;
  let fixture: ComponentFixture<ManageClients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageClients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
