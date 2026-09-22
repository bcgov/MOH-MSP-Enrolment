import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { ContainerService } from 'moh-common-lib-angular';
import { PageStateService } from 'moh-common-lib-angular';
import { ProcessService } from '../../../../services/process.service';
import { AccountPersonalInfoComponent } from './personal-info.component';

describe('AccountPersonalInfoComponent', () => {
  let component: AccountPersonalInfoComponent;
  let fixture: ComponentFixture<AccountPersonalInfoComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const mspAccountMaintenanceDataServiceStub = () => ({
      accountApp: {
        accountChangeOptions: {},
        applicant: {},
        isUniquePhnsInPI: {},
      },
      saveMspAccountApp: () => ({}),
      getMspAccountApp: () => ({
        accountChangeOptions: { statusUpdate: {} },
        hasAnyVisitorInApplication: () => false,
      }),
    });

    const containerServiceStub = () => ({});
    const pageStateServiceStub = () => ({});
    const processServiceStub = () => ({
      getStepNumber: () => 3,
      setStep: () => ({}),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AccountPersonalInfoComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub,
        },
        { provide: ContainerService, useFactory: containerServiceStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: ProcessService, useFactory: processServiceStub },
      ],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(AccountPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid status by default', () => {
    expect(component.hasAnyInvalidStatus()).toBe(
      false,
      'should have hasAnyInvalidStatus false on init'
    );
  });
});

// AbstractForm's formRef query is not static, so on the first pass
// canContinue() (bound to [canContinue]="canContinue()" in the template)
// reads this.form as undefined and returns false. On a brand-new
// application applicant.updatingPersonalInfo is also undefined, so
// canContinue() short-circuits to false on both the first pass and the
// checkNoChanges pass that immediately follows it, and the flip never
// shows up. A return visit - e.g. the Review page's Edit link - re-renders
// this component with updatingPersonalInfo already answered, which removes
// that short-circuit and reproduces the same false-then-true flip that
// broke child-info and review: this regressed when the local static query
// was deleted as "redundant" with AbstractForm's non-static one.
describe('AccountPersonalInfoComponent on a return visit', () => {
  let fixture: ComponentFixture<AccountPersonalInfoComponent>;

  beforeEach(() => {
    const routerStub = () => ({});
    const mspAccountMaintenanceDataServiceStub = () => ({
      accountApp: {
        accountChangeOptions: {},
        applicant: { updatingPersonalInfo: false },
        isUniquePhnsInPI: {},
      },
      saveMspAccountApp: () => ({}),
      getMspAccountApp: () => ({
        accountChangeOptions: { statusUpdate: {} },
        hasAnyVisitorInApplication: () => false,
      }),
    });

    const containerServiceStub = () => ({});
    const pageStateServiceStub = () => ({});
    const processServiceStub = () => ({
      getStepNumber: () => 3,
      setStep: () => ({}),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AccountPersonalInfoComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub,
        },
        { provide: ContainerService, useFactory: containerServiceStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: ProcessService, useFactory: processServiceStub },
      ],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(AccountPersonalInfoComponent);
  });

  it('does not throw NG0100 on first render', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
