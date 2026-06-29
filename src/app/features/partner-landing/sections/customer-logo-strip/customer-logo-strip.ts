import { Component, computed, input } from '@angular/core';

import { imageFromField, textOrEmpty } from '../../../../core/prismic/prismic-field.utils';
import type { CustomerLogoStripSlice } from '../../../../core/prismic/prismic.types';

type LogoStripContent = {
  readonly ariaLabel: string;
  readonly logos: readonly LogoItem[];
};

type LogoItem = {
  readonly name: string;
  readonly src: string;
  readonly alt: string;
};

@Component({
  selector: 'app-customer-logo-strip',
  imports: [],
  templateUrl: './customer-logo-strip.html',
  styleUrl: './customer-logo-strip.scss',
})
export class CustomerLogoStrip {
  readonly slice = input<CustomerLogoStripSlice | null>(null);

  protected readonly content = computed<LogoStripContent | null>(() => {
    const slice = this.slice();

    if (!slice) {
      return null;
    }

    const logos = slice.items
      .map((item) => {
        const logo = imageFromField(item.logo);
        const name = textOrEmpty(item.name);

        return logo
          ? {
              name,
              src: logo.src,
              alt: logo.alt || name,
            }
          : null;
      })
      .filter((logo): logo is LogoItem => logo !== null);

    return {
      ariaLabel: textOrEmpty(slice.primary.aria_label),
      logos,
    };
  });
}
