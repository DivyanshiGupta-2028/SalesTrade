import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormatList } from './invoice-format-list';

describe('InvoiceFormatList', () => {
  let component: InvoiceFormatList;
  let fixture: ComponentFixture<InvoiceFormatList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFormatList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFormatList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
