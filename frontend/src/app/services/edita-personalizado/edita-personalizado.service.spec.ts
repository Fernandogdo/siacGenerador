import { TestBed } from '@angular/core/testing';

import { EditaPersonalizadoService } from './edita-personalizado.service';

describe('EditaPersonalizadoService', () => {
  let service: EditaPersonalizadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditaPersonalizadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
