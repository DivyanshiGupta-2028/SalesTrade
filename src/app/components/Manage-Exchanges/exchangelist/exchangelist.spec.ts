import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeList } from './exchangelist';


describe('ExchangelistComponent', () => {
  let component: ExchangeList;
  let fixture: ComponentFixture<ExchangeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
