import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { PoiComponent } from './poi/poi.component';
import { MapsComponent } from './maps.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [MapsComponent, PoiComponent],
  imports: [
    CommonModule,
    MapsRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: ''
    })
  ]
})
export class MapsModule { }
