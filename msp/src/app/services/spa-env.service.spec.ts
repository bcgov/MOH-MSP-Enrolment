import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpaEnvService } from './spa-env.service';
import { MspLogService } from './log.service';
import { environment } from 'environments/environment';
import { ISpaEnvResponse } from '../components/msp/model/spa-env-response.interface';

describe('SpaEnvService', () => {
  let service: SpaEnvService;
  let httpMock: HttpTestingController;
  const url = environment.appConstants.envServerBaseUrl;

  const baseResponse: ISpaEnvResponse = {
    SPA_ENV_MSP_MAINTENANCE_FLAG: 'false',
    SPA_ENV_MSP_MAINTENANCE_MESSAGE: '',
    SPA_ENV_ACL_MAINTENANCE_FLAG: 'false',
    SPA_ENV_ACL_MAINTENANCE_MESSAGE: '',
    SPA_ENV_PACUTOFF_MAINTENANCE_START: '',
    SPA_ENV_NOW: '',
    SPA_ENV_PACUTOFF_MAINTENANCE_END: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SpaEnvService,
        { provide: MspLogService, useValue: { log: () => ({}) } }
      ]
    });
    service = TestBed.inject(SpaEnvService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('reports isUnderMaintenance false and no message for a normal response', () => {
    let result: { isUnderMaintenance: boolean; message: string };
    service.checkMaintenance('MSP').subscribe(check => (result = check));

    httpMock.expectOne(url).flush(baseResponse);

    expect(result.isUnderMaintenance).toBe(false);
    expect(result.message).toBe('');
  });

  it('surfaces the maintenance message when the process-specific flag is set', () => {
    let result: { isUnderMaintenance: boolean; message: string };
    service.checkMaintenance('MSP').subscribe(check => (result = check));

    httpMock.expectOne(url).flush({
      ...baseResponse,
      SPA_ENV_MSP_MAINTENANCE_FLAG: 'true',
      SPA_ENV_MSP_MAINTENANCE_MESSAGE: 'MSP is down for maintenance until 5pm.'
    });

    expect(result.isUnderMaintenance).toBe(true);
    expect(result.message).toBe('MSP is down for maintenance until 5pm.');
  });

  it('leaves the modal usable when the request fails, without an error callback (matches real call sites)', () => {
    // home/eligibility/consent-modal all subscribe with only a `next`
    // callback. Under RxJS 7, an observable that errors with no `error`
    // callback attached routes to reportUnhandledError instead of being
    // silently dropped, so this reproduces the actual failure mode.
    let result: { isUnderMaintenance: boolean; message: string };
    service.checkMaintenance('MSP').subscribe(check => (result = check));

    // Simulate the deploy-time failure mode: the spa-env server returns an
    // HTML error page instead of JSON.
    httpMock.expectOne(url).flush('<html>Service Unavailable</html>', { status: 502, statusText: 'Bad Gateway' });

    expect(result.isUnderMaintenance).toBe(false);
    expect(result.message).toBe('');
  });

  it('restores the shared _headers after checkMaintenance, so loadEnvs keeps using its own', () => {
    const headersBefore = (service as unknown as { _headers: unknown })._headers;

    service.checkMaintenance('MSP').subscribe();
    httpMock.expectOne(url).flush(baseResponse);

    expect((service as unknown as { _headers: unknown })._headers).toBe(headersBefore);
  });
});
