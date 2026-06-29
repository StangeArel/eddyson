import { Component, OnInit, inject, signal } from '@angular/core';
import { PrismicContentService } from '../../core/prismic/prismic-content.service';
import type { HeroSectionSlice } from '../../core/prismic/prismic.types';
import { AnnouncementBar } from '../../layout/announcement-bar/announcement-bar';
import { SiteFooter } from '../../layout/site-footer/site-footer';
import { SiteHeader } from '../../layout/site-header/site-header';
import { BenefitsSection } from './sections/benefits-section/benefits-section';
import { ContactSection } from './sections/contact-section/contact-section';
import { CustomerLogoStrip } from './sections/customer-logo-strip/customer-logo-strip';
import { ExpertiseSection } from './sections/expertise-section/expertise-section';
import { HeroSection } from './sections/hero-section/hero-section';
import { PartnerProcessSection } from './sections/partner-process-section/partner-process-section';
import { PartnershipModelSection } from './sections/partnership-model-section/partnership-model-section';

@Component({
  selector: 'app-partner-landing',
  imports: [
    AnnouncementBar,
    SiteHeader,
    HeroSection,
    CustomerLogoStrip,
    PartnerProcessSection,
    ExpertiseSection,
    PartnershipModelSection,
    BenefitsSection,
    ContactSection,
    SiteFooter,
  ],
  templateUrl: './partner-landing.html',
  styleUrl: './partner-landing.scss',
})
export class PartnerLanding implements OnInit {
  private readonly prismicContent = inject(PrismicContentService);

  protected readonly heroSlice = signal<HeroSectionSlice | null>(null);

  ngOnInit(): void {
    void this.loadHeroContent();
  }

  private async loadHeroContent(): Promise<void> {
    try {
      this.heroSlice.set(await this.prismicContent.getHeroSection());
    } catch {
      this.heroSlice.set(null);
    }
  }
}
