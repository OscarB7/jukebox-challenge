import { TestBed } from '@angular/core/testing';

import { FavsongsService } from './favsongs.service';

describe('FavsongsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavsongsService = TestBed.get(FavsongsService);
    expect(service).toBeTruthy();
  });
});
