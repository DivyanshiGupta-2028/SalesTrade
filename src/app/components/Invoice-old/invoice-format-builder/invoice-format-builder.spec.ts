import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormatBuilder } from './invoice-format-builder';

describe('InvoiceFormatBuilder', () => {
  let component: InvoiceFormatBuilder;
  let fixture: ComponentFixture<InvoiceFormatBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFormatBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFormatBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
