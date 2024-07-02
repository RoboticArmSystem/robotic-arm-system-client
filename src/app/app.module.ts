import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_TW } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { HomeComponent } from './home/home.component';
import { GetEggPlateDataComponent } from './menu/get-egg-plate-data/get-egg-plate-data.component'
import { MqttModule, IMqttServiceOptions, MQTT_SERVICE_OPTIONS } from 'ngx-mqtt';
import { SetUpMqttComponent } from './menu/set-up-mqtt/set-up-mqtt.component';
import { EggPlateComponent } from './menu/set-up-mqtt/egg-plate/egg-plate.component';
import { VideoComponent } from './menu/video/video.component';
import { WebcamModule } from 'ngx-webcam';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingBarModule } from '@ngx-loading-bar/core';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GetEggPlateDataComponent,
    SetUpMqttComponent,
    EggPlateComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    DemoNgZorroAntdModule,
    WebcamModule,
    FlexLayoutModule,
    LoadingBarModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_TW }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
