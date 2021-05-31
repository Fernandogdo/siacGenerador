import { TestBed } from '@angular/core/testing';

import { InfoDocenteService } from './info-docente.service';

describe('InfoDocenteService', () => {
  let service: InfoDocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoDocenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
