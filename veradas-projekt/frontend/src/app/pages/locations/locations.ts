import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations implements OnInit {
  locations: Location[] = [];

  newLocation = {
    institutionName: '',
    address: '',
  };

  isSubmitting = false;

  constructor(
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe((data) => {
      this.locations = data;
      this.cdr.detectChanges();
    });
  }

  addLocation(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.newLocation.institutionName || !this.newLocation.address) {
      return;
    }

    this.isSubmitting = true;

    this.locationService.createLocation(this.newLocation).subscribe({
      next: (createdLocation) => {
        this.locations = [...this.locations, createdLocation];

        this.newLocation = {
          institutionName: '',
          address: '',
        };

        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleActive(location: Location): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const request = location.active
      ? this.locationService.deactivateLocation(location.id)
      : this.locationService.activateLocation(location.id);

    request.subscribe({
      next: () => {
        this.loadLocations();
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}