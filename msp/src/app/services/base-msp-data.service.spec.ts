import { TestBed } from '@angular/core/testing';
import { BaseMspDataService } from './base-msp-data.service';

describe('BaseMspDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
]
  }));

  it('should be created', () => {
    const service: BaseMspDataService = TestBed.inject(BaseMspDataService);
    expect(service).toBeTruthy();
  });
});
