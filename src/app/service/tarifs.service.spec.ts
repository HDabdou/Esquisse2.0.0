import { TestBed } from '@angular/core/testing';

import { TarifsService } from './tarifs.service';

describe('TarifsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TarifsService = TestBed.get(TarifsService);
    expect(service).toBeTruthy();
  });
});
