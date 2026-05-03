import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { DonorService } from '../../services/donor.service';
import { DonationService } from '../../services/donation.service';
import { Location } from '../../models/location.model';
import { Donor } from '../../models/donor.model';
import { isValidTaj } from '../../util/taj-validator';

@Component({
  selector: 'app-add-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-donation.html',
  styleUrl: './add-donation.css',
})
export class AddDonation implements OnInit {
  locations: Location[] = [];
  donors: Donor[] = [];

  donationForm = {
    locationId: 0,
    donorId: 0,
    donationDate: new Date().toISOString().split('T')[0],
    eligible: true,
    ineligibleReason: '',
    doctorName: '',
    directed: false,
    patientName: '',
    patientTajNumber: '',
  };

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private locationService: LocationService,
    private donorService: DonorService,
    private donationService: DonationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.loadDonors();
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

  onEligibleChange(): void {
    if (!this.donationForm.eligible) {
      this.donationForm.directed = false;
      this.donationForm.patientName = '';
      this.donationForm.patientTajNumber = '';
    }
  }

  onDirectedChange(): void {
    if (!this.donationForm.directed) {
      this.donationForm.patientName = '';
      this.donationForm.patientTajNumber = '';
    }
  }

  addDonation(): void {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.donationForm.locationId ||
      !this.donationForm.donorId ||
      !this.donationForm.donationDate ||
      !this.donationForm.doctorName
    ) {
      this.errorMessage = 'A kötelező mezők hiányoznak.';
      return;
    }

    if (!this.donationForm.eligible && !this.donationForm.ineligibleReason) {
      this.errorMessage = 'Ha a jelölt nem alkalmas, az ok megadása kötelező.';
      return;
    }

    if (!this.donationForm.eligible && this.donationForm.directed) {
      this.errorMessage = 'Nem alkalmas jelölt esetén nem lehet irányított véradás.';
      return;
    }

    if (this.donationForm.directed) {
      if (!this.donationForm.patientName || !this.donationForm.patientTajNumber) {
        this.errorMessage =
          'Irányított véradás esetén a beteg neve és TAJ száma kötelező.';
        return;
      }

      if (!isValidTaj(this.donationForm.patientTajNumber)) {
        this.errorMessage = 'A beteg TAJ száma érvénytelen.';
        return;
      }
    }

    this.isSubmitting = true;

    this.donationService.createDonation({
      locationId: this.donationForm.locationId,
      donorId: this.donationForm.donorId,
      donationDate: this.donationForm.donationDate,
      eligible: this.donationForm.eligible,
      ineligibleReason: this.donationForm.eligible
        ? null
        : this.donationForm.ineligibleReason,
      doctorName: this.donationForm.doctorName,
      directed: this.donationForm.directed,
      patientName: this.donationForm.directed
        ? this.donationForm.patientName
        : null,
      patientTajNumber: this.donationForm.directed
        ? this.donationForm.patientTajNumber
        : null,
    }).subscribe({
      next: () => {
        this.successMessage = 'A véradás sikeresen rögzítve lett.';
        this.errorMessage = '';

        this.donationForm = {
          locationId: 0,
          donorId: 0,
          donationDate: new Date().toISOString().split('T')[0],
          eligible: true,
          ineligibleReason: '',
          doctorName: '',
          directed: false,
          patientName: '',
          patientTajNumber: '',
        };

        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Hiba történt a véradás rögzítése során.';
        this.successMessage = '';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
