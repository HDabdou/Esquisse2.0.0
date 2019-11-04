import { TestBed } from '@angular/core/testing';

import { OrangeMoneyService } from './orange-money.service';

describe('OrangeMoneyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrangeMoneyService = TestBed.get(OrangeMoneyService);
    expect(service).toBeTruthy();
  });
});
