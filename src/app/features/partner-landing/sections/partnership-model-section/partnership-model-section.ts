import { Component, computed, input } from '@angular/core';

import { linkToUrl, textOrEmpty } from '../../../../core/prismic/prismic-field.utils';
import type { PartnershipModelSectionSlice } from '../../../../core/prismic/prismic.types';

type PartnershipModelContent = {
  readonly question: string;
  readonly linkLabel: string;
  readonly linkSuffix: string;
  readonly linkUrl: string;
};

@Component({
  selector: 'app-partnership-model-section',
  imports: [],
  templateUrl: './partnership-model-section.html',
  styleUrl: './partnership-model-section.scss',
})
export class PartnershipModelSection {
  readonly slice = input<PartnershipModelSectionSlice | null>(null);

  protected readonly content = computed<PartnershipModelContent | null>(() => {
    const slice = this.slice();

    if (!slice) {
      return null;
    }

    const rawLinkLabel = textOrEmpty(slice.primary.link_label);
    const linkSuffix = rawLinkLabel.endsWith('.') ? '.' : '';
    const linkLabel = linkSuffix ? rawLinkLabel.slice(0, -1) : rawLinkLabel;

    return {
      question: textOrEmpty(slice.primary.question),
      linkLabel,
      linkSuffix,
      linkUrl: linkToUrl(slice.primary.link),
    };
  });
}
