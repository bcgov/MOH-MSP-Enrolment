import { TestBed } from '@angular/core/testing';
import { MspAccountMaintenanceDataService } from './msp-account-data.service';

describe('MspBenefitDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
    ],
    providers: [ MspAccountMaintenanceDataService ]
  }));

  it('should be created', () => {
    const service: MspAccountMaintenanceDataService = TestBed.inject(MspAccountMaintenanceDataService);
    expect(service).toBeTruthy();
  });
});
