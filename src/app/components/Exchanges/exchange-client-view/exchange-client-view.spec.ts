import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeClientView } from './exchange-client-view';

describe('ExchangeClientView', () => {
  let component: ExchangeClientView;
  let fixture: ComponentFixture<ExchangeClientView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeClientView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeClientView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
