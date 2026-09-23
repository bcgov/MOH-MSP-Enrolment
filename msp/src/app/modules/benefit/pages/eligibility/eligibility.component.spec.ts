import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ConsentModalComponent } from 'moh-common-lib-angular';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { Router } from '@angular/router';
import { EligibilityComponent } from './eligibility.component';
import { MspLogService } from '../../../../services/log.service';
import { environment } from 'environments/environment';

describe('EligibilityComponent', () => {
  let component: EligibilityComponent;
  let fixture: ComponentFixture<EligibilityComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { infoCollectionAgreement: {}, isEligible: {} }
    });
    const routerStub = () => ({ navigate: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule],
      declarations: [EligibilityComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        },
        { provide: Router, useFactory: routerStub },
        { provide: MspLogService, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(EligibilityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigate', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.navigate();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});

describe('EligibilityComponent maintenance message', () => {
  let component: EligibilityComponent;
  let fixture: ComponentFixture<EligibilityComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      // infoCollectionAgreement: true skips ngAfterViewInit's showFullSizeView() call.
      benefitApp: { infoCollectionAgreement: true, isEligible: {} }
    });
    const routerStub = () => ({ navigate: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, ConsentModalComponent],
      declarations: [EligibilityComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: MspBenefitDataService, useFactory: mspBenefitDataServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: MspLogService, useValue: { log: () => ({}) } }
      ]
    });
    fixture = TestBed.createComponent(EligibilityComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders the maintenance message inside the consent modal when the SUPPBEN maintenance flag is set', () => {
    fixture.detectChanges(); // ngOnInit -> checkMaintenance('SUPPBEN')

    httpMock.expectOne(environment.appConstants.envServerBaseUrl).flush({
      SPA_ENV_MSP_MAINTENANCE_FLAG: 'false',
      SPA_ENV_MSP_MAINTENANCE_MESSAGE: '',
      SPA_ENV_ACL_MAINTENANCE_FLAG: 'false',
      SPA_ENV_ACL_MAINTENANCE_MESSAGE: '',
      SPA_ENV_PACUTOFF_MAINTENANCE_START: '',
      SPA_ENV_NOW: '',
      SPA_ENV_PACUTOFF_MAINTENANCE_END: '',
      SPA_ENV_SUPPBEN_MAINTENANCE_FLAG: 'true',
      SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE: 'Supplementary Benefits is down for maintenance.',
    });

    fixture.detectChanges();

    expect(component.maintenanceMessage).toBe('Supplementary Benefits is down for maintenance.');
    expect(fixture.nativeElement.textContent).toContain('Supplementary Benefits is down for maintenance.');
  });
});
