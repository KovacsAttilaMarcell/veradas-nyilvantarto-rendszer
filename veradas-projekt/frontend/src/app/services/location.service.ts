import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/api/locations';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  createLocation(data: {
    institutionName: string;
    address: string;
  }): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, data);
  }

  activateLocation(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateLocation(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/deactivate`, {});
  }
}