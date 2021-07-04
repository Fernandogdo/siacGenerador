import { TestBed } from '@angular/core/testing';

import { CreaDocxService } from './crea-docx.service';

describe('CreaDocxService', () => {
  let service: CreaDocxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaDocxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
