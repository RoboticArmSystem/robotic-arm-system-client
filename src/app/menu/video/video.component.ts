import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  videoElement!: HTMLVideoElement;

  constructor() { }

  ngOnInit(): void {
  
  }

  ngAfterViewInit(): void {
    this.videoElement = <HTMLVideoElement>document.getElementById('videoElement');

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.srcObject = stream;
        this.videoElement.play();
      })
      .catch(error => {
        console.error('無法開啟相機:', error);
      });
  }

  ngOnDestroy(): void {
    // 釋放相機
    if (this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }
}
