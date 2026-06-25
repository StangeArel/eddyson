import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroRequestPanel } from './hero-request-panel';

describe('HeroRequestPanel', () => {
  let component: HeroRequestPanel;
  let fixture: ComponentFixture<HeroRequestPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroRequestPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroRequestPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
