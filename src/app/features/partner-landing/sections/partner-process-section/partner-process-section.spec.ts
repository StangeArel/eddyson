import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerProcessSection } from './partner-process-section';

describe('PartnerProcessSection', () => {
  let component: PartnerProcessSection;
  let fixture: ComponentFixture<PartnerProcessSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerProcessSection],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerProcessSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
