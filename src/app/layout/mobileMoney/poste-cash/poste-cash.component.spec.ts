import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosteCashComponent } from './poste-cash.component';

describe('PosteCashComponent', () => {
  let component: PosteCashComponent;
  let fixture: ComponentFixture<PosteCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosteCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosteCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
