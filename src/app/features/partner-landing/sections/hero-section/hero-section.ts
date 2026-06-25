import { Component } from '@angular/core';

import { HeroMediaCard } from '../../ui/hero-media-card/hero-media-card';
import { HeroMetricCard } from '../../ui/hero-metric-card/hero-metric-card';
import { HeroRequestPanel } from '../../ui/hero-request-panel/hero-request-panel';

@Component({
  selector: 'app-hero-section',
  imports: [HeroMediaCard, HeroMetricCard, HeroRequestPanel],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {}
