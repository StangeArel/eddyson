import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-process-step-card',
  imports: [],
  templateUrl: './process-step-card.html',
  styleUrl: './process-step-card.scss',
})
export class ProcessStepCard {
  @Input({ required: true }) imageSrc = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
}
