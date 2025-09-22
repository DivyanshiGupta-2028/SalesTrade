import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exchangenavbar } from './exchangenavbar';

describe('ExchangenavbarComponent', () => {
  let component: Exchangenavbar;
  let fixture: ComponentFixture<Exchangenavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exchangenavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exchangenavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
