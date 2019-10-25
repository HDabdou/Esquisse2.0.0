import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementBancaireComponent } from './virement-bancaire.component';

describe('VirementBancaireComponent', () => {
  let component: VirementBancaireComponent;
  let fixture: ComponentFixture<VirementBancaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirementBancaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirementBancaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
