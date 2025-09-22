import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSettings } from './option-settings';

describe('OptionSettingsComponent', () => {
  let component: OptionSettings;
  let fixture: ComponentFixture<OptionSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
