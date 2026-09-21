import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MspApiBenefitService } from '../../benefit/services/msp-api-benefit.service';
import { MspLogService } from '../../../services/log.service';
import { MspDataService } from '../../../services/msp-data.service';

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
