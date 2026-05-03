import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDonation } from './add-donation';

describe('AddDonation', () => {
  let component: AddDonation;
  let fixture: ComponentFixture<AddDonation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDonation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDonation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
