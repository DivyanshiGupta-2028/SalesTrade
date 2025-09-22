import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEstimate } from './add-estimate';

describe('AddEstimate', () => {
  let component: AddEstimate;
  let fixture: ComponentFixture<AddEstimate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEstimate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEstimate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
