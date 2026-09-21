import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsentModalComponent, PageStateService } from 'moh-common-lib-angular';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { HeaderService } from '../../../../services/header.service';
import { MspApiAccountService } from '../../services/msp-api-account.service';
import { MspLogService } from '../../../../services/log.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { ApiResponse } from 'app/models/api-response.interface';
import { environment } from 'environments/environment';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const pageStateServiceStub = () => ({ setPageComplete: () => ({}) });
    const mspAccountMaintenanceDataServiceStub = () => ({
      getMspAccountApp: () => ({}),
      saveMspAccountApp: () => ({}),
    });
    const headerServiceStub = () => ({ setTitle: () => ({}) });
    const mspApiAccountServiceStub = () => ({
      sendChangeAddressApplication: (): Promise<ApiResponse> => {
        return new Promise((res) => {
          return res({
            op_return_code: 'SUCCESS',
            op_technical_error: '',
            dbErrorMessage: '',
            op_reference_number: '',
            req_num: '',
          });
        });
      },
    });
    const mspLogServiceStub = () => ({ log: () => ({}) });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub,
        },
        { provide: HeaderService, useFactory: headerServiceStub },
        { provide: MspApiAccountService, useFactory: mspApiAccountServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub },
      ],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('continue', () => {
    it('should call sendChangeAddressApplication when addressAppSent is false', () => {
      const mspApiAccountServiceStub: MspApiAccountService =
        fixture.debugElement.injector.get(MspApiAccountService);
      spyOn(
        mspApiAccountServiceStub,
        'sendChangeAddressApplication'
      ).and.callThrough();
      component.continue();
      expect(
        mspApiAccountServiceStub.sendChangeAddressApplication
      ).toHaveBeenCalled();
    });

    it('should not call sendChangeAddressApplication when addressAppSent is true', () => {
      const mspApiAccountServiceStub: MspApiAccountService =
        fixture.debugElement.injector.get(MspApiAccountService);
      spyOn(
        mspApiAccountServiceStub,
        'sendChangeAddressApplication'
      ).and.callThrough();
      component.addressAppSent = true;
      component.continue();
      expect(
        mspApiAccountServiceStub.sendChangeAddressApplication
      ).not.toHaveBeenCalled();
    });
  });
});

describe('HomeComponent maintenance message', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const pageStateServiceStub = () => ({ setPageComplete: () => ({}) });
    const mspAccountMaintenanceDataServiceStub = () => ({
      // Skip ngAfterViewInit's showFullSizeView() call, which isn't this test's concern.
      getMspAccountApp: () => ({ infoCollectionAgreement: true }),
      saveMspAccountApp: () => ({}),
    });
    const headerServiceStub = () => ({ setTitle: () => ({}) });
    const mspApiAccountServiceStub = () => ({});
    const mspLogServiceStub = () => ({ log: () => ({}) });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ConsentModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub,
        },
        { provide: HeaderService, useFactory: headerServiceStub },
        { provide: MspApiAccountService, useFactory: mspApiAccountServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub },
      ],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders the maintenance message inside the consent modal when the ACL maintenance flag is set', () => {
    fixture.detectChanges(); // ngOnInit -> checkMaintenance('ACL')

    httpMock.expectOne(environment.appConstants.envServerBaseUrl).flush({
      SPA_ENV_ACL_MAINTENANCE_FLAG: 'true',
      SPA_ENV_ACL_MAINTENANCE_MESSAGE: 'Account services are down for maintenance.',
      SPA_ENV_MSP_MAINTENANCE_FLAG: 'false',
      SPA_ENV_MSP_MAINTENANCE_MESSAGE: '',
      SPA_ENV_PACUTOFF_MAINTENANCE_START: '',
      SPA_ENV_NOW: '',
      SPA_ENV_PACUTOFF_MAINTENANCE_END: '',
    });

    fixture.detectChanges();

    expect(component.maintenanceMessage).toBe('Account services are down for maintenance.');
    expect(fixture.nativeElement.textContent).toContain('Account services are down for maintenance.');
  });
});
