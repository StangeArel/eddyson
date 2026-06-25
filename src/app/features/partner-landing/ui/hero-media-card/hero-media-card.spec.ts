import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroMediaCard } from './hero-media-card';

describe('HeroMediaCard', () => {
  let component: HeroMediaCard;
  let fixture: ComponentFixture<HeroMediaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroMediaCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroMediaCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
