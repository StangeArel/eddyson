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
  | prismic.SharedSlice<Exclude<PartnerLandingSliceType, 'hero_section'>>;

export type PartnerLandingPageDocument = prismic.PrismicDocumentWithoutUID<
  {
    body: prismic.SliceZone<PartnerLandingSlice>;
  },
  'partner_landing_page'
>;

export type AllPrismicDocuments = PartnerLandingPageDocument;
