import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
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
  };


  async addPoi() {
    
    const { value: formValues } = await Swal.fire({
      title: 'Add Place of Interest',
      html:
        `<form>
        <label>Address:</label><input id="swal-input1" class="swal2-input">' 
        <label>Category:</label><input id="swal-input2" class="swal2-input">
        <label>Select:</label><select id="swalSelect" class="swal2-select swal2-input">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
        </select>
        </form>`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    })
    
    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
    }
    
  }

}
