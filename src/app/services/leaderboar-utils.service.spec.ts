import { TestBed } from '@angular/core/testing';

import { LeaderboarUtilsService } from './leaderboar-utils.service';

describe('LeaderboarUtilsService', () => {
  let service: LeaderboarUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderboarUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
