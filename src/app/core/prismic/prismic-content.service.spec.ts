import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PrismicContentService } from './prismic-content.service';
import { PRISMIC_CLIENT } from './prismic.tokens';
import type { HeroSectionSlice, PartnerLandingPageDocument } from './prismic.types';

describe('PrismicContentService', () => {
  const imageField = (url: string) => ({
    id: url,
    url,
    dimensions: {
      width: 100,
      height: 100,
    },
    alt: null,
    copyright: null,
    edit: {
      x: 0,
      y: 0,
      zoom: 1,
      background: 'transparent',
    },
  });

  const heroSlice = {
    id: 'hero-section',
    slice_type: 'hero_section',
    slice_label: null,
    variation: 'default',
    version: 'initial',
    primary: {
      title: [{ type: 'heading1', text: 'Your partner in the EDI jungle', spans: [] }],
      teaser_label: 'Select. Connect. Evolve.',
      teaser_title: 'Fast + Scalable + Successful',
      teaser_text: [
        {
          type: 'paragraph',
          text: 'At eddyson, we believe in technology that connects and partnerships that last.',
          spans: [],
        },
      ],
      secondary_button_label: 'Partner benefits',
      secondary_button_link: { link_type: 'Any' },
      primary_button_label: 'Become a partner',
      primary_button_link: { link_type: 'Any' },
      dot_background: imageField('https://images.prismic.io/hero-dots.png'),
      gradient_overlay: imageField('https://images.prismic.io/hero-gradient.svg'),
      request_panel_image: imageField('https://images.prismic.io/request-panel.png'),
      metric_card_image: imageField('https://images.prismic.io/metric-card.png'),
      media_card_image: imageField('https://images.prismic.io/media-card.png'),
    },
    items: [],
  } as HeroSectionSlice;

  it('should load the singleton partner landing page', async () => {
    const landingPage = {
      id: 'partner-page',
      type: 'partner_landing_page',
      data: {
        body: [],
      },
    } as unknown as PartnerLandingPageDocument;
    const getSingle = vi.fn().mockResolvedValue(landingPage);

    TestBed.configureTestingModule({
      providers: [
        PrismicContentService,
        {
          provide: PRISMIC_CLIENT,
          useValue: { getSingle },
        },
      ],
    });

    const service = TestBed.inject(PrismicContentService);

    await expect(service.getPartnerLandingPage()).resolves.toBe(landingPage);
    expect(getSingle).toHaveBeenCalledWith('partner_landing_page');
  });

  it('should return the hero section slice from the singleton page', async () => {
    const landingPage = {
      id: 'partner-page',
      type: 'partner_landing_page',
      data: {
        body: [heroSlice],
      },
    } as unknown as PartnerLandingPageDocument;
    const getSingle = vi.fn().mockResolvedValue(landingPage);

    TestBed.configureTestingModule({
      providers: [
        PrismicContentService,
        {
          provide: PRISMIC_CLIENT,
          useValue: { getSingle },
        },
      ],
    });

    const service = TestBed.inject(PrismicContentService);

    await expect(service.getHeroSection()).resolves.toBe(heroSlice);
  });
});
