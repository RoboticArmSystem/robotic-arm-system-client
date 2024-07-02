import { MqttConnectionService } from './../mqtt-connection.service';
import { MqttConnectionInfoView } from './../../Interface/MqttConnectionInfoView';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponseView } from 'src/app/Interface/APIResponseView';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MqttconnectService {
  private MqttApiResponseSubject = new BehaviorSubject<string>("");
  public MqttApiResponse$ = this.MqttApiResponseSubject.asObservable();
  // 狀態
  mqttConnectStatus!: boolean
  // 紀錄提示訊息 success 、 error and error_api 
  mqttPromptMessage: string = '';
  
  constructor(private http: HttpClient) { }


  MqttConnectionStateService() {
    this.http.get<APIResponseView<"">>(environment.apiUrl + '/MQTT/GetMqttConnectionStatus')
    .subscribe(res => {
      if(res.isSuccess){
        this.MqttApiResponseSubject.next("success")
      }else{
        this.MqttApiResponseSubject.next("error")
      }
    },
    error => {
      this.MqttApiResponseSubject.next("error_api")
    })
  }
 
}
