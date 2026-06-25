import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseSection } from './expertise-section';

describe('ExpertiseSection', () => {
  let component: ExpertiseSection;
  let fixture: ComponentFixture<ExpertiseSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertiseSection],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertiseSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
