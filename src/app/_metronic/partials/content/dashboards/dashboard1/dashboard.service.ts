import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl = `http://localhost:3000`;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient) { }

  getCondoEvents(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/bookingRequests`);
  }

  addCondoRequest(condoRequest): Observable<any> {
    return this.http.post<any>(`${apiUrl}/bookingRequests`, condoRequest);
  }

  updateCondoRequest(condoRequest): Observable<any> {
    return this.http.put<any>(`${apiUrl}/bookingRequests/${condoRequest.id}`, condoRequest);
  }

  removeCondoRequest(id): Observable<any> {
    return this.http.delete(`${apiUrl}/bookingRequests/${id}`);
  }

  getWeatherOverview(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/fiveDayWeather`);
  }
 }
