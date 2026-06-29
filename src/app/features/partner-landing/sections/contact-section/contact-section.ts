import { Component, computed, input } from '@angular/core';

import {
  imageFromField,
  linkToUrl,
  richTextToText,
  textOrEmpty,
  type PrismicImageView,
} from '../../../../core/prismic/prismic-field.utils';
import type { ContactSectionSlice } from '../../../../core/prismic/prismic.types';
import {
  PartnerContactForm,
  type PartnerContactControlName,
  type PartnerContactField,
  type PartnerContactFieldType,
  type PartnerContactFormContent,
  type PartnerContactSelectOption,
} from '../../ui/partner-contact-form/partner-contact-form';

type ContactContent = {
  readonly title: string;
  readonly text: string;
  readonly backgroundImage: PrismicImageView | null;
  readonly form: PartnerContactFormContent;
};

type ContactItem = ContactSectionSlice['items'][number];

const CONTACT_FIELD_CONTROLS: readonly PartnerContactControlName[] = [
  'fullName',
  'company',
  'email',
  'phone',
  'partnerType',
  'industry',
  'systemFocus',
  'message',
];

const FALLBACK_FIELD_TYPES: Record<PartnerContactControlName, PartnerContactFieldType> = {
  fullName: 'text',
  company: 'text',
  email: 'email',
  phone: 'tel',
  partnerType: 'select',
  industry: 'select',
  systemFocus: 'text',
  message: 'textarea',
};

const OPTION_MARKER = 'option';

@Component({
  selector: 'app-contact-section',
  imports: [PartnerContactForm],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {
  readonly slice = input<ContactSectionSlice | null>(null);

  protected readonly content = computed<ContactContent | null>(() => {
    const slice = this.slice();

    if (!slice) {
      return null;
    }

    const title = richTextToText(slice.primary.title);

    return {
      title,
      text: richTextToText(slice.primary.text),
      backgroundImage: imageFromField(slice.primary.background_image),
      form: {
        ariaLabel: title,
        fields: this.createFormFields(slice.items),
        privacyText: textOrEmpty(slice.primary.privacy_text),
        privacyUrl: linkToUrl(slice.primary.privacy_link),
        submitLabel: textOrEmpty(slice.primary.submit_label),
      },
    };
  });

  private createFormFields(items: readonly ContactItem[]): readonly PartnerContactField[] {
    let controlIndex = 0;

    return items.reduce<PartnerContactField[]>((fields, item, itemIndex) => {
      if (this.isOptionItem(item)) {
        return fields;
      }

      const controlName = CONTACT_FIELD_CONTROLS[controlIndex];
      controlIndex += 1;

      if (!controlName) {
        return fields;
      }

      fields.push({
        controlName,
        label: textOrEmpty(item.label),
        placeholder: textOrEmpty(item.placeholder),
        type: this.getFieldType(item, controlName),
        required: this.isRequiredItem(item),
        requiredLabel: textOrEmpty(item.required_label),
        options: this.createFieldOptions(items, itemIndex),
      });

      return fields;
    }, []);
  }

  private createFieldOptions(
    items: readonly ContactItem[],
    fieldIndex: number,
  ): readonly PartnerContactSelectOption[] {
    const options: PartnerContactSelectOption[] = [];

    for (let index = fieldIndex + 1; index < items.length; index += 1) {
      const optionItem = items[index];

      if (!this.isOptionItem(optionItem)) {
        break;
      }

      const label = textOrEmpty(optionItem.label);

      if (label) {
        options.push({
          label,
          value: this.createOptionValue(label),
        });
      }
    }

    return options;
  }

  private getFieldType(
    item: ContactItem,
    controlName: PartnerContactControlName,
  ): PartnerContactFieldType {
    return item.field_type ?? FALLBACK_FIELD_TYPES[controlName];
  }

  private isRequiredItem(item: ContactItem): boolean {
    const marker = textOrEmpty(item.required_label).toLowerCase();

    return Boolean(marker) && marker !== OPTION_MARKER;
  }

  private isOptionItem(item: ContactItem): boolean {
    return textOrEmpty(item.required_label).toLowerCase() === OPTION_MARKER;
  }

  private createOptionValue(label: string): string {
    return label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
