import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipModelSection } from './partnership-model-section';

describe('PartnershipModelSection', () => {
  let component: PartnershipModelSection;
  let fixture: ComponentFixture<PartnershipModelSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnershipModelSection],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnershipModelSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
