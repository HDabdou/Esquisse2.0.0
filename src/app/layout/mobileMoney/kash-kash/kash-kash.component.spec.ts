import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KashKashComponent } from './kash-kash.component';

describe('KashKashComponent', () => {
  let component: KashKashComponent;
  let fixture: ComponentFixture<KashKashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KashKashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KashKashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
