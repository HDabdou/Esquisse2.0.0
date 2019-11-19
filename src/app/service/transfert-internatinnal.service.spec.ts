import { TestBed } from '@angular/core/testing';

import { TransfertInternatinnalService } from './transfert-internatinnal.service';

describe('TransfertInternatinnalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransfertInternatinnalService = TestBed.get(TransfertInternatinnalService);
    expect(service).toBeTruthy();
  });
});
