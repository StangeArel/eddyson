import { asLink, asText, isFilled } from '@prismicio/client';
import type * as prismic from '@prismicio/client';

export type PrismicImageView = {
  readonly src: string;
  readonly alt: string;
};

export function richTextToText(field: Parameters<typeof asText>[0]): string {
  return asText(field)?.trim() ?? '';
}

export function textOrEmpty(text: string | null | undefined): string {
  return text?.trim() ?? '';
}

export function imageFromField(
  field: prismic.ImageField | null | undefined,
): PrismicImageView | null {
  if (!isFilled.image(field)) {
    return null;
  }

  return {
    src: field.url,
    alt: field.alt ?? '',
  };
}

export function linkToUrl(field: prismic.LinkField | null | undefined): string {
  return asLink(field) ?? '';
}
