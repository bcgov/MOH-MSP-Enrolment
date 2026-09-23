import { Injectable } from '@angular/core';
import { AbstractHttpService } from 'moh-common-lib-angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MspLogService } from './log.service';
import { throwError, of, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { retry, filter, map, catchError } from 'rxjs/operators';
import { ISpaEnvResponse } from '../components/msp/model/spa-env-response.interface';

/**
 * The consent modal's underlying process, used to pick which maintenance
 * flags/messages in the spa-env response apply. Mirrors the legacy
 * `ConsentModalComponent._applicationHeaderMap` from moh-common-lib.
 */
export type SpaEnvProcessName = 'ACL' | 'MSP' | 'PA' | 'SUPPBEN';

export interface IMaintenanceCheck {
  isUnderMaintenance: boolean;
  message: string;
  response: ISpaEnvResponse;
}

const applicationHeaderMap: Record<SpaEnvProcessName, string> = {
  ACL: '{"SPA_ENV_ACL_MAINTENANCE_FLAG":"","SPA_ENV_ACL_MAINTENANCE_MESSAGE":""}',
  MSP: '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}',
  PA: '{"SPA_ENV_PACUTOFF_MAINTENANCE_START":"","SPA_ENV_PACUTOFF_MAINTENANCE_END":"","SPA_ENV_NOW":"","SPA_ENV_PACUTOFF_MAINTENANCE_FLAG":"","SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE":""}',
  SUPPBEN: '{"SPA_ENV_SUPPBEN_MAINTENANCE_START":"","SPA_ENV_SUPPBEN_MAINTENANCE_END":"","SPA_ENV_NOW":"","SPA_ENV_SUPPBEN_MAINTENANCE_FLAG":"","SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE":"","SPA_ENV_PACUTOFF_MAINTENANCE_START":"","SPA_ENV_PACUTOFF_MAINTENANCE_END":""}',
};

/**
 * The list of all server envs we expect back from the spa-env-server. By adding
 * a value here it'll both be retrieved from the server, and the type/interface
 * will be updated.
 */
const serverEnvs = {
  SPA_ENV_ENABLE_ADDRESS_VALIDATOR: '',
};

// Used in HTTP request
const stringifiedEnvs = JSON.stringify(serverEnvs);

/**
 * All the serverEnvs, provided as an object, converted to a type which we can
 * use as an interface or for responses.  By doing it this way, we can
 * accomplish **both** of the following without duplication:
 *
 * 1. Automatically added to the HTTP request
 * 2. Added to the type/interface
 *
 * Thus, we're updating types and modifying runtime behaviour in one stroke.
 */
export type SpaEnvResponse = typeof serverEnvs;


/**
 * Responsible for retrieving values from the spa-env-server on OpenShift.
 *
 * Subscribe to SpaEnvService.values() to get the env values.
 */
@Injectable({
  providedIn: 'root'
})
export class SpaEnvService extends AbstractHttpService {

  protected _headers: HttpHeaders = new HttpHeaders({
    SPA_ENV_NAME: stringifiedEnvs,
  });

  public _values = new BehaviorSubject<SpaEnvResponse>( null );
  /** The values retrieved from the SpaEnv server. */
  public values: Observable<SpaEnvResponse> = this._values.asObservable()
    .pipe(filter(x => !!x)); // filter null response out, init value

  constructor(protected http: HttpClient, private logService: MspLogService) {
    super(http);
  }

  public getValues(): SpaEnvResponse {
    return this._values.getValue();
  }

  public loadEnvs(){
    const url = environment.appConstants.envServerBaseUrl;

    // When the SpaEnv server is being deployed it can return an HTML error
    // page, and it should resolve shortly, so we try again.
    return this.post<SpaEnvResponse>(url, null).pipe(retry(3));
  }

  /**
   * Fetches the spa-env maintenance window for the given process and reports
   * whether it's currently under maintenance. Replaces the SPA-env fetch that
   * used to live inside moh-common-lib's ConsentModalComponent - the library's
   * ConsentModalComponent is now presentational and expects the caller to
   * supply `isUnderMaintenance` directly.
   */
  public checkMaintenance(processName: SpaEnvProcessName): Observable<IMaintenanceCheck> {
    const url = environment.appConstants.envServerBaseUrl;

    // Swap in the process-specific header just long enough to build the
    // request, then restore it - _headers is a field on this root singleton,
    // shared with loadEnvs(), and http.post() already captures the headers
    // it needs synchronously below.
    const savedHeaders = this._headers;
    this._headers = new HttpHeaders({ SPA_ENV_NAME: applicationHeaderMap[processName] });
    const request = this.post<ISpaEnvResponse>(url, null);
    this._headers = savedHeaders;

    return request.pipe(
      map(response => {
        let isUnderMaintenance = false;
        let message = '';

        if (response.SPA_ENV_ACL_MAINTENANCE_FLAG === 'true') {
          isUnderMaintenance = true;
          message = response.SPA_ENV_ACL_MAINTENANCE_MESSAGE;
        } else if (response.SPA_ENV_MSP_MAINTENANCE_FLAG === 'true') {
          isUnderMaintenance = true;
          message = response.SPA_ENV_MSP_MAINTENANCE_MESSAGE;
        } else if (response.SPA_ENV_PACUTOFF_MAINTENANCE_FLAG === 'true') {
          isUnderMaintenance = true;
          message = response.SPA_ENV_PACUTOFF_MAINTENANCE_MESSAGE;
        } else if (response.SPA_ENV_SUPPBEN_MAINTENANCE_FLAG === 'true') {
          isUnderMaintenance = true;
          message = response.SPA_ENV_SUPPBEN_MAINTENANCE_MESSAGE;
        }

        return { isUnderMaintenance, message, response };
      }),
      // The spa-env server can return an HTML error page mid-deploy (see
      // loadEnvs() above). The legacy consent modal could not error - it
      // resolved failures as a next notification - so terminate the error
      // here rather than letting the inherited handleError() throwError
      // reach RxJS as an unhandled error.
      catchError(() => of({ isUnderMaintenance: false, message: '', response: null }))
    );
  }

  protected handleError(error: HttpErrorResponse) {
    console.log( 'Error handleError: ', error );

    if (error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('An error occured: ', error.error.message);
    }
    else {
      // The backend returned an unsuccessful response code
      console.error(`Backend returned error code: ${error.status}.  Error body: ${error.error}`);
    }

    this.logService.log(error, 'Error');

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return throwError('Something went wrong with the network request.');
  }

}
