import { Component } from '@angular/core';
import { PartnerContactForm } from '../../ui/partner-contact-form/partner-contact-form';

@Component({
  selector: 'app-contact-section',
  imports: [PartnerContactForm],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {}
