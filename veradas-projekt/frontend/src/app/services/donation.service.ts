import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../models/donation.model';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiUrl = 'http://localhost:3000/api/donations';

  constructor(private http: HttpClient) {}

  getDonations(params?: {
    locationId?: number;
    donorId?: number;
    startDate?: string;
    endDate?: string;
  }): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.apiUrl, { params: params as any });
  }

  createDonation(data: {
    locationId: number;
    donorId: number;
    donationDate: string;
    eligible: boolean;
    ineligibleReason?: string | null;
    doctorName: string;
    directed: boolean;
    patientName?: string | null;
    patientTajNumber?: string | null;
  }): Observable<Donation> {
    return this.http.post<Donation>(this.apiUrl, data);
  }
}