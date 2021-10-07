import { TestBed } from '@angular/core/testing';

import { CreaTxtService } from './crea-txt.service';

describe('CreaTxtService', () => {
  let service: CreaTxtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaTxtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
