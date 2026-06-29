import { Component, computed, input } from '@angular/core';

import { richTextToText } from '../../../../core/prismic/prismic-field.utils';
import type { ExpertiseSectionSlice } from '../../../../core/prismic/prismic.types';

type ExpertiseContent = {
  readonly title: string;
  readonly text: string;
};

@Component({
  selector: 'app-expertise-section',
  imports: [],
  templateUrl: './expertise-section.html',
  styleUrl: './expertise-section.scss',
})
export class ExpertiseSection {
  readonly slice = input<ExpertiseSectionSlice | null>(null);

  protected readonly content = computed<ExpertiseContent | null>(() => {
    const primary = this.slice()?.primary;

    if (!primary) {
      return null;
    }

    return {
      title: richTextToText(primary.title),
      text: richTextToText(primary.text),
    };
  });
}
