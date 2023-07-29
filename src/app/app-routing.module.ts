import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsriMapComponent } from './esri-map/esri-map.component';

const routes: Routes = [
  { path:'', component:EsriMapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
