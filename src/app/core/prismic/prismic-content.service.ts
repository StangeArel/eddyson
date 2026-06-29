import { Injectable, inject } from '@angular/core';

import { PRISMIC_CLIENT } from './prismic.tokens';
import type { HeroSectionSlice, PartnerLandingPageDocument } from './prismic.types';

@Injectable({
  providedIn: 'root',
})
export class PrismicContentService {
  private readonly client = inject(PRISMIC_CLIENT);

  getPartnerLandingPage(): Promise<PartnerLandingPageDocument> {
    return this.client.getSingle('partner_landing_page');
  }

  async getHeroSection(): Promise<HeroSectionSlice | null> {
    const page = await this.getPartnerLandingPage();
    const heroSlice = page.data.body.find((slice) => slice.slice_type === 'hero_section');

    return heroSlice ? (heroSlice as HeroSectionSlice) : null;
  }
}
