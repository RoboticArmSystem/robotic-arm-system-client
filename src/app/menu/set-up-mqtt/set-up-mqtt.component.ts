import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, IterableDiffers, ElementRef, AfterViewChecked, Renderer2, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MqttConnectionService } from '../../Service/mqtt-connection.service'
import { EggPlateComponent } from './egg-plate/egg-plate.component'
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject, interval } from 'rxjs';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { APIResponseView } from 'src/app/Interface/APIResponseView';
import { environment } from 'src/environments/environment.development';
import { EggTrayPositionChangeHistoryMessage } from 'src/app/Interface/MqttConnectionInfoView';
import { MqttconnectService } from '../../Service/MqttConnect/mqttconnect.service'
import { RoboticarmconnectService } from '../../Service/RoboticArmConnect/roboticarmconnect.service'
import { NzModalService } from 'ng-zorro-antd/modal';

interface apiResponse{
  numhistoryMessages: string[],
  strhistoryMessages: string[]
}

@Component({
  selector: 'app-set-up-mqtt',
  templateUrl: './set-up-mqtt.component.html',
  styleUrls: ['./set-up-mqtt.component.scss']
})
export class SetUpMqttComponent implements OnInit, AfterViewChecked {
  // @ViewChild('webcam') webcam: any;
  eggs: boolean[] = [true, true, true, true, true]; // 初始時蛋盤中沒有蛋
  strmqttStatus :boolean = false;
  private hubConnectionBuilder!: HubConnection;
  ipAddress?: string;
  port?: string;
  topic?: string;
  MQTTmessage: string[] = ["目前無法連線到伺服器服務，請檢查您的網路連線，或稍後再試一次。"];
  ARMmessage: string[] = ["辨識雞蛋座標即時狀態訊息"];
  successfiag: boolean = false;
  isCamera: boolean = true;
  //MQTT連線暫存變數
  tmpMqttMes: string = "";
  // mqtt 連線顯示狀態
  isMqttContectSatus: boolean = false;
  // robotic arm 連線顯示狀態
  isRoboticArmContectSatus: boolean = false;

  isBtn: boolean = false;

  // system state ex: process、finish、wait
  // done:camera doing:loading
  catchStatus: string = 'wait';
  catchIcon: string = 'camera';
  // done:dot-chart doing:loading
  AIStatus: string = 'wait';
  AIIcon: string = 'dot-chart';
  // done: doing:loading
  ArmStatus: string = 'wait';
  isArmIcon: number = 1;

  
  // done:check-circle doing:loading
  endStatus: string = 'wait';
  endIcon: string = 'check-circle';

  constructor(
    private http: HttpClient, 
    private message: NzMessageService,
    private mqttService: MqttConnectionService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private notification: NzNotificationService,
    private MqttconnectService: MqttconnectService,
    private RoboticarmconnectService: RoboticarmconnectService,
    private modal: NzModalService
    ){}
  
  
  ngOnInit(){

    // this.hubConnectionBuilder = new HubConnectionBuilder()
    //   .withUrl('https://localhost:7272/localHub')
    //   .configureLogging(LogLevel.Information)
    //   .build();
    this.hubConnectionBuilder = new HubConnectionBuilder()
    .withUrl(environment.signalR_URL)
    .configureLogging(LogLevel.Information)
    .build();

    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch(err => console.log('Error while connect with server'));

    // 訊息改變，進行通知
    this.MqttconnectService
    .MqttApiResponse$
    .subscribe(mqttPromptMessage => {
      if(mqttPromptMessage === "success"){
        this.isMqttContectSatus = true;
      }else{
        this.isMqttContectSatus = false;
      }
    });

    this.RoboticarmconnectService
    .roboticarmResponse$
    .subscribe(roboticArmPromptMessage => {
      if(roboticArmPromptMessage === "success"){
        this.isRoboticArmContectSatus = true;
      }else{
        this.isRoboticArmContectSatus = false;
      }
      
    });

    // 獲取蛋盤歷史訊息
    this.getEggTrayMessage();

    // 獲取蛋盤狀態最新位置
    this.getEggTrayNewPosition();

    // this.scrollToBottom();
    // signalR推播接收即時蛋盤位置
    this.signalRMessage();

    // SignalR系統運作狀態
    this.signalRSystemState();

    //S機械手臂動作
    this.signalRArmState();

    // AI圖示
    this.signalRAIModal();
   
    // 完成圖示(機械手臂結束動作)
    this.signalRARMEnd();
  }

