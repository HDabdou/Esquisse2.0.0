import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMoneyComponent } from './e-money.component';

describe('EMoneyComponent', () => {
  let component: EMoneyComponent;
  let fixture: ComponentFixture<EMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
