import { TestBed } from '@angular/core/testing';
import { GuardEnrolService } from './guard-enrol.service';

describe('GuardEnrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
]
  }));

  it('should be created', () => {
    const service: GuardEnrolService = TestBed.inject(GuardEnrolService);
    expect(service).toBeTruthy();
  });
});
