import { Component, computed, input } from '@angular/core';

import {
  imageFromField,
  richTextToText,
  textOrEmpty,
  type PrismicImageView,
} from '../../../../core/prismic/prismic-field.utils';
import type { BenefitsSectionSlice } from '../../../../core/prismic/prismic.types';

type BenefitCard = {
  readonly image: PrismicImageView;
  readonly title: string;
  readonly description: string;
  readonly styleKey: string;
};

type BenefitsContent = {
  readonly ariaLabel: string;
  readonly cards: readonly BenefitCard[];
};

@Component({
  selector: 'app-benefits-section',
  imports: [],
  templateUrl: './benefits-section.html',
  styleUrl: './benefits-section.scss',
})
export class BenefitsSection {
  readonly slice = input<BenefitsSectionSlice | null>(null);

  protected readonly content = computed<BenefitsContent | null>(() => {
    const slice = this.slice();

    if (!slice) {
      return null;
    }

    return {
      ariaLabel: textOrEmpty(slice.primary.aria_label),
      cards: slice.items.flatMap((item) => {
        const image = imageFromField(item.image);
        const title = textOrEmpty(item.title);

        if (!image) {
          return [];
        }

        return [
          {
            image: {
              src: image.src,
              alt: image.alt || title,
            },
            title,
            description: richTextToText(item.description),
            styleKey: item.style_key ?? 'grow',
          },
        ];
      }),
    };
  });
}
