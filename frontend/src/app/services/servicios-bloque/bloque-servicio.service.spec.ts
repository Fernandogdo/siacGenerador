import { TestBed } from '@angular/core/testing';

import { BloqueServicioService } from './bloque-servicio.service';

describe('BloqueServicioService', () => {
  let service: BloqueServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloqueServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
