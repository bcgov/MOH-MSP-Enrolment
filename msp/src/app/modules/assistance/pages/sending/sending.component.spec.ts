import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceSendingComponent } from './sending.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspApiService } from '../../../../services/msp-api.service';
import { HttpClientModule } from '@angular/common/http';
import { MspLogService } from '../../../../services/log.service';
import { TransmissionErrorViewComponent } from '../../../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { ProcessService } from '../../../../services/process.service';
import { MspMaintenanceService } from '../../../../services/msp-maintenance.service';
import { MspLog2Service } from '../../../../services/log2.service';

describe('AssistanceSendingComponent', () => {
  const mspLog2ServiceStub = () => ({
    _headers: {},
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceSendingComponent, TransmissionErrorViewComponent],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
      ],
      providers: [
        MspDataService,
        MspApiService,
        ProcessService,
        MspLogService,
        MspMaintenanceService,
        { provide: MspLog2Service, useFactory: mspLog2ServiceStub },
      ],
    });
  });
  it('should work', () => {
    const fixture = TestBed.createComponent(AssistanceSendingComponent);
    expect(
      fixture.componentInstance instanceof AssistanceSendingComponent
    ).toBe(true, 'should create AssistanceSendingComponent');
  });
});
