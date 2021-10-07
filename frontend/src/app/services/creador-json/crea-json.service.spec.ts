import { TestBed } from '@angular/core/testing';

import { CreaJsonService } from './crea-json.service';

describe('CreaJsonService', () => {
  let service: CreaJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
