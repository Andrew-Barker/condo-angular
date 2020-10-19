import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnInit {
  lat= 27.3511812;
  lng = -82.6093296;
  pointsOfInterest = [];

  constructor(private mapService: MapsService, private changeDetection: ChangeDetectorRef) {
    console.log('poi constructor');
   }

  ngOnInit(): void {
    console.log('before poi rest call');
    this.mapService.getPointsOfInterest().subscribe(poiResp => {
      this.pointsOfInterest = poiResp;
      this.changeDetection.detectChanges();
      console.log('poi', poiResp);
    }, error => {
      console.error('error on get poi', error);
    })
  }

}
