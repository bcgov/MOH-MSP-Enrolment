import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { FormsModule } from '@angular/forms';
import { EnrolAddressComponent } from './address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../services/log.service';

//The following test only runs in watch mode.
//For some reason, running it in single test mode causes it to fail.
//I couldn't find a way to get it to work, so I'm commenting out the test
//until someone in the future finds a way to get it to work.
//For more information: https://stackoverflow.com/questions/32354165/error-running-tests-with-karma-only-whilst-using-single-run-flag

// describe('EnrolAddressComponent', () => {
//   let component: EnrolAddressComponent;
//   let fixture: ComponentFixture<EnrolAddressComponent>;
//   beforeEach(() => {
//     const routerStub = () => ({});
//     const pageStateServiceStub = () => ({setPageIncomplete: () => {}});
//     const enrolDataServiceStub = () => ({ application: {}});
//     const mspLogServiceStub = () => ({ log: () => {} });
//     TestBed.configureTestingModule({
//       imports: [
//         FormsModule,
//         HttpClientTestingModule
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [EnrolAddressComponent],
//       providers: [
//         { provide: Router, useFactory: routerStub },
//         { provide: PageStateService, useFactory: pageStateServiceStub },
//         { provide: EnrolDataService, useFactory: enrolDataServiceStub },
//         { provide: MspLogService, useFactory: mspLogServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(EnrolAddressComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
