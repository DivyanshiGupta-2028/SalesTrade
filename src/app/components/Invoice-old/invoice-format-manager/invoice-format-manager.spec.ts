import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormatManager } from './invoice-format-manager';

describe('InvoiceFormatManager', () => {
  let component: InvoiceFormatManager;
  let fixture: ComponentFixture<InvoiceFormatManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFormatManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFormatManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
