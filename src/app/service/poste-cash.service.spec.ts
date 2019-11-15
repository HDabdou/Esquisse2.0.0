import { TestBed } from '@angular/core/testing';

import { PosteCashService } from './poste-cash.service';

describe('PosteCashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PosteCashService = TestBed.get(PosteCashService);
    expect(service).toBeTruthy();
  });
});
