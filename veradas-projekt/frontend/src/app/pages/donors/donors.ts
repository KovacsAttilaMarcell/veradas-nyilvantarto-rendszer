import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonorService } from '../../services/donor.service';
import { Donor } from '../../models/donor.model';
import { isValidTaj } from '../../util/taj-validator';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-donors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donors.html',
  styleUrl: './donors.css',
})
export class Donors implements OnInit {
  donors: Donor[] = [];

  newDonor = {
    name: '',
    gender: '',
    citizenship: '',
    birthPlace: '',
    birthDate: '',
    address: '',
    tajNumber: '',
  };

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private donorService: DonorService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDonors();
  }

  loadDonors(): void {
    this.donorService.getDonors().subscribe((data) => {
      this.donors = data;
      this.cdr.detectChanges();
    });
  }

  addDonor(): void {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';

    if (
      !this.newDonor.name ||
      !this.newDonor.gender ||
      !this.newDonor.citizenship ||
      !this.newDonor.birthPlace ||
      !this.newDonor.birthDate ||
      !this.newDonor.address ||
      !this.newDonor.tajNumber
    ) {
      this.errorMessage = 'Minden mező kitöltése kötelező.';
      return;
    }

    if (!isValidTaj(this.newDonor.tajNumber)) {
      this.errorMessage = 'Érvénytelen TAJ szám.';
      return;
    }

    this.isSubmitting = true;

    this.donorService.createDonor(this.newDonor).subscribe({
      next: (createdDonor) => {
        this.donors = [...this.donors, createdDonor];
        this.errorMessage = '';

        this.newDonor = {
          name: '',
          gender: '',
          citizenship: '',
          birthPlace: '',
          birthDate: '',
          address: '',
          tajNumber: '',
        };

        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Hiba történt a mentés során.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}