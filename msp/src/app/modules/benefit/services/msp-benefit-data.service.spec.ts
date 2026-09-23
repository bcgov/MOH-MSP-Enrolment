import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../../../services/local-storage.service';
import { BenefitApplication } from '../models/benefit-application.model';
import { BenefitApplicationDto } from '../models/benefit-application.dto';
import { MspBenefitDataService } from './msp-benefit-data.service';
import { MspDataService } from '../../../services/msp-data.service';

describe('MspBenefitDataService', () => {
  let service: MspBenefitDataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MspDataService,
        BenefitApplication,
        BenefitApplicationDto,
      ],
    });

    service = TestBed.inject(MspBenefitDataService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('saveBenefitApplication', () => {
    it('should make expected call', () => {
      const localStorageServiceStub: LocalStorageService =
        TestBed.inject(LocalStorageService);
      spyOn(localStorageServiceStub, 'set').and.callThrough();
      service.saveBenefitApplication();
      expect(localStorageServiceStub.set).toHaveBeenCalled();
    });
  });
});
