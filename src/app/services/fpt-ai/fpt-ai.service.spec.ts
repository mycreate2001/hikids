import { TestBed } from '@angular/core/testing';

import { FptAiService } from './fpt-ai.service';

describe('FptAiService', () => {
  let service: FptAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FptAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
