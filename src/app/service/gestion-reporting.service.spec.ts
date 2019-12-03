import { TestBed } from '@angular/core/testing';

import { GestionReportingService } from './gestion-reporting.service';

describe('GestionReportingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionReportingService = TestBed.get(GestionReportingService);
    expect(service).toBeTruthy();
  });
});
