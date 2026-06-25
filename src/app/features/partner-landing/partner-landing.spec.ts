import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerLanding } from './partner-landing';

describe('PartnerLanding', () => {
  let component: PartnerLanding;
  let fixture: ComponentFixture<PartnerLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerLanding],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerLanding);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
