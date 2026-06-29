import type * as prismic from '@prismicio/client';

export type HeroSectionSlice = prismic.SharedSlice<
  'hero_section',
  prismic.SharedSliceVariation<
    'default',
    {
      title: prismic.TitleField;
      teaser_label: prismic.KeyTextField;
      teaser_title: prismic.KeyTextField;
      teaser_text: prismic.RichTextField;
      secondary_button_label: prismic.KeyTextField;
      secondary_button_link: prismic.LinkField;
      primary_button_label: prismic.KeyTextField;
      primary_button_link: prismic.LinkField;
      dot_background: prismic.ImageField;
      gradient_overlay: prismic.ImageField;
      request_panel_image: prismic.ImageField;
      metric_card_image: prismic.ImageField;
      media_card_image: prismic.ImageField;
    }
  >
>;

export type CustomerLogoStripSlice = prismic.SharedSlice<
  'customer_logo_strip',
  prismic.SharedSliceVariation<
    'default',
    {
      aria_label: prismic.KeyTextField;
    },
    {
      logo: prismic.ImageField;
      name: prismic.KeyTextField;
    }
  >
>;

export type PartnerProcessSectionSlice = prismic.SharedSlice<
  'partner_process_section',
  prismic.SharedSliceVariation<
    'default',
    {
      eyebrow: prismic.KeyTextField;
      title: prismic.TitleField;
      text: prismic.RichTextField;
      ribbon_image: prismic.ImageField;
    },
    {
      image: prismic.ImageField;
      title: prismic.KeyTextField;
      description: prismic.RichTextField;
    }
  >
>;

export type ExpertiseSectionSlice = prismic.SharedSlice<
  'expertise_section',
  prismic.SharedSliceVariation<
    'default',
    {
      title: prismic.TitleField;
      text: prismic.RichTextField;
    }
  >
>;

export type PartnershipModelSectionSlice = prismic.SharedSlice<
  'partnership_model_section',
  prismic.SharedSliceVariation<
    'default',
    {
      question: prismic.KeyTextField;
      link_label: prismic.KeyTextField;
      link: prismic.LinkField;
    }
  >
>;

export type BenefitsSectionSlice = prismic.SharedSlice<
  'benefits_section',
  prismic.SharedSliceVariation<
    'default',
    {
      aria_label: prismic.KeyTextField;
    },
    {
      image: prismic.ImageField;
      title: prismic.KeyTextField;
      description: prismic.RichTextField;
      style_key: prismic.SelectField<
        'grow' | 'earn' | 'technology' | 'diverse' | 'competitive' | 'collaboration'
      >;
    }
  >
>;

export type ContactSectionSlice = prismic.SharedSlice<
  'contact_section',
  prismic.SharedSliceVariation<
    'default',
    {
      title: prismic.TitleField;
      text: prismic.RichTextField;
      background_image: prismic.ImageField;
      submit_label: prismic.KeyTextField;
      privacy_text: prismic.KeyTextField;
      privacy_link: prismic.LinkField;
    },
    {
      label: prismic.KeyTextField;
      placeholder: prismic.KeyTextField;
      field_type: prismic.SelectField<'text' | 'email' | 'tel' | 'select' | 'textarea'>;
      required_label: prismic.KeyTextField;
    }
  >
>;

export type PartnerLandingSliceType =
  | 'hero_section'
  | 'customer_logo_strip'
  | 'partner_process_section'
  | 'expertise_section'
  | 'partnership_model_section'
  | 'benefits_section'
  | 'contact_section';

export type PartnerLandingSlice =
  | HeroSectionSlice
  | CustomerLogoStripSlice
  | PartnerProcessSectionSlice
  | ExpertiseSectionSlice
  | PartnershipModelSectionSlice
  | BenefitsSectionSlice
  | ContactSectionSlice;

export type PartnerLandingSections = {
  readonly heroSection: HeroSectionSlice | null;
  readonly customerLogoStrip: CustomerLogoStripSlice | null;
  readonly partnerProcessSection: PartnerProcessSectionSlice | null;
  readonly expertiseSection: ExpertiseSectionSlice | null;
  readonly partnershipModelSection: PartnershipModelSectionSlice | null;
  readonly benefitsSection: BenefitsSectionSlice | null;
  readonly contactSection: ContactSectionSlice | null;
};

export type PartnerLandingPageDocument = prismic.PrismicDocumentWithoutUID<
  {
    body: prismic.SliceZone<PartnerLandingSlice>;
  },
  'partner_landing_page'
>;

export type AllPrismicDocuments = PartnerLandingPageDocument;
