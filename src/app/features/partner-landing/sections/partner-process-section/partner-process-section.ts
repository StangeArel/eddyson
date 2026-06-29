import { Component, computed, input } from '@angular/core';

import {
  imageFromField,
  richTextToText,
  textOrEmpty,
  type PrismicImageView,
} from '../../../../core/prismic/prismic-field.utils';
import type { PartnerProcessSectionSlice } from '../../../../core/prismic/prismic.types';
import { ProcessStepCard } from '../../ui/process-step-card/process-step-card';

type ProcessStep = {
  readonly image: PrismicImageView;
  readonly title: string;
  readonly description: string;
};

type ProcessContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly ribbonImage: PrismicImageView | null;
  readonly steps: readonly ProcessStep[];
};

@Component({
  selector: 'app-partner-process-section',
  imports: [ProcessStepCard],
  templateUrl: './partner-process-section.html',
  styleUrl: './partner-process-section.scss',
})
export class PartnerProcessSection {
  readonly slice = input<PartnerProcessSectionSlice | null>(null);

  protected readonly content = computed<ProcessContent | null>(() => {
    const slice = this.slice();

    if (!slice) {
      return null;
    }

    const steps = slice.items
      .map((item) => {
        const image = imageFromField(item.image);

        return image
          ? {
              image,
              title: textOrEmpty(item.title),
              description: richTextToText(item.description),
            }
          : null;
      })
      .filter((step): step is ProcessStep => step !== null);

    return {
      eyebrow: textOrEmpty(slice.primary.eyebrow),
      title: richTextToText(slice.primary.title),
      text: richTextToText(slice.primary.text),
      ribbonImage: imageFromField(slice.primary.ribbon_image),
      steps,
    };
  });
}
