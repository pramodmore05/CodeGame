import { TestBed, inject } from '@angular/core/testing';

import { MergepdfService } from './mergepdf.service';

describe('MergepdfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MergepdfService]
    });
  });

  it('should be created', inject([MergepdfService], (service: MergepdfService) => {
    expect(service).toBeTruthy();
  }));
});
