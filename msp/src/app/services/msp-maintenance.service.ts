import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ISpaEnvResponse } from '../components/msp/model/spa-env-response.interface';
import { MspLog2Service } from './log2.service';
import moment from 'moment';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AbstractHttpService } from 'moh-common-lib-angular';

/**
 * Responsible for retrieving values from the spa-env-server on OpenShift.
 *
 * Subscribe to SpaEnvService.values() to get the env values.
 */
@Injectable({
  providedIn: 'root'
})

export class  MspMaintenanceService extends AbstractHttpService {

    constructor(protected http: HttpClient, private logService: MspLog2Service) {
        super(http);
    }

    checkMaintenance(): Observable<ISpaEnvResponse> {
        const url = environment.appConstants['envServerBaseUrl'];
        return this.post<ISpaEnvResponse>(url, null);
    }

    protected handleError(error: HttpErrorResponse): Observable<unknown> {
        if (error.error instanceof ErrorEvent) {
            //Client-side / network error occurred
            console.error('MspMaintenanceService error: ', error.error.message);
        } else {
            // The backend returned an unsuccessful response code
            console.error(`MspMaintenanceService Backend returned error code: ${error.status}.  Error body: ${error.error}`);
        }
        this.logService.log(
            {
                event: 'error',
                key: 'MspMaintenanceService - Cannot get maintenance flag from spa-env-server'
            }
        );

        // Fail open: callers read maintenance flags off this object, and an
        // absent flag means "not under maintenance". Returning an empty
        // response keeps that read safe without pretending the call succeeded
        // with data. Previously this returned an empty array, which callers
        // then read properties off.
        return of({} as ISpaEnvResponse);
    }

    protected _headers: HttpHeaders = new HttpHeaders({
        'SPA_ENV_NAME': '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}',
        'program': 'msp',
        'timestamp' : moment().toISOString(),
        'method': 'checkMaintenance',
        'severity': 'info',
    });
}
