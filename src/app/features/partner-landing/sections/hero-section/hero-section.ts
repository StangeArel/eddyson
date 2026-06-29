import { Component, computed, input } from '@angular/core';
import { asText, isFilled } from '@prismicio/client';
import type * as prismic from '@prismicio/client';

import type { HeroSectionSlice } from '../../../../core/prismic/prismic.types';
import { HeroMediaCard } from '../../ui/hero-media-card/hero-media-card';
import { HeroMetricCard } from '../../ui/hero-metric-card/hero-metric-card';
import { HeroRequestPanel } from '../../ui/hero-request-panel/hero-request-panel';

type HeroContent = {
  readonly title: string;
  readonly teaserLabel: string;
  readonly teaserTitle: string;
  readonly teaserText: string;
  readonly secondaryButtonLabel: string;
  readonly primaryButtonLabel: string;
  readonly dotBackground: HeroImage | null;
  readonly gradientOverlay: HeroImage | null;
  readonly requestPanelImage: HeroImage | null;
  readonly metricCardImage: HeroImage | null;
  readonly mediaCardImage: HeroImage | null;
};

type HeroImage = {
  readonly src: string;
  readonly alt: string;
};

@Component({
  selector: 'app-hero-section',
  imports: [HeroMediaCard, HeroMetricCard, HeroRequestPanel],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  readonly slice = input<HeroSectionSlice | null>(null);

  protected readonly content = computed<HeroContent | null>(() => {
    const primary = this.slice()?.primary;

    if (!primary) {
      return null;
    }

    return {
      title: this.richTextToText(primary.title),
      teaserLabel: this.textOrEmpty(primary.teaser_label),
      teaserTitle: this.textOrEmpty(primary.teaser_title),
      teaserText: this.richTextToText(primary.teaser_text),
      secondaryButtonLabel: this.textOrEmpty(primary.secondary_button_label),
      primaryButtonLabel: this.textOrEmpty(primary.primary_button_label),
      dotBackground: this.imageFromField(primary.dot_background),
      gradientOverlay: this.imageFromField(primary.gradient_overlay),
      requestPanelImage: this.imageFromField(primary.request_panel_image),
      metricCardImage: this.imageFromField(primary.metric_card_image),
      mediaCardImage: this.imageFromField(primary.media_card_image),
    };
  });

  protected readonly titleLines = computed(() => {
    const content = this.content();

    return content ? this.splitTitle(content.title) : [];
  });

  private richTextToText(field: Parameters<typeof asText>[0]): string {
    return asText(field)?.trim() ?? '';
  }

  private textOrEmpty(text: string | null | undefined): string {
    return text?.trim() ?? '';
  }

  private imageFromField(field: prismic.ImageField | null | undefined): HeroImage | null {
    if (!isFilled.image(field)) {
      return null;
    }

    return {
      src: field.url,
      alt: field.alt ?? '',
    };
  }

  private splitTitle(title: string): readonly string[] {
    const splitPoint = ' in the ';

    if (!title.includes(splitPoint)) {
      return [title];
    }

    const [start, end] = title.split(splitPoint);

    return [start, `in the ${end}`];
  }
}
