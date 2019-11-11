import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YakalmaComponent } from './yakalma.component';

describe('YakalmaComponent', () => {
  let component: YakalmaComponent;
  let fixture: ComponentFixture<YakalmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YakalmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YakalmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
