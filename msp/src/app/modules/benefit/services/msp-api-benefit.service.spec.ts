import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../services/log.service';
import { SchemaService } from 'app/services/schema.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from './msp-benefit-data.service';
import { MspApiBenefitService } from './msp-api-benefit.service';
import { BenefitApplication } from '../models/benefit-application.model';

describe('MspApiBenefitService', () => {
  let service: MspApiBenefitService;
  beforeEach(() => {
    const mspLogServiceStub = () => ({ log: () => ({}) });
    const schemaServiceStub = () => ({
      validate: () => ({ then: () => ({}) })
    });
    const routerStub = () => ({ navigate: () => ({}) });
    const mspBenefitDataServiceStub = () => ({
      getMspProcess: () => ({ processSteps: { route: {} } })
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MspApiBenefitService,
        { provide: MspLogService, useFactory: mspLogServiceStub },
        { provide: SchemaService, useFactory: schemaServiceStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ]
    });
    service = TestBed.inject(MspApiBenefitService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it(`should have default date format value`, () => {
    expect(service.ISO8601DateFormat).toEqual(`yyyy-MM-dd`);
  });

  it(`should have default AttachmentDocumentType value`, () => {
    expect(MspApiBenefitService.AttachmentDocumentType).toEqual(`SupportDocument`);
  });

  it(`should have default ApplicationType value`, () => {
    expect(MspApiBenefitService.ApplicationType).toEqual(`benefitApplication`);
  });

  describe('telephone', () => {
    function telephoneFor(phone: string): string {
      const app = new BenefitApplication();
      app.phoneNumber = phone;
      app.authorizedByApplicantDate = new Date(2024, 0, 15);
      return (service as any).convertBenefitApplication(app).applicantTelephone;
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
