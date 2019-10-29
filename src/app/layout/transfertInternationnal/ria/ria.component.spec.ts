import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiaComponent } from './ria.component';

describe('RiaComponent', () => {
  let component: RiaComponent;
  let fixture: ComponentFixture<RiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
