import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeClientEdit } from './exchange-client-edit';

describe('ExchangeClientEdit', () => {
  let component: ExchangeClientEdit;
  let fixture: ComponentFixture<ExchangeClientEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeClientEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeClientEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
