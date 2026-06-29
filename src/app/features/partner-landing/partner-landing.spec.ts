import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PrismicContentService } from '../../core/prismic/prismic-content.service';
import { PartnerLanding } from './partner-landing';

describe('PartnerLanding', () => {
  let component: PartnerLanding;
  let fixture: ComponentFixture<PartnerLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerLanding],
      providers: [
        {
          provide: PrismicContentService,
          useValue: {
            getPartnerLandingSections: vi.fn().mockResolvedValue({
              heroSection: null,
              customerLogoStrip: null,
              partnerProcessSection: null,
              expertiseSection: null,
              partnershipModelSection: null,
              benefitsSection: null,
              contactSection: null,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerLanding);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
