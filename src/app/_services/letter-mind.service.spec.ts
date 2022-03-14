import { TestBed } from '@angular/core/testing';

import { LetterMindService } from './letter-mind.service';

describe('LetterMindService', () => {
  let service: LetterMindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetterMindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
