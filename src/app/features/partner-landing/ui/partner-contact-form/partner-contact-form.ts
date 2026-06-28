import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type PhoneCountry = {
  readonly iso: string;
  readonly name: string;
  readonly flag: string;
  readonly dialCode: string;
  readonly example: string;
};

const PHONE_COUNTRIES = [
  {
    iso: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    example: '+49 151 12345678',
  },
  {
    iso: 'fr',
    name: 'France',
    flag: '🇫🇷',
    dialCode: '+33',
    example: '+33 6 12 34 56 78',
  },
  {
    iso: 'at',
    name: 'Austria',
    flag: '🇦🇹',
    dialCode: '+43',
    example: '+43 664 1234567',
  },
  {
    iso: 'ch',
    name: 'Switzerland',
    flag: '🇨🇭',
    dialCode: '+41',
    example: '+41 79 123 45 67',
  },
  {
    iso: 'nl',
    name: 'Netherlands',
    flag: '🇳🇱',
    dialCode: '+31',
    example: '+31 6 12345678',
  },
  {
    iso: 'gb',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    example: '+44 7700 900123',
  },
  {
    iso: 'us',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    example: '+1 555 123 4567',
  },
] satisfies readonly PhoneCountry[];

@Component({
  selector: 'app-partner-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './partner-contact-form.html',
  styleUrl: './partner-contact-form.scss',
})
export class PartnerContactForm {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly phoneCountries = PHONE_COUNTRIES;
  protected readonly wasSubmitted = signal(false);
  protected readonly selectedPhoneCountry = signal<PhoneCountry>(PHONE_COUNTRIES[0]);

  protected readonly partnerForm = this.formBuilder.nonNullable.group({
    fullName: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneCountry: [PHONE_COUNTRIES[0].iso],
    phone: [''],
    partnerType: ['', Validators.required],
    industry: ['', Validators.required],
    systemFocus: [''],
    message: [''],
    privacy: [false, Validators.requiredTrue],
  });

  protected readonly submitMessage = computed(() =>
    this.wasSubmitted() ? 'Thanks, your request is ready for partner management review.' : '',
  );

  protected readonly phonePlaceholder = computed(() => this.selectedPhoneCountry().example);

  protected onPhoneCountryChange(): void {
    const selectedCountry = this.findPhoneCountryByIso(
      this.partnerForm.controls.phoneCountry.value,
    );

    if (selectedCountry) {
      this.selectedPhoneCountry.set(selectedCountry);
    }
  }

  protected onPhoneInput(): void {
    const detectedCountry = this.detectPhoneCountry(this.partnerForm.controls.phone.value);

    if (!detectedCountry || detectedCountry.iso === this.selectedPhoneCountry().iso) {
      return;
    }

    this.selectedPhoneCountry.set(detectedCountry);
    this.partnerForm.controls.phoneCountry.setValue(detectedCountry.iso, { emitEvent: false });
  }

  protected onSubmit(): void {
    this.wasSubmitted.set(false);

    if (this.partnerForm.invalid) {
      this.partnerForm.markAllAsTouched();
      return;
    }

    this.wasSubmitted.set(true);
    this.selectedPhoneCountry.set(PHONE_COUNTRIES[0]);
    this.partnerForm.reset({
      fullName: '',
      company: '',
      email: '',
      phoneCountry: PHONE_COUNTRIES[0].iso,
      phone: '',
      partnerType: '',
      industry: '',
      systemFocus: '',
      message: '',
      privacy: false,
    });
  }

  protected hasError(controlName: keyof typeof this.partnerForm.controls): boolean {
    const control = this.partnerForm.controls[controlName];

    return control.invalid && (control.touched || control.dirty);
  }

  private findPhoneCountryByIso(iso: string): PhoneCountry | undefined {
    return this.phoneCountries.find((country) => country.iso === iso);
  }

  private detectPhoneCountry(phoneValue: string): PhoneCountry | undefined {
    const normalizedValue = phoneValue.replace(/\s|-/g, '').replace(/^00/, '+');

    if (!normalizedValue.startsWith('+')) {
      return undefined;
    }

    return [...this.phoneCountries]
      .sort((countryA, countryB) => countryB.dialCode.length - countryA.dialCode.length)
      .find((country) => normalizedValue.startsWith(country.dialCode));
  }
}
