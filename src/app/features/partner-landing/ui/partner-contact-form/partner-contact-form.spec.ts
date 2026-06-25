import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContactForm } from './partner-contact-form';

describe('PartnerContactForm', () => {
  let component: PartnerContactForm;
  let fixture: ComponentFixture<PartnerContactForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerContactForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerContactForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
