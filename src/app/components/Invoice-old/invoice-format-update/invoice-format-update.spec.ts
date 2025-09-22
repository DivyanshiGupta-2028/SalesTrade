import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormatUpdate } from './invoice-format-update';

describe('InvoiceFormatUpdate', () => {
  let component: InvoiceFormatUpdate;
  let fixture: ComponentFixture<InvoiceFormatUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFormatUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFormatUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
