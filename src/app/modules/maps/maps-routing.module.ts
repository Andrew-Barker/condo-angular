import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapsComponent } from './maps.component';
import { PoiComponent } from './poi/poi.component';

const routes: Routes = [
  {
    path: '',
    component: MapsComponent,
    children: [
      {
        path: 'points-of-interest',
        component: PoiComponent,
      },
      { path: '', redirectTo: 'points-of-interest', pathMatch: 'full' },
      { path: '**', redirectTo: 'points-of-interest', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
