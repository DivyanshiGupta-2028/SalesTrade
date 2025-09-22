import { TestBed } from '@angular/core/testing';

import { SenderDetails } from './sender-details';

describe('SenderDetails', () => {
  let service: SenderDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SenderDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
