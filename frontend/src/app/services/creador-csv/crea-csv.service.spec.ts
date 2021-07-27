import { TestBed } from '@angular/core/testing';

import { CreaCsvService } from './crea-csv.service';

describe('CreaCsvService', () => {
  let service: CreaCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