  // signalR推播接收即時蛋盤位置
  signalRMessage(){
    // 訂閱蛋盤即時位置
    this.hubConnectionBuilder.on('EggTrayPositionData', (result: any) => {
      this.getEggPlateData(result)
    });
    // 訂閱蛋盤即時訊息
    this.hubConnectionBuilder.on('EggTaryPositionMessage', (result: any) => {
      this.MessageDataProcessing(result)
    });
  }

  signalRSystemState(){
    // 訂閱系統執行狀態
    // step1
    this.hubConnectionBuilder.on('EggTrayPositionData', (result: any) => {
      this.getEggPlateData(result)
    });
    // step2
    // step3
    // step4
  }

  // 機器手臂動作訊息
  first = true
  signalRArmState(){
    this.hubConnectionBuilder.on('ArmState', (result: any) => {
      if(this.first){
        this.ARMmessage = []
        this.first = false
      }
      
      this.ARMmessage.push(result);
      // console.log(result)
    });
  }

  // AI流程圖示推播
  signalRAIModal(){
    this.hubConnectionBuilder.on('AIModal', (result: any) => {
      // 關閉
      console.log(result)
      if(result == "OK"){
         //開啟AI訓練ICON
         // system state ex: process、finish、wait
          // done:dot-chart doing:loading
          this.AIStatus = 'finish';
          this.AIIcon= 'dot-chart';

          // 開啟機械手臂運作
           // done: doing:loading
          this.ArmStatus = 'process';
          this.isArmIcon = 0;
      }
    });
  }

  // 完成圖示(機械手臂結束動作)
  signalRARMEnd(){
    this.hubConnectionBuilder.on('ARMEnd', (result: any) => {
      console.log(result)
      if(result === "End"){
        // 開啟完成圖示
        this.endStatus = 'finish';
        this.endIcon= 'check-circle';
      }
      
    });
  }

  // 判斷後端MQTT是否連線
  SetMqttConnectionStatus(){
    this.http.get<(APIResponseView<"">)>(environment.apiUrl + '/MQTT/GetMqttConnectionStatus').
    subscribe((res: APIResponseView<"">) => {
      if(res.isSuccess){
        this.EggplateNotification("success");
      }else{
        this.EggplateNotification("error");
      }  
    },
    error => {
      this.EggplateNotification("error_api");
    })
  }

  // 獲取蛋盤歷史訊息
  getEggTrayMessage(){
    this.http.get<APIResponseView<{positionChangeHistoryMessageViews: EggTrayPositionChangeHistoryMessage[]}>>(environment.apiUrl + '/MQTT/GetEggTrayPositionChangeHistoryMessage').
    subscribe((res: APIResponseView<{positionChangeHistoryMessageViews: EggTrayPositionChangeHistoryMessage[]}>) => {
      if(res.isSuccess){
        this.MQTTmessage = [];
        res.data.positionChangeHistoryMessageViews
        .forEach((EggTrayPositionChange: EggTrayPositionChangeHistoryMessage) => {
          this.MessageDataProcessing(EggTrayPositionChange.positionChange);
        });
      }else{
        this.EggplateNotification("error");
      }
    });
  }

  // 蛋盤狀態訊息處理
  MessageDataProcessing(data: string){
    const d = data.split(',');
    d.forEach((singlemessage) => {
      if(singlemessage){
        this.MQTTmessage.push(singlemessage);
      }
      
    })
  }

  // 獲取蛋盤狀態最新位置
  getEggTrayNewPosition(){
    this.http.get<APIResponseView<string>>(environment.apiUrl + '/MQTT/GetEggTrayNewPositionData')
    .subscribe((res: APIResponseView<string>) => {
      if(res.isSuccess){
        this.getEggPlateData(res.data);
      }
    });
  }

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  // 開始偵測按鈕事件
  takePhoto() {
    if(this.isRoboticArmContectSatus === true){
      this.notification.create(
        'success',
        '影像辨識',
        '開始偵測影像中雞蛋'
      );
      this.isBtn = true;
      // 開啟流程ICON
      // system state ex: process、finish、wait
      // done:camera doing:loading
      this.catchStatus = 'process';
      this.catchIcon = 'loading';
      this.trigger.next();

    }else{
      this.notification.create(
        'error',
        '影像辨識',
        '機器手臂無法連線到伺服器服務'
      );
    }
    
    
  }

   //截圖圖片
  captureImage(webcamImage: WebcamImage) {
    // 將圖片轉base64
    const base64Image = webcamImage.imageAsBase64;
    // 將base64圖片丟到後端API
    this.sendImageToBackend(base64Image);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  //將擷取圖片丟到後端API進行處理
  sendImageToBackend(base64Image: string) {
    // 關閉拍照流程icon
    // system state ex: process、finish、wait
    // done:camera doing:loading
    this.catchStatus = 'finish';
    this.catchIcon = 'camera';

    //開啟AI訓練ICON
    // done:dot-chart doing:loading
    this.AIStatus = 'process';
    this.AIIcon= 'loading';

    // const apiUrl = 'http://10.25.1.203:7272/RoboticArm/ImageCapture/PoshImage'; 
    const apiUrl = environment.apiUrl + '/ImageCapture/PoshImage';
    const requestData = { user_photo: base64Image }; 

    this.http.post(apiUrl, requestData).subscribe(response => {
      //關閉btn 
      this.isBtn = false;

      //關閉機器手臂運作圖示
      // done: doing:loading
      this.ArmStatus = 'finish';
      this.isArmIcon = 2;

        //延遲效果
      setTimeout(() => {
        //執行完有個確認畫面
        this.success();
      }, 500);    

      // 關閉全部狀態
      this.closeicon();
    });
    
  }

  closeicon(){
    this.catchStatus = 'wait';
    this.catchIcon = 'camera';
  // done:dot-chart doing:loading
    this.AIStatus= 'wait';
    this.AIIcon= 'dot-chart';
  // done: doing:loading
    this.ArmStatus = 'wait';
    this.isArmIcon = 1;

  
  // done:check-circle doing:loading
    this.endStatus = 'wait';
    this.endIcon = 'check-circle';
  }

  // 完成通知
  success(): void {
    this.modal.success({
      nzTitle: '系統運作狀態',
      nzContent: '🎉雞蛋排序系統已執行結束🎉'
    });
  }
  

  //蛋盤通知
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
        '連線狀態：錯誤！伺服器API未啟動' 
      );
    }else{
      this.notification.create(
        type,
        '智慧蛋盤',
        '連線狀態：錯誤，' + type
      );
    }
    
  }

  //機械手臂通知
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
    }else{
      this.notification.create(
        type,
        '機械手臂',
        '連線狀態：錯誤，' + type
      );
    }
  }


  @ViewChild('messageBox', { static: false }) private messageBox: ElementRef | undefined;
  @ViewChild('ARMmessageBox', { static: false }) private ARMmessageBox: ElementRef | undefined;

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

    if (this.ARMmessageBox) {
      try {
        this.ARMmessageBox.nativeElement.scrollTop = this.ARMmessageBox.nativeElement.scrollHeight;
        // 使用 Renderer2 強制執行捲動
        this.renderer.setProperty(this.ARMmessageBox.nativeElement, 'scrollTop', this.ARMmessageBox.nativeElement.scrollHeight);
      } catch (err) { }
    }
  }

  // 雞蛋顯示位置處理
  getEggPlateData(data: string){
    if(data){
      if(data != "連線成功"){
        let strArry: string[] = data.split(',');

        let boolArry: boolean[] = strArry.map(item => item === '1');

        this.eggs = boolArry;
      }
    }
  }



}
