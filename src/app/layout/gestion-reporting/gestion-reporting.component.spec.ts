import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReportingComponent } from './gestion-reporting.component';

describe('GestionReportingComponent', () => {
  let component: GestionReportingComponent;
  let fixture: ComponentFixture<GestionReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
