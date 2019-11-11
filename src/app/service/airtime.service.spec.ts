import { TestBed } from '@angular/core/testing';

import { AirtimeService } from './airtime.service';

describe('AirtimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AirtimeService = TestBed.get(AirtimeService);
    expect(service).toBeTruthy();
  });
});
