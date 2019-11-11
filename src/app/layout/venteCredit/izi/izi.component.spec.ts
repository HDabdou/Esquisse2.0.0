import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IziComponent } from './izi.component';

describe('IziComponent', () => {
  let component: IziComponent;
  let fixture: ComponentFixture<IziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
