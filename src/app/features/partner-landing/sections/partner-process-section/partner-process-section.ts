import { Component } from '@angular/core';
import { ProcessStepCard } from '../../ui/process-step-card/process-step-card';

@Component({
  selector: 'app-partner-process-section',
  imports: [ProcessStepCard],
  templateUrl: './partner-process-section.html',
  styleUrl: './partner-process-section.scss',
})
export class PartnerProcessSection {}
