import { TestBed } from '@angular/core/testing';

import { InvoiceFormatService } from './invoice-format-service';

describe('InvoiceFormatService', () => {
  let service: InvoiceFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
