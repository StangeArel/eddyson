import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { HeroSectionSlice } from '../../../../core/prismic/prismic.types';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSection],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the loading skeleton while Prismic content is missing', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('.hero-section__title-skeleton')).not.toBeNull();
    expect(nativeElement.querySelector('.hero-section')?.getAttribute('aria-busy')).toBe('true');
    expect(nativeElement.textContent).not.toContain('Your partner');
    expect(nativeElement.textContent).not.toContain('Fast + Scalable + Successful');
  });

  it('should render the hero copy from Prismic', () => {
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

    fixture.componentRef.setInput('slice', heroSlice);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('.hero-section__title')?.textContent).toContain(
      'Your partner',
    );
    expect(nativeElement.querySelector('.hero-section__teaser-title')?.textContent).toContain(
      'Fast + Scalable + Successful',
    );
    expect(nativeElement.querySelector('.hero-section__teaser-text')?.textContent).toContain(
      'At eddyson',
    );
    expect(nativeElement.querySelector('.hero-section__background--dots')).not.toBeNull();
    expect(nativeElement.querySelector('app-hero-request-panel img')?.getAttribute('src')).toBe(
      'https://images.prismic.io/request-panel.png',
    );
  });
});
