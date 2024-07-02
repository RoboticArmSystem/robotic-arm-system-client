import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpMqttComponent } from './set-up-mqtt.component';

describe('SetUpMqttComponent', () => {
  let component: SetUpMqttComponent;
  let fixture: ComponentFixture<SetUpMqttComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetUpMqttComponent]
    });
    fixture = TestBed.createComponent(SetUpMqttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
