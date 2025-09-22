import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSummary } from './invoice-summary';

describe('InvoiceSummary', () => {
  let component: InvoiceSummary;
  let fixture: ComponentFixture<InvoiceSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
