import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-request-panel',
  imports: [],
  templateUrl: './hero-request-panel.html',
  styleUrl: './hero-request-panel.scss',
})
export class HeroRequestPanel {
  readonly imageSrc = input('');
  readonly imageAlt = input('');
}
