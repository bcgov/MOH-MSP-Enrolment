import {
  TestBed,
  getTestBed,
  waitForAsync,
} from '@angular/core/testing';
import {MspMaintenanceService} from './msp-maintenance.service';
import {MspLog2Service} from './log2.service';
import {MspDataService} from './msp-data.service';
import { LocalStorageService } from './local-storage.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnrolDataService } from '../modules/enrolment/services/enrol-data.service';

describe('MspLog2Service', () => {
    let injector: TestBed;
    let service: MspLog2Service;
    let httpMock: HttpTestingController;
    const enrolDataServiceStub = () => ({
        application: {
            referenceNumber: '123'
        }
    });

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            HttpClientModule,
            RouterTestingModule,
            FormsModule,
],
        providers: [
            LocalStorageService,
            MspLog2Service,
            MspDataService,
            MspMaintenanceService,
            { provide: EnrolDataService, useFactory: enrolDataServiceStub }
        ]
      });
      injector = getTestBed();
      const testbed = getTestBed();
      service = testbed.get(MspLog2Service);
      httpMock = injector.get(HttpTestingController);

    }));

    it('Calling the MSPLog2 Service API', () => {

        const mockResponse = { message: Object({ event: 'submission', dateObj: new Date() }) };

        service.log({
            event: 'submission',
            dateObj: new Date()
        });

        const req = httpMock.expectOne(environment.appConstants.logBaseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockResponse);
        expect(req.request.url ).toBe(environment.appConstants.logBaseUrl);

        req.flush(mockResponse);
      });
  });


