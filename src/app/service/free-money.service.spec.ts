import { TestBed } from '@angular/core/testing';

import { FreeMoneyService } from './free-money.service';

describe('FreeMoneyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreeMoneyService = TestBed.get(FreeMoneyService);
    expect(service).toBeTruthy();
  });
});
