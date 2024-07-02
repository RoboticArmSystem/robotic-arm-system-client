import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MqttConnectionService {
  //全局變數
  ipAddress?: string ;
  port?: string;
  topic?: string;
  isConnected: boolean = false;
}
