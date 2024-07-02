import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { interval } from 'rxjs';
import { APIResponseView } from 'src/app/Interface/APIResponseView';
import { MqttConnectionInfoView, MqttConnectionLogView } from 'src/app/Interface/MqttConnectionInfoView';
import { MqttConnectionService } from 'src/app/Service/mqtt-connection.service';
import { environment } from 'src/environments/environment.development';
import { RoboticarmconnectService } from "../../Service/RoboticArmConnect/roboticarmconnect.service";

@Component({
  selector: 'app-get-egg-plate-data',
  templateUrl: './get-egg-plate-data.component.html',
  styleUrls: ['./get-egg-plate-data.component.scss']
})
export class GetEggPlateDataComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageBox', { static: false }) private messageBox: ElementRef | undefined;
  isMQTTEdit: boolean = true;
  ipAddress?: string;
  isipAddress: boolean = false;
  port?: string;
  isport: boolean = false;
  topic?: string;
  istopic: boolean = false;
  isbtnMQTTSave: boolean = false;
  MQTTSetConnectionmes: string[] = ["伺服器連線失敗！"];
  
  time = 0;

  ArmStatus: boolean = false;

  constructor(
    private http: HttpClient, 
    private message: NzMessageService,
    private mqttService: MqttConnectionService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private notification: NzNotificationService,
    private loadingBar: LoadingBarService,
    private RoboticarmconnectService: RoboticarmconnectService
  ){}

  ngOnInit(): void {
    // 偵測樹梅派是否開起API
    this.connectToArm();
    
    // 獲取當前MQTT連線資料
    this.getMQTTInfo();

    // 獲取MQTT LOG
    this.getMQTTLog();

    this.scrollToBottom()
    
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.messageBox) {
      try {
        this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
        // 使用 Renderer2 強制執行捲動
        this.renderer.setProperty(this.messageBox.nativeElement, 'scrollTop', this.messageBox.nativeElement.scrollHeight);
      } catch (err) { }
    }
  }

  loadNewMessages(event: Event) {
    const container = event.target as HTMLDivElement;
    if (container.scrollTop === 0) {
      const newMessages = ['New Message 1', 'New Message 2', 'New Message 3'];
      this.MQTTSetConnectionmes = newMessages.concat(this.MQTTSetConnectionmes);
      container.scrollTop = 100;
    }
  }
  

  // 取得MQTT連線資料
  getMQTTInfo(){
    this.http.get<APIResponseView<MqttConnectionInfoView>>(environment.apiUrl + '/MQTT/GetMqttConnectionInfo')
    .subscribe((res: APIResponseView<MqttConnectionInfoView>) => {
      if(res.isSuccess){
        console.log(res.data)
        this.ipAddress = res.data.ip;
        this.port = res.data.port;
        this.topic = res.data.topic;
      }else{  
        this.notification.create(
          'error',
          '智慧蛋盤',
          '連線狀態：錯誤！' + res.message
        );
      }
    });
  }

  getMQTTLog(){
    this.loadingBar.start();
    this.http.get<APIResponseView<{mqttConnectionLogMessageViews:MqttConnectionLogView[]}>>(environment.apiUrl + '/MQTT/GetMqttConnectionLogMessages').
    subscribe((res: APIResponseView<{mqttConnectionLogMessageViews:MqttConnectionLogView[]}>) => {
      if(res.isSuccess){
        this.MQTTSetConnectionmes = []; //清空
        res.data.mqttConnectionLogMessageViews.forEach((messageView: MqttConnectionLogView) =>{
          this.MQTTSetConnectionmes.push(messageView.message + "  [" + messageView.createtime + "]");
        })
        this.scrollToBottom();
        this.loadingBar.complete();
        // this.MQTTSetConnectionmes = res.data.mqttConnectionLogMessageViews[0].message;
      }else{
        
      }
    });    
  }

  // MQTT更新連線資料
  connectToMqtt(){
    if(this.ipAddress === '' || this.ipAddress === undefined){
      console.log(1)
      this.isipAddress = true;
    }else{
      this.isipAddress = false;
    }


    if(this.port === '' || this.port === undefined){
      console.log(1)
      this.isport = true;
    }else{
      this.isport = false;
    }

    if(this.topic === '' || this.topic === undefined){
      console.log(1)
      this.istopic = true;
    }else{
      this.istopic = false;
    }

    
    if((this.ipAddress !== '' && this.port !== '' && this.topic !== '') || (this.ipAddress !== undefined && this.port !== undefined && this.topic !== undefined)){
      this.loadingBar.start();
      this.http.post<APIResponseView<"">>(
      environment.apiUrl + '/MQTT/UpdateMQTTBackgroundServiceConnectionInfo' , 
      {
        ip: this.ipAddress,
        port: this.port,
        topic: this.topic
      }
      ).subscribe((res: APIResponseView<"">) => {
        if(res.isSuccess){
          this.notification.create(
            'success',
            '智慧蛋盤',
            '連線狀態：成功'
          );
        }else{
          this.notification.create(
            'error',
            '智慧蛋盤',
            '連線狀態：錯誤！' + res.message 
          );
        }
        this.loadingBar.complete();
        this.getMQTTLog();
      });
    }
  }

  // 編輯按鈕開關
  MQTTEditChange(){
    this.isMQTTEdit = !this.isMQTTEdit;
  }

  // 機械手臂偵測
  connectToArm(){
    this.RoboticarmconnectService.
    roboticarmResponse$
    .subscribe(
      roboticarm => {
        if(roboticarm === "success"){
          this.ArmStatus = true
        }else{
          this.ArmStatus = false
        }
        
      }
    );
  }



  
}
