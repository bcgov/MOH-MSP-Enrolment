import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MspApiEnrolmentService } from './msp-api-enrolment.service';
import { MspLogService } from '../../../services/log.service';
import { MspDataService } from '../../../services/msp-data.service';

describe('MspApiEnrolmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      MspLogService,
      MspDataService
    ]
  }));

  it('should be created', () => {
    const service: MspApiEnrolmentService = TestBed.inject(MspApiEnrolmentService);
    expect(service).toBeTruthy();
  });
});
