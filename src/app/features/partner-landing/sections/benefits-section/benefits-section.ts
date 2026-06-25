import { Component } from '@angular/core';
import { BenefitCard } from '../../ui/benefit-card/benefit-card';

@Component({
  selector: 'app-benefits-section',
  imports: [BenefitCard],
  templateUrl: './benefits-section.html',
  styleUrl: './benefits-section.scss',
})
export class BenefitsSection {}
