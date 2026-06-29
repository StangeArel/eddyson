import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-media-card',
  imports: [],
  templateUrl: './hero-media-card.html',
  styleUrl: './hero-media-card.scss',
})
export class HeroMediaCard {
  readonly imageSrc = input('');
  readonly imageAlt = input('');
}
