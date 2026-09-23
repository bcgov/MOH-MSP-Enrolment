import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspConsentModalComponent } from './consent-modal.component';
import { MspDataService } from '../../../../services/msp-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MspMaintenanceService} from '../../../../services/msp-maintenance.service';
import {HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {MspLogService} from '../../../../services/log.service';
import { ConsentModalComponent } from 'moh-common-lib-angular';
import { environment } from '../../../../../environments/environment';


describe('MspConsentModalComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspConsentModalComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule,        ModalModule.forRoot(), ConsentModalComponent],
        providers: [MspDataService, MspMaintenanceService, MspLogService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspConsentModalComponent);
    expect(fixture.componentInstance instanceof MspConsentModalComponent).toBe(true, 'should create MspConsentModalComponent');

  });
});

describe('MspConsentModalComponent maintenance message', () => {
  let component: MspConsentModalComponent;
  let fixture: ComponentFixture<MspConsentModalComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspConsentModalComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule, ModalModule.forRoot(), ConsentModalComponent],
      providers: [MspDataService, MspMaintenanceService, MspLogService]
    });
    fixture = TestBed.createComponent(MspConsentModalComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders the maintenance message inside the consent modal when the configured process is under maintenance', () => {
    fixture.detectChanges(); // ngOnInit -> checkMaintenance('MSP'), the @Input() default

    httpMock.expectOne(environment.appConstants.envServerBaseUrl).flush({
      SPA_ENV_MSP_MAINTENANCE_FLAG: 'true',
      SPA_ENV_MSP_MAINTENANCE_MESSAGE: 'MSP enrolment is down for maintenance.',
      SPA_ENV_ACL_MAINTENANCE_FLAG: 'false',
      SPA_ENV_ACL_MAINTENANCE_MESSAGE: '',
      SPA_ENV_PACUTOFF_MAINTENANCE_START: '',
      SPA_ENV_NOW: '',
      SPA_ENV_PACUTOFF_MAINTENANCE_END: '',
    });

    fixture.detectChanges();

    expect(component.maintenanceMessage).toBe('MSP enrolment is down for maintenance.');
    expect(fixture.nativeElement.textContent).toContain('MSP enrolment is down for maintenance.');
  });
});
