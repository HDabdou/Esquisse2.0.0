import { TestBed } from '@angular/core/testing';

import { WizallService } from './wizall.service';

describe('WizallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WizallService = TestBed.get(WizallService);
    expect(service).toBeTruthy();
  });
});
