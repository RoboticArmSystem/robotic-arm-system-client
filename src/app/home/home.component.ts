import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MqttconnectService } from '../Service/MqttConnect/mqttconnect.service'
import { RoboticarmconnectService } from '../Service/RoboticArmConnect/roboticarmconnect.service'
import { Subject, catchError, interval, of, takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit  {
  isCollapsed = false; // Set the initial state to collapsed
  destroy$ = new Subject<void>();
  // MQTT連線暫存變數
  tmpMqttMes: string = "";
  // Robotic Arm 連線暫存變數
  tmpRoboticArmMes: string = "";

  constructor(
    private MqttconnectService: MqttconnectService,
    private RoboticarmconnectService: RoboticarmconnectService,
    private notification: NzNotificationService
  ){}

  ngAfterViewInit(): void {
   
  }

  ngOnInit(): void {
    interval(5000).subscribe(() => {
      this.getMqttConnection();
      this.getRobicArmConnection();
    });
    
    
  }

  // MQTT 是否有開啟
  getMqttConnection() {
    this.MqttconnectService.MqttConnectionStateService();

     // 訊息改變，進行通知
     this.MqttconnectService
     .MqttApiResponse$
     .subscribe(mqttPromptMessage => {
       if(this.tmpMqttMes !== mqttPromptMessage){
         this.tmpMqttMes = mqttPromptMessage
         if(mqttPromptMessage !== ""){
           this.EggplateNotification(mqttPromptMessage)
         }
       }
     });
  }

  // raspberry pi Flask 是否有開啟
  getRobicArmConnection(){
    this.RoboticarmconnectService.RoboticArmConnectStatusService();

    // 訊息改變，進行通知
    this.RoboticarmconnectService
    .roboticarmResponse$
    .subscribe(roboticArmPromptMessage => {
      if(this.tmpRoboticArmMes !== roboticArmPromptMessage){
        this.tmpRoboticArmMes = roboticArmPromptMessage
        if(roboticArmPromptMessage !== ""){
          this.ArmNotification(roboticArmPromptMessage);
        }
      }
    })
  }

  // 蛋盤通知
  EggplateNotification(type: string): void {
    if(type === 'success'){
      this.notification.create(
        type,
        '智慧蛋盤',
        '連線狀態：成功'
      );
    }else if(type === 'error'){
      this.notification.create(
        type,
        '智慧蛋盤',
        '連線狀態：未連線'
      );
    }else if(type === 'error_api'){
      this.notification.create(
        'error',
        '智慧蛋盤',
        '連線狀態：錯誤！伺服器服務未啟動' 
      );
    }else{
      this.notification.create(
        type,
        '智慧蛋盤',
        '連線狀態：錯誤，' + type
      );
    }
  }

  // 機械手臂通知
  ArmNotification(type: string): void {
    if(type === 'success'){
      this.notification.create(
        type,
        '機械手臂',
        '連線狀態：成功'
      );
    }else if(type === 'error'){
      this.notification.create(
        type,
        '機械手臂',
        '連線狀態：未連線'
      );
    }else if(type === 'error_api'){
      this.notification.create(
        'error',
        '機械手臂',
        '連線狀態：錯誤！伺服器服務未啟動' 
      );
    }else{
      this.notification.create(
        type,
        '機械手臂',
        '連線狀態：錯誤，' + type
      );
    }
  }

  

  
}
