import { Component } from '@angular/core';
import { ProcessStepCard } from '../../ui/process-step-card/process-step-card';

interface ProcessStep {
  imageSrc: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-partner-process-section',
  imports: [ProcessStepCard],
  templateUrl: './partner-process-section.html',
  styleUrl: './partner-process-section.scss',
})
export class PartnerProcessSection {
  protected readonly steps: ProcessStep[] = [
    {
      imageSrc: '/assets/partner-program/connect-handshake.png',
      title: 'Connect',
      description:
        'Use our form to get in touch with us. Share the most important information about your use case at a glance.',
    },
    {
      imageSrc: '/assets/partner-program/quality-exchange.png',
      title: 'Quality',
      description:
        'In personal conversations, we align expectations, define requirements, and shape our joint path forward.',
    },
    {
      imageSrc: '/assets/partner-program/launch-team.png',
      title: 'Launch',
      description:
        'With Select. Connect. Evolve, we onboard your customers, continuously exchange ideas, and grow side by side.',
    },
  ];
}
