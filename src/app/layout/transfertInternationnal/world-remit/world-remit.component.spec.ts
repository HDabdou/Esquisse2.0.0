import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldRemitComponent } from './world-remit.component';

describe('WorldRemitComponent', () => {
  let component: WorldRemitComponent;
  let fixture: ComponentFixture<WorldRemitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorldRemitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldRemitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
