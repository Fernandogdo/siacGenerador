import { TestBed } from '@angular/core/testing';

import { CreaPdfService } from './crea-pdf.service';

describe('CreaPdfService', () => {
  let service: CreaPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
