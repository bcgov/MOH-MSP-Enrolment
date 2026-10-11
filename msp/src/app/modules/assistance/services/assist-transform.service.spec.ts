import { TestBed } from '@angular/core/testing';
import { AssistTransformService } from './assist-transform.service';
import { MspDataService } from '../../../services/msp-data.service';

describe('AssistTransformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
],
    providers: [
      MspDataService
    ]
  }));

  it('should be created', () => {
    const service: AssistTransformService = TestBed.inject(AssistTransformService);
    expect(service).toBeTruthy();
  });

  describe('telephone', () => {
    function telephoneFor(phone: string): string {
      const app = TestBed.inject(MspDataService).finAssistApp;
      app.phoneNumber = phone;
      app.applicant.previous_phn = '';
      app.applicant.sin = '';
      app.applicant.dob = new Date(1980, 0, 15);
      return TestBed.inject(AssistTransformService).assistanceApplicant.telephone;
    }

    it('sends all 10 digits for the stored model value', () => {
      expect(telephoneFor('2143234323')).toBe('2143234323');
    });

    it('sends all 10 digits for a value saved in display format', () => {
      expect(telephoneFor('+1 (214) 323-4323')).toBe('2143234323');
    });

    it('is undefined, not an empty string, when the phone is empty', () => {
      expect(telephoneFor('')).toBeUndefined();
    });
  });
});
