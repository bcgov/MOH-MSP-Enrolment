import { TestBed } from '@angular/core/testing';
import { EnrolDataService } from './enrol-data.service';

describe('EnrolDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
]
  }));

  it('should be created', () => {
    const service: EnrolDataService = TestBed.inject(EnrolDataService);
    expect(service).toBeTruthy();
  });
});
