import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDonations } from './view-donations';

describe('ViewDonations', () => {
  let component: ViewDonations;
  let fixture: ComponentFixture<ViewDonations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDonations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDonations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
