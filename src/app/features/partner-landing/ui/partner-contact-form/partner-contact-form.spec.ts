import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContactForm, type PartnerContactFormContent } from './partner-contact-form';

describe('PartnerContactForm', () => {
  let component: PartnerContactForm;
  let fixture: ComponentFixture<PartnerContactForm>;
  const formContent = {
    ariaLabel: 'Partner contact',
    fields: [
      {
        controlName: 'fullName',
        label: 'First and Last name',
        placeholder: 'Valery Jacobson jr III',
        type: 'text',
        required: true,
        requiredLabel: 'required',
        options: [],
      },
      {
        controlName: 'company',
        label: 'Company',
        placeholder: 'Your company',
        type: 'text',
        required: true,
        requiredLabel: 'required',
        options: [],
      },
      {
        controlName: 'email',
        label: 'Business email',
        placeholder: 'you@yourcompany.com',
        type: 'email',
        required: true,
        requiredLabel: 'required',
        options: [],
      },
      {
        controlName: 'phone',
        label: 'Phone',
        placeholder: '',
        type: 'tel',
        required: true,
        requiredLabel: 'required',
        options: [],
      },
      {
        controlName: 'partnerType',
        label: 'Partner type',
        placeholder: 'Select at least one',
        type: 'select',
        required: true,
        requiredLabel: 'required',
        options: [{ label: 'Implementation Partner', value: 'implementation-partner' }],
      },
      {
        controlName: 'industry',
        label: 'Industry',
        placeholder: 'Select at least one',
        type: 'select',
        required: true,
        requiredLabel: 'required',
        options: [{ label: 'Retail', value: 'retail' }],
      },
      {
        controlName: 'systemFocus',
        label: 'System focus',
        placeholder: 'e.g. SAP, Microsoft',
        type: 'text',
        required: false,
        requiredLabel: '',
        options: [],
      },
      {
        controlName: 'message',
        label: 'Questions or comments',
        placeholder: 'Anything you would like to add for optimal feedback',
        type: 'textarea',
        required: false,
        requiredLabel: '',
        options: [],
      },
    ],
    privacyText: 'By submitting this form, I agree with the privacy policy',
    privacyUrl: '/privacy-policy',
    submitLabel: 'Submit',
  } satisfies PartnerContactFormContent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerContactForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerContactForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', formContent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the form invalid when required fields are missing', async () => {
    const formComponent = component as unknown as {
      onSubmit: () => void;
      partnerForm: { invalid: boolean };
    };

    formComponent.onSubmit();
    await fixture.whenStable();
    fixture.detectChanges();

    const firstNameInput = fixture.nativeElement.querySelector(
      'input[name="fullName"]',
    ) as HTMLInputElement;
    const errorMessages = [...fixture.nativeElement.querySelectorAll('.partner-contact-form__error')]
      .map((element) => element.textContent?.trim())
      .filter(Boolean);

    expect(formComponent.partnerForm.invalid).toBe(true);
    expect(errorMessages).toContain('Please fill in first and last name.');
    expect(fixture.nativeElement.querySelector('.partner-contact-form__privacy-error')?.textContent).toContain(
      'Please accept the privacy policy to continue.',
    );
    expect(firstNameInput.getAttribute('aria-describedby')).toBe('fullName-error');
    expect(document.activeElement).toBe(firstNameInput);
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('should explain an invalid email address directly at the email field', () => {
    const formComponent = component as unknown as {
      partnerForm: {
        controls: {
          email: {
            markAsTouched: () => void;
            setValue: (value: string) => void;
          };
        };
      };
    };

    formComponent.partnerForm.controls.email.setValue('not-an-email');
    formComponent.partnerForm.controls.email.markAsTouched();
    fixture.detectChanges();

    const emailInput = fixture.nativeElement.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    const emailError = fixture.nativeElement.querySelector('#email-error');

    expect(emailError.textContent).toContain('Please enter a valid business email address.');
    expect(emailInput.getAttribute('aria-describedby')).toBe('email-error');
  });

  it('should reset the form after a valid submit', () => {
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
      partnerType: 'implementation-partner',
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

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
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

  it('should let the message field grow without a character limit', () => {
    const messageTextarea = fixture.nativeElement.querySelector(
      'textarea[name="message"]',
    ) as HTMLTextAreaElement;

    expect(messageTextarea.hasAttribute('maxlength')).toBe(false);

    Object.defineProperty(messageTextarea, 'scrollHeight', {
      configurable: true,
      value: 72,
    });

    messageTextarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(messageTextarea.style.height).toBe('72px');
  });
});
