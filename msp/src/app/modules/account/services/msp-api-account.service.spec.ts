import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MspApiBenefitService } from '../../benefit/services/msp-api-benefit.service';
import { MspLogService } from '../../../services/log.service';
import { MspDataService } from '../../../services/msp-data.service';
import { SchemaService } from '../../../services/schema.service';
import { MspApiAccountService } from './msp-api-account.service';
import { MspAccountApp } from '../models/account.model';

describe('MspApiBenefitService', () => {
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
    const service: MspApiBenefitService = TestBed.inject(MspApiBenefitService);
    expect(service).toBeTruthy();
  });
});

describe('MspApiAccountService telephone', () => {
  let service: MspApiAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MspApiAccountService,
        { provide: MspLogService, useValue: { log: () => ({}) } },
        { provide: SchemaService, useValue: { validate: () => ({}) } }
      ]
    });
    service = TestBed.inject(MspApiAccountService);
  });

  function telephoneFor(phone: string): string {
    const app = new MspAccountApp();
    app.phoneNumber = phone;
    return service.convertMspAccountApp(app).accountHolder.telephone;
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
