import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementMarchandComponent } from './paiement-marchand.component';

describe('PaiementMarchandComponent', () => {
  let component: PaiementMarchandComponent;
  let fixture: ComponentFixture<PaiementMarchandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementMarchandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementMarchandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
