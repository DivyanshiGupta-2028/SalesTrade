import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeClientDetailTabs } from './exchange-client-detail-tabs';

describe('ExchangeClientDetailTabs', () => {
  let component: ExchangeClientDetailTabs;
  let fixture: ComponentFixture<ExchangeClientDetailTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeClientDetailTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeClientDetailTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
