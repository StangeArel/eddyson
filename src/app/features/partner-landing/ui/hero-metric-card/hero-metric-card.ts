import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-metric-card',
  imports: [],
  templateUrl: './hero-metric-card.html',
  styleUrl: './hero-metric-card.scss',
})
export class HeroMetricCard {
  readonly imageSrc = input('');
  readonly imageAlt = input('');
}
