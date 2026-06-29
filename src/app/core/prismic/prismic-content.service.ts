import { Injectable, inject } from '@angular/core';

import { PRISMIC_CLIENT } from './prismic.tokens';
import type {
  BenefitsSectionSlice,
  ContactSectionSlice,
  CustomerLogoStripSlice,
  ExpertiseSectionSlice,
  HeroSectionSlice,
  PartnerLandingPageDocument,
  PartnerLandingSections,
  PartnerProcessSectionSlice,
  PartnershipModelSectionSlice,
} from './prismic.types';

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

  async getPartnerLandingSections(): Promise<PartnerLandingSections> {
    const page = await this.getPartnerLandingPage();

    return {
      heroSection: this.findSlice<HeroSectionSlice>(page, 'hero_section'),
      customerLogoStrip: this.findSlice<CustomerLogoStripSlice>(page, 'customer_logo_strip'),
      partnerProcessSection: this.findSlice<PartnerProcessSectionSlice>(
        page,
        'partner_process_section',
      ),
      expertiseSection: this.findSlice<ExpertiseSectionSlice>(page, 'expertise_section'),
      partnershipModelSection: this.findSlice<PartnershipModelSectionSlice>(
        page,
        'partnership_model_section',
      ),
      benefitsSection: this.findSlice<BenefitsSectionSlice>(page, 'benefits_section'),
      contactSection: this.findSlice<ContactSectionSlice>(page, 'contact_section'),
    };
  }

  private findSlice<TSlice extends { slice_type: string }>(
    page: PartnerLandingPageDocument,
    sliceType: TSlice['slice_type'],
  ): TSlice | null {
    const slice = page.data.body.find((section) => section.slice_type === sliceType);

    return slice ? (slice as unknown as TSlice) : null;
  }
}
