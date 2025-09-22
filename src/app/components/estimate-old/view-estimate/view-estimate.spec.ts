import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEstimate } from './view-estimate';

describe('ViewEstimate', () => {
  let component: ViewEstimate;
  let fixture: ComponentFixture<ViewEstimate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEstimate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEstimate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
