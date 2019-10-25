import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TigocashComponent } from './tigocash.component';

describe('TigocashComponent', () => {
  let component: TigocashComponent;
  let fixture: ComponentFixture<TigocashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TigocashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TigocashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
