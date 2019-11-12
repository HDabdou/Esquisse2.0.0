import { TestBed } from '@angular/core/testing';

import { TntService } from './tnt.service';

describe('TntService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TntService = TestBed.get(TntService);
    expect(service).toBeTruthy();
  });
});
