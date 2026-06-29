import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type PhoneCountry = {
  readonly iso: string;
  readonly name: string;
  readonly flag: string;
  readonly dialCode: string;
  readonly placeholder: string;
};

const PHONE_COUNTRIES = [
  {
    iso: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    placeholder: '+490000000000',
  },
  {
    iso: 'fr',
    name: 'France',
    flag: '🇫🇷',
    dialCode: '+33',
    placeholder: '+33000000000',
  },
  {
    iso: 'at',
    name: 'Austria',
    flag: '🇦🇹',
    dialCode: '+43',
    placeholder: '+430000000000',
  },
  {
    iso: 'ch',
    name: 'Switzerland',
    flag: '🇨🇭',
    dialCode: '+41',
    placeholder: '+41000000000',
  },
  {
    iso: 'nl',
    name: 'Netherlands',
    flag: '🇳🇱',
    dialCode: '+31',
    placeholder: '+31000000000',
  },
  {
    iso: 'gb',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    placeholder: '+440000000000',
  },
  {
    iso: 'us',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    placeholder: '+10000000000',
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
  private readonly messageTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('messageTextarea');

  protected readonly phoneCountries = PHONE_COUNTRIES;
  protected readonly wasSubmitted = signal(false);
  protected readonly selectedPhoneCountry = signal<PhoneCountry>(PHONE_COUNTRIES[0]);

  protected readonly partnerForm = this.formBuilder.nonNullable.group({
    fullName: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneCountry: [PHONE_COUNTRIES[0].iso],
    phone: ['', Validators.required],
    partnerType: ['', Validators.required],
    industry: ['', Validators.required],
    systemFocus: [''],
    message: [''],
    privacy: [false, Validators.requiredTrue],
  });

  protected readonly submitMessage = computed(() =>
    this.wasSubmitted() ? 'Thanks, your request is ready for partner management review.' : '',
  );

  protected readonly phonePlaceholder = computed(() => this.selectedPhoneCountry().placeholder);

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
    queueMicrotask(() => this.resetMessageTextareaHeight());
  }

  protected hasError(controlName: keyof typeof this.partnerForm.controls): boolean {
    const control = this.partnerForm.controls[controlName];

    return control.invalid && (control.touched || control.dirty);
  }

  protected resizeMessageTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.style.height = '40px';
    textarea.style.height = `${Math.max(40, textarea.scrollHeight)}px`;
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

  private resetMessageTextareaHeight(): void {
    const textarea = this.messageTextarea()?.nativeElement;

    if (textarea) {
      textarea.style.height = '';
    }
  }
}
