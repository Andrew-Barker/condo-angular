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
  condoIcon = "./assets/media/maps/condo_marker.png";
  flatPOI = [];
  pointsOfInterest = [];

  constructor(private mapService: MapsService, private changeDetection: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('before poi rest call');
    this.mapService.getPointsOfInterest().subscribe(poiResp => {
      this.pointsOfInterest = poiResp;
      this.changeDetection.detectChanges();

      console.log(poiResp);

      this.pointsOfInterest.forEach(category => {
        category.places.forEach(place => {
          let icon: string;
          
          switch(category.category){
            case 'Restaurants':
              icon = "./assets/media/maps/restaurant.png"
              break;
            case 'Grocery':
              icon = "./assets/media/maps/grocery.png"
              break;
            default:
              icon = "./assets/media/maps/attraction.png"
              break;
          }

          place['icon'] = icon; 
          this.flatPOI.push(place);
        })
      });

      console.log('flatPOI', this.flatPOI);
      this.changeDetection.detectChanges();

    }, error => {
      console.error('error on get poi', error);
    })
  }

}
