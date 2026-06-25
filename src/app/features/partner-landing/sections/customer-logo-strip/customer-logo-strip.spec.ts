import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLogoStrip } from './customer-logo-strip';

describe('CustomerLogoStrip', () => {
  let component: CustomerLogoStrip;
  let fixture: ComponentFixture<CustomerLogoStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLogoStrip],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerLogoStrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
