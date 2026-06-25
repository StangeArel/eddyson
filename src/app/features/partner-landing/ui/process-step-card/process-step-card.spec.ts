import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStepCard } from './process-step-card';

describe('ProcessStepCard', () => {
  let component: ProcessStepCard;
  let fixture: ComponentFixture<ProcessStepCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessStepCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessStepCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
