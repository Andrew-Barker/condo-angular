import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  const apiUrl = `http://localhost:3000`;

  constructor(private http: HttpClient) { }

  getCondoEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookingRequests`);
  }

  addCondoRequest(condoRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bookingRequests`, condoRequest);
  }

  updateCondoRequest(condoRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bookingRequests/${condoRequest.id}`, condoRequest);
  }

  removeCondoRequest(id): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookingRequests/${id}`);
  }

  getWeatherOverview(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fiveDayWeather`);
  }
 }
