import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEggPlateDataComponent } from './get-egg-plate-data.component';

describe('GetEggPlateDataComponent', () => {
  let component: GetEggPlateDataComponent;
  let fixture: ComponentFixture<GetEggPlateDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetEggPlateDataComponent]
    });
    fixture = TestBed.createComponent(GetEggPlateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
