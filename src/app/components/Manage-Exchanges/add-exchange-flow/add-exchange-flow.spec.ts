import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExchangeFlow } from './add-exchange-flow';

describe('AddExchangeFlow', () => {
  let component: AddExchangeFlow;
  let fixture: ComponentFixture<AddExchangeFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExchangeFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExchangeFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
