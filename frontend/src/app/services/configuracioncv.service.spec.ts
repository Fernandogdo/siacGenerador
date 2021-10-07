import { TestBed } from '@angular/core/testing';

import { ConfiguracioncvService } from './configuracioncv.service';

describe('ConfiguracioncvService', () => {
  let service: ConfiguracioncvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracioncvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
