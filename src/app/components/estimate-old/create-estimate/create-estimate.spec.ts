import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEstimate } from './create-estimate';

describe('CreateEstimate', () => {
  let component: CreateEstimate;
  let fixture: ComponentFixture<CreateEstimate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEstimate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEstimate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
