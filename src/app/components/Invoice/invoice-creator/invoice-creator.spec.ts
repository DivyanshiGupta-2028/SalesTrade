import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreator } from './invoice-creator';

describe('InvoiceCreator', () => {
  let component: InvoiceCreator;
  let fixture: ComponentFixture<InvoiceCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
