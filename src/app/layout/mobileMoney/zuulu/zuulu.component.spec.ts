import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuuluComponent } from './zuulu.component';

describe('ZuuluComponent', () => {
  let component: ZuuluComponent;
  let fixture: ComponentFixture<ZuuluComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZuuluComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZuuluComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
