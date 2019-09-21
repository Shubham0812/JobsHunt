import { TestBed } from '@angular/core/testing';

import { DataFetchService } from './data-fetch.service';

describe('DataFetchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataFetchService = TestBed.get(DataFetchService);
    expect(service).toBeTruthy();
  });
});
