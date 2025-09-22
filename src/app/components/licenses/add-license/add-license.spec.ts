import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLicense } from './add-license';


describe('AddExchangeComponent', () => {
  let component: AddLicense;
  let fixture: ComponentFixture<AddLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
