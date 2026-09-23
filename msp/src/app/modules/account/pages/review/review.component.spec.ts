import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcessService } from '../../../../services/process.service';
import { ContainerService, PageStateService } from 'moh-common-lib-angular';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspAccountApp } from '../../models/account.model';
import { AccountReviewComponent } from './review.component';

describe('Account AccountReviewComponent', () => {
  let component: AccountReviewComponent;
  let fixture: ComponentFixture<AccountReviewComponent>;

  beforeEach(() => {
    const routerStub = () => ({ url: '/deam/review' });
    const processServiceStub = () => ({
      setStep: () => ({}),
    });
    // BaseForm.ngAfterViewInit subscribes to $continueBtn, which runs as soon
    // as anything renders this component.
    const containerServiceStub = () => ({ $continueBtn: new Subject<void>() });
    const pageStateServiceStub = () => ({ setPageIncomplete: () => ({}) });
    const mspAccountMaintenanceDataServiceStub = () => ({
      getMspAccountApp: () => new MspAccountApp(),
    });

    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AccountReviewComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ProcessService, useFactory: processServiceStub },
        { provide: ContainerService, useFactory: containerServiceStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub,
        },
      ],
    });
    fixture = TestBed.createComponent(AccountReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // AbstractForm's formRef query is not static, so on the first pass
  // canContinue() (bound to [canContinue]="canContinue()" in the template)
  // reads this.form as undefined and returns false; once ngAfterViewInit
  // resolves the query, the same expression flips to true within the same
  // change-detection round and Angular's checkNoChanges pass (which
  // fixture.detectChanges() runs by default) throws NG0100. This regressed
  // when the local static query was deleted as "redundant" with
  // AbstractForm's non-static one.
  it('does not throw NG0100 on first render', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
