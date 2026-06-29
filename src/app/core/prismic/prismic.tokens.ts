import { InjectionToken, inject } from '@angular/core';
import * as prismic from '@prismicio/client';

import type { AllPrismicDocuments } from './prismic.types';

export const PRISMIC_REPOSITORY_NAME = new InjectionToken<string>('Prismic repository name', {
  providedIn: 'root',
  factory: () => 'eddyson',
});

export const PRISMIC_CLIENT = new InjectionToken<prismic.Client<AllPrismicDocuments>>(
  'Prismic content client',
  {
    providedIn: 'root',
    factory: () => prismic.createClient<AllPrismicDocuments>(inject(PRISMIC_REPOSITORY_NAME)),
  },
);
