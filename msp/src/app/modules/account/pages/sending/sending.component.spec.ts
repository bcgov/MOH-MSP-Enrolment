import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PageFrameworkComponent } from 'moh-common-lib-angular';
import { AccountSendingComponent } from './sending.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspApiService } from '../../../../services/msp-api.service';
import { ProcessService } from '../../../../services/process.service';
import { HttpClientModule } from '@angular/common/http';
import { MspLogService } from '../../../../services/log.service';
import { MspMaintenanceService } from '../../../../services/msp-maintenance.service';
import { TransmissionErrorViewComponent } from '../../../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

describe('SendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountSendingComponent,
        TransmissionErrorViewComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule, PageFrameworkComponent],
      providers: [
        MspDataService,
        MspApiService,
        ProcessService,
        MspLogService,
        MspMaintenanceService,
        MspAccountMaintenanceDataService
      ]
    });
  });
  it ('should work', () => {
     const fixture = TestBed.createComponent(AccountSendingComponent);
     expect(fixture.componentInstance instanceof AccountSendingComponent).toBe(true, 'should create AccountSendingComponent');

  });
});
