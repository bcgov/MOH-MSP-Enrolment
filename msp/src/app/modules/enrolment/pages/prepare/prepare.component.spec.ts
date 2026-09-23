import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { NgForm } from '@angular/forms';
import { PrepareComponent } from './prepare.component';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { ConsentModalComponent } from 'moh-common-lib-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { MspLogService } from '../../../../services/log.service';

describe('PrepareComponent', () => {
  let component: PrepareComponent;
  let fixture: ComponentFixture<PrepareComponent>;
  beforeEach(waitForAsync(() => {
    const routerStub = () => ({});
    const pageStateServiceStub = () => ({ setPageIncomplete: () => undefined });
    const enrolDataServiceStub = () => ({
      application: {},
      saveApplication: () => ({}),
    });
    TestBed.configureTestingModule({
      imports: [ModalModule.forRoot(), HttpClientModule, ConsentModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        PrepareComponent,
        MspConsentModalComponent,
        NgForm,
      ],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub },
        { provide: MspLogService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
