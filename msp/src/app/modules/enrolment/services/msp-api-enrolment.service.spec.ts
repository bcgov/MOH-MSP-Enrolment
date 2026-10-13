import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MspApiEnrolmentService } from './msp-api-enrolment.service';
import { MspLogService } from '../../../services/log.service';
import { MspDataService } from '../../../services/msp-data.service';
import { EnrolApplication } from '../models/enrol-application';

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

  describe('telephone', () => {
    function telephoneFor(phone: string): string {
      const service = TestBed.inject(MspApiEnrolmentService) as any;
      const app = new EnrolApplication();
      app.phoneNumber = phone;
      return service.convertEnrolmentApplicantType(app).telephone;
    }

    it('sends all 10 digits for the stored model value', () => {
      expect(telephoneFor('2143234323')).toBe('2143234323');
    });

    it('sends all 10 digits for a value saved in display format', () => {
      expect(telephoneFor('+1 (214) 323-4323')).toBe('2143234323');
    });

    it('sends no telephone when the phone is empty', () => {
      expect(telephoneFor('')).toBeUndefined();
    });
  });
});
