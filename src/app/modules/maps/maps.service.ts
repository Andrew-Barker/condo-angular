import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const api = `${environment.url}`;

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) { }

  getPointsOfInterest(): Observable<any> {
    return this.http.get<any>(`${api}/pointsOfInterest`);
  }
}
