import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenelecComponent } from './senelec.component';

describe('SenelecComponent', () => {
  let component: SenelecComponent;
  let fixture: ComponentFixture<SenelecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenelecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenelecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
