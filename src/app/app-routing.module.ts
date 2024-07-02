import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GetEggPlateDataComponent } from './menu/get-egg-plate-data/get-egg-plate-data.component';
import { SetUpMqttComponent } from "./menu/set-up-mqtt/set-up-mqtt.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home/SmartEggPlateConnect' },
  { path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'SmartEggPlateConnect', component: GetEggPlateDataComponent},
      { path: 'SetUpMqtt', component: SetUpMqttComponent}
    ]
  },
  {
    path: '**',
    redirectTo: 'home' ,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
