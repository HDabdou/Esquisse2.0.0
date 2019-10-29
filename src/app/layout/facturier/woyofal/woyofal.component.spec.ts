import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoyofalComponent } from './woyofal.component';

describe('WoyofalComponent', () => {
  let component: WoyofalComponent;
  let fixture: ComponentFixture<WoyofalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoyofalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoyofalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
