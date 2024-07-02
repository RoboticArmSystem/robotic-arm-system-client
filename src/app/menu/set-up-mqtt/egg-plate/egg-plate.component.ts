import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-egg-plate',
  templateUrl: './egg-plate.component.html',
  styleUrls: ['./egg-plate.component.scss']
})
export class EggPlateComponent implements OnInit {
  @Input() eggs: boolean[] = []; // 父組件傳遞的蛋盤狀態陣列
  numtag: number[] = [1,2,3,4,5]
  customLeftValues :number[] = [16.5, 33.5, 50, 67, 84];
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  // 放入蛋到指定位置
  putEgg(index: number) {
    if (index >= 0 && index < 5) {
      this.eggs[index] = true;
      console.log(this.eggs); // 確認是否被更新為 [false, false, true, false, false]
      this.cdr.detectChanges(); // 強制觸發變更偵測
    }
  }

  // 移除蛋從指定位置
  removeEgg(index: number) {
    if (index >= 0 && index < 5) {
      this.eggs[index] = false;
      console.log(this.eggs); // 確認是否被更新為 [false, false, true, false, false]
      this.cdr.detectChanges(); // 強制觸發變更偵測
    }
  }
}
