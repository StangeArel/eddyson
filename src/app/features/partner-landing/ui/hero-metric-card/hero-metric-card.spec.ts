import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroMetricCard } from './hero-metric-card';

describe('HeroMetricCard', () => {
  let component: HeroMetricCard;
  let fixture: ComponentFixture<HeroMetricCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroMetricCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroMetricCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
