import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donor } from '../models/donor.model';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  private apiUrl = 'http://localhost:3000/api/donors';

  constructor(private http: HttpClient) {}

  getDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.apiUrl);
  }

  createDonor(data: Omit<Donor, 'id'>): Observable<Donor> {
    return this.http.post<Donor>(this.apiUrl, data);
  }
}