import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/partner-landing/partner-landing').then((m) => m.PartnerLanding),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
