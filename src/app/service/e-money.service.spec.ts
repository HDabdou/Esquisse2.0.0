import { TestBed } from '@angular/core/testing';

import { EMoneyService } from './e-money.service';

describe('EMoneyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EMoneyService = TestBed.get(EMoneyService);
    expect(service).toBeTruthy();
  });
});
