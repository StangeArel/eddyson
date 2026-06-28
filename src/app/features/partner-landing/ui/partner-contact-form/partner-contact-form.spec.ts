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

  it('should keep the form invalid when required fields are missing', () => {
    const formComponent = component as unknown as {
      onSubmit: () => void;
      partnerForm: { invalid: boolean };
    };

    formComponent.onSubmit();
    fixture.detectChanges();

    expect(formComponent.partnerForm.invalid).toBe(true);
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('should show a status message after a valid submit', () => {
    const formComponent = component as unknown as {
      onPhoneInput: () => void;
      onSubmit: () => void;
      partnerForm: {
        setValue: (value: Record<string, string | boolean>) => void;
        value: { fullName: string; privacy: boolean };
      };
    };

    formComponent.partnerForm.setValue({
      fullName: 'Valeriya Stange',
      company: 'Example GmbH',
      email: 'valeriya@example.com',
      phoneCountry: 'fr',
      phone: '+33 6 12 34 56 78',
      partnerType: 'erp-provider',
      industry: 'retail',
      systemFocus: 'SAP, Microsoft',
      message: 'Please contact me about the partner program.',
      privacy: true,
    });
    formComponent.onPhoneInput();
    formComponent.onSubmit();
    fixture.detectChanges();

    const phoneInput = fixture.nativeElement.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Thanks');
    expect(formComponent.partnerForm.value.fullName).toBe('');
    expect(formComponent.partnerForm.value.privacy).toBe(false);
    expect(phoneInput.placeholder).toContain('+49');
  });

  it('should detect the phone country from an international prefix', () => {
    const formComponent = component as unknown as {
      onPhoneInput: () => void;
      partnerForm: {
        controls: {
          phone: { setValue: (value: string) => void };
          phoneCountry: { value: string };
        };
      };
    };

    formComponent.partnerForm.controls.phone.setValue('+33 6 12 34 56 78');
    formComponent.onPhoneInput();
    fixture.detectChanges();

    const countrySelect = fixture.nativeElement.querySelector(
      'select[name="phone-country"]',
    ) as HTMLSelectElement;
    const phoneInput = fixture.nativeElement.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    expect(formComponent.partnerForm.controls.phoneCountry.value).toBe('fr');
    expect(countrySelect.value).toBe('fr');
    expect(phoneInput.placeholder).toContain('+33');
  });
});
