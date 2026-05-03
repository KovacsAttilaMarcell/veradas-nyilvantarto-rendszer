import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../../services/donation.service';
import { LocationService } from '../../services/location.service';
import { DonorService } from '../../services/donor.service';
import { Donation } from '../../models/donation.model';
import { Location } from '../../models/location.model';
import { Donor } from '../../models/donor.model';

@Component({
  selector: 'app-view-donations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-donations.html',
  styleUrl: './view-donations.css',
})
export class ViewDonations implements OnInit {
  donations: Donation[] = [];
  locations: Location[] = [];
  donors: Donor[] = [];

  filters = {
    locationId: 0,
    donorId: 0,
    startDate: '',
    endDate: '',
  };

  constructor(
    private donationService: DonationService,
    private locationService: LocationService,
    private donorService: DonorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.loadDonors();
    this.loadDonations();
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe((data) => {
      this.locations = data;
      this.cdr.detectChanges();
    });
  }

  loadDonors(): void {
    this.donorService.getDonors().subscribe((data) => {
      this.donors = data;
      this.cdr.detectChanges();
    });
  }

  loadDonations(): void {
    const params: any = {};

    if (this.filters.locationId) {
      params.locationId = this.filters.locationId;
    }

    if (this.filters.donorId) {
      params.donorId = this.filters.donorId;
    }

    if (this.filters.startDate) {
      params.startDate = this.filters.startDate;
    }

    if (this.filters.endDate) {
      params.endDate = this.filters.endDate;
    }

    this.donationService.getDonations(params).subscribe((data) => {
      this.donations = data;
      this.cdr.detectChanges();
    });
  }

  applyFilters(): void {
    this.loadDonations();
  }

  resetFilters(): void {
    this.filters = {
      locationId: 0,
      donorId: 0,
      startDate: '',
      endDate: '',
    };

    this.loadDonations();
  }
}