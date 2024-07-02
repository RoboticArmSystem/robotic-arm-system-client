import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoboticarmconnectService {

  private roboticarmResponseSubject = new BehaviorSubject<string>("");
  public roboticarmResponse$ = this.roboticarmResponseSubject.asObservable();
  // 狀態
  roboticArmConnectStatus!: boolean
  // success 、 error and error_api 
  roboticArmPromptMessage: string = ''
  constructor(private http: HttpClient) { }

  RoboticArmConnectStatusService(){
    this.http.get(environment.robotArmState)
    .subscribe(
      (res: any)=> {
        if(res.status === 'OK'){
          this.roboticarmResponseSubject.next("success");
        }else{
          this.roboticarmResponseSubject.next("error");
        }
      },
      error => {
        this.roboticarmResponseSubject.next("error_api");
      }
    );
  }


}
