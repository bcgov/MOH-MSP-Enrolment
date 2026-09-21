import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AclApiService } from './acl-api.service';

describe('AclApiService', () => {
  let service: AclApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AclApiService]
    });
    service = TestBed.inject(AclApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
