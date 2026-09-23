import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ProcessService } from '../../../../services/process.service';
import { ContainerService } from 'moh-common-lib-angular';
import { PageStateService } from 'moh-common-lib-angular';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspLogService } from '../../../../services/log.service';
import { AuthorizeComponent } from './authorize.component';
import { FormsModule } from '@angular/forms';

describe('Account AuthorizeComponent', () => {
  let component: AuthorizeComponent;
  let fixture: ComponentFixture<AuthorizeComponent>;

  beforeEach(() => {
    const routerStub = () => ({});
    const processServiceStub = () => ({
      setStep: () => ({})
    });
    // BaseForm.ngAfterViewInit subscribes to $continueBtn, which runs as soon
    // as anything renders this component.
    const containerServiceStub = () => ({ $continueBtn: new Subject<void>() });
    const pageStateServiceStub = () => ({ setPageIncomplete: () => ({}) });
    const mspAccountMaintenanceDataServiceStub = () => ({
      getMspAccountApp: () => ({}),
      saveMspAccountApp: () => ({})
    });
    const mspLogServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AuthorizeComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ProcessService, useFactory: processServiceStub },
        { provide: ContainerService, useFactory: containerServiceStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub
        },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AuthorizeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // continue() refuses unless authorizedByApplicant is set, so the action bar
  // has to agree with it. It used to also enable on a spouse change, which no
  // screen can satisfy - nothing in the app sets authorizedBySpouse - so the
  // button offered itself and then rejected the click.
  describe('submit enablement', () => {
    function canContinue(): boolean {
      // The data-service stub returns a bare object, and the template reads
      // applicant.firstName through the questionApplicant getter.
      component.mspAccountApp.applicant = {
        firstName: 'Test',
        lastName: 'Applicant',
      } as never;
      fixture.detectChanges();
      return fixture.debugElement.query(By.css('common-form-action-bar'))
        .properties['canContinue'];
    }

    // The default model eagerly constructs addedSpouse/updatedSpouse
    // (account.model.ts:224-225), so the old expression's
    // "(updatedSpouse || addedSpouse) && !authorizedBySpouse" arm was truthy
    // from page load for every applicant, enabling Submit before anything was
    // authorized.
    it('stays disabled while the applicant has not authorized', () => {
      component.mspAccountApp.authorizedByApplicant = false;

      expect(canContinue()).toBe(false);
    });

    it('enables once the applicant authorizes', () => {
      component.mspAccountApp.authorizedByApplicant = true;

      expect(canContinue()).toBe(true);
    });
  });
});
