import { TestBed } from '@angular/core/testing';

import { CreaBibtexService } from './crea-bibtex.service';

describe('CreaBibtexService', () => {
  let service: CreaBibtexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaBibtexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
