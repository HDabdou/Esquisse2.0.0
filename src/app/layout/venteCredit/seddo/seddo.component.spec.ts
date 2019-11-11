import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeddoComponent } from './seddo.component';

describe('SeddoComponent', () => {
  let component: SeddoComponent;
  let fixture: ComponentFixture<SeddoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeddoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeddoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
