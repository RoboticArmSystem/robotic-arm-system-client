import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EggPlateComponent } from './egg-plate.component';

describe('EggPlateComponent', () => {
  let component: EggPlateComponent;
  let fixture: ComponentFixture<EggPlateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EggPlateComponent]
    });
    fixture = TestBed.createComponent(EggPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
