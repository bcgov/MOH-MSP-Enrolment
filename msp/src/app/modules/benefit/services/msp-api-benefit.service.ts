import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BenefitApplication } from '../models/benefit-application.model';
import { _ApplicationTypeNameSpace } from '../../msp-core/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import { AbstractHttpService, CommonImage } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { ApiResponse } from '../../../models/api-response.interface';
import { SchemaService } from 'app/services/schema.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from './msp-benefit-data.service';
import {
  SupplementaryBenefitsApplicationType,
  MSPApplicationSchema,
} from 'app/modules/msp-core/interfaces/i-api';
import { FieldPageMap } from '../models/field-page-map';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})

//TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiBenefitService extends AbstractHttpService {
  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'yyyy-MM-dd';
  suppBenefitResponse: ApiResponse;

  constructor(
    protected http: HttpClient,
    private logService: MspLogService,
    private schemaSvc: SchemaService,
    private router: Router,
    private dataSvc: MspBenefitDataService
  ) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: BenefitApplication): Promise<any> {
    const suppBenefitRequest = this.prepareBenefitApplication(app);

    return new Promise<ApiResponse>((resolve, reject) => {
      //Validating the response against the schema
      this.schemaSvc.validate(suppBenefitRequest).then((res) => {
        if (res.errors) {
          let errorField: string;
          let errorMessage: string;

          // Getting the error field
          for (const error of res.errors) {
            errorField = error.dataPath.substr(34);
            errorMessage = error.message;
          }

          // checking the errors and routing to the correct URL
          if (errorField && errorMessage) {
            this.logService.log(
              {
                text:
                  'Supplementary Benefit - API validation against schema failed because of ' +
                  errorField +
                  ' field',
                response: errorMessage,
              },
              'Supplementary Benefit -  API validation against schema failed'
            );

            const mapper = new FieldPageMap();
            const index = mapper.findStep(errorField);
            const urls = this.dataSvc.getMspProcess().processSteps;
            this.router.navigate([urls[index].route]);
            return reject(errorMessage);
          }
        }

        // if no errors, then we'll sendApplication all attachments
        return this.sendAttachments(
          app.authorizationToken,
          app.uuid,
          app.getAllImages()
        )
          .then((attachmentResponse) => {
            // TODO - Likely have to store all the responses for image uploads, so we can use those UUIDs with our application upload
            // unless we can just use our pre-uploaded ones? though that has potential for missing records.
            // once all attachments are done we can sendApplication in the data
            return this.sendApplication(
              suppBenefitRequest,
              app.uuid,
              app.authorizationToken
            ).subscribe((response) => {
              // Add reference number
              if (response && response.referenceNumber) {
                app.referenceNumber = response.referenceNumber.toString();
              }
              // Let our caller know were done passing back the application
              return resolve(response);
            });
          })
          .catch((error: Response | any) => {
            // TODO - Is this error correct? What if sendApplication() errors, would it be caught in this .catch()?
            this.logService.log(
              {
                text: 'Supplementary Benefits - Attachment - Send All Rejected ',
                response: error,
              },
              'Supplementary Benefits - Attachment - Send All Rejected '
            );
            return resolve(error);
          });
      });
    });
  }

  sendApplication(
    app: MSPApplicationSchema,
    uuid: string,
    authToken: string
  ): Observable<any> {
    const url =
      environment.appConstants.apiBaseUrl +
      environment.appConstants.suppBenefitAPIUrl +
      uuid;

    // Setup headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + authToken,
    });
    return this.post<BenefitApplication>(url, app);
  }

  public sendAttachments(
    token: string,
    applicationUUID: string,
    attachments: CommonImage[]
  ): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      // Instantly resolve if no attachments
      if (!attachments || attachments.length < 1) {
        resolve();
      }

      // Make a list of promises for each attachment
      const attachmentPromises = new Array<Promise<string>>();
      for (const attachment of attachments) {
        attachmentPromises.push(
          this.sendAttachment(token, applicationUUID, attachment)
        );
      }

      // Execute all promises are waiting for results
      return Promise.all(attachmentPromises)
        .then(
          (responses: string[]) => {
            this.logService.log(
              {
                text: 'Supplementary Benefits - Send All Attachments - Success',
                response: responses,
              },
              'Send All Attachments - Success'
            );
            return resolve(responses);
          },
          (error: Response | any) => {
            this.logService.log(
              {
                text: 'Supplementary Benefits - Attachments - Send All Error ',
                error: error,
              },
              'Supplementary Benefits Attachments - Send All Error '
            );
            return reject();
          }
        )
        .catch((error: Response | any) => {
          this.logService.log(
            {
              text: 'Supplementary Benefits - Attachments - Send All Error ',
              error: error,
            },
            'Supplementary Benefits - Attachments - Send All Error '
          );
          return error;
        });
    });
  }

  private sendAttachment(
    token: string,
    applicationUUID: string,
    attachment: CommonImage
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      /*
             Create URL
             /{applicationUUID}/attachment/{attachmentUUID}
             */
      let url =
        environment.appConstants['apiBaseUrl'] +
        environment.appConstants['attachment'] +
        applicationUUID +
        '/attachments/' +
        attachment.uuid;

      // programArea
      url += '?programArea=enrolment';

      // attachmentDocumentType - UI does NOT collect this property
      url += '&attachmentDocumentType=' + MspApiService.AttachmentDocumentType;

      // contentType
      url += '&contentType=' + attachment.contentType;

      // imageSize
      url += '&imageSize=' + attachment.size;

      // Necessary to differentiate between PA and SuppBen
      // TODO - VALIDATE THIS VALUE IS CORRECT, NEEDS TO BE CONFIRMED
      url += '&dpackage=supp_benefits_pkg';

      // Setup headers
      const headers = new HttpHeaders({
        'Content-Type': attachment.contentType,
        'Access-Control-Allow-Origin': '*',
        'X-Authorization': 'Bearer ' + token,
      });
      const options = { headers: headers, responseType: 'text' as 'text' };

      const binary = atob(attachment.fileContent.split(',')[1]);
      const array = <any>[];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], {
        type: attachment.contentType,
      });

      return this.http
        .post(url, blob, options)
        .toPromise()
        .then(
          (response) => {
            this.logService.log(
              {
                text: 'Supplementary Benefits - Send Individual Attachment - Success',
                response: response,
              },
              'Supplementary Benefits - Send Individual Attachment - Success'
            );
            return resolve(response);
          },
          (error: Response | any) => {
            this.logService.log(
              {
                text: 'Supplementary Benefits - Attachment - Send Individual Error ',
                response: error,
              },
              'Supplementary Benefits - Attachment - Send Individual Error '
            );
            return reject(error);
          }
        )
        .catch((error: Response | any) => {
          this.logService.log(
            {
              text: 'Supplementary Benefits - Attachment - Send Individual Error ',
              response: error,
            },
            'Supplementary Benefits - Attachment - Send Individual Error '
          );

          reject(error);
        });
    });
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //Client-side / network error occurred
      console.error('MSP Supp Benefit API error: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Msp Supp Benefit Backend returned error code: ${error.status}.  Error body: ${error.error}`
      );
    }

    this.logService.log(
      {
        text: 'Supplementary Benefit - Cannot get API response',
        response: error,
      },
      'Supplementary Benefit - Cannot get API response'
    );

    // A user facing error message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(error);
    // return of([]);
  }

  // This method is used to convert the response from user into a JSON object
  private convertBenefitApplication(
    from: BenefitApplication
  ): SupplementaryBenefitsApplicationType {
    const to: any = {};

    // Capturing Personal Info page response
    to.applicantFirstName = from.applicant.firstName;
    to.applicantSecondName = from.applicant.middleName;
    to.applicantLastName = from.applicant.lastName;
    if (from.applicant.hasDob) {
      /* Below date can be used if ISO8601DateFormat is outdated or doesn't work
            let day = from.applicant.dobSimple.day < 10 ? `0${from.applicant.dobSimple.day}` : from.applicant.dobSimple.day;
            let birthMonth = from.applicant.dobSimple.month < 10
                                ? `0${from.applicant.dobSimple.month.toString()}`
                                : from.applicant.dobSimple.month.toString();


            const birthDate = `${birthMonth}-${day}-${from.applicant.dobSimple.year.toString()}`;*/
      to.applicantBirthdate = String(
        format(from.applicant.dob, this.ISO8601DateFormat)
      );
    }
    to.applicantPHN = from.applicant.previous_phn
      ? from.applicant.previous_phn.replace(new RegExp('[^0-9]', 'g'), '')
      : '';
    to.applicantSIN = from.applicant.sin
      ? from.applicant.sin.replace(new RegExp('[^0-9]', 'g'), '')
      : '';

    /* Capturing Spouse Info page response */
    if (from.hasSpouseOrCommonLaw) {
      to.spouseFirstName = from.spouse.firstName;
      to.spouseSecondName = from.spouse.middleName;
      to.spouseLastName = from.spouse.lastName;
      if (from.spouse.hasDob) {
        /* Below date can be used if ISO8601DateFormat is outdated or doesn't work
                let spouseBirthMonth = from.spouse.dobSimple.month < 10
                                ? `0${from.spouse.dobSimple.month.toString()}`
                                : from.spouse.dobSimple.month.toString();

                const spouseBirthDate = `${spouseBirthMonth}-${from.spouse.dobSimple.day.toString()}-${from.spouse.dobSimple.year.toString()}`;*/
        to.spouseBirthdate = String(
          format(from.spouse.dob, this.ISO8601DateFormat)
        );
      }
      to.spousePHN = from.spouse.previous_phn
        ? String(
            from.spouse.previous_phn.replace(new RegExp('[^0-9]', 'g'), '')
          )
        : '';
      to.spouseSIN = from.spouse.sin
        ? String(from.spouse.sin.replace(new RegExp('[^0-9]', 'g'), ''))
        : '';
    }

    // Capturing Financial-info page response
    to.assistanceYear = String(from.getTaxYear());
    to.taxYear = String(from.taxYear);
    to.numberOfTaxYears = from.numberOfTaxYears();
    to.adjustedNetIncome =
      from.eligibility.adjustedNetIncome != null
        ? from.eligibility.adjustedNetIncome
        : 0;
    to.childDeduction =
      from.eligibility.childDeduction != null
        ? from.eligibility.childDeduction
        : 0;
    to.deductions =
      from.eligibility.deductions != null ? from.eligibility.deductions : 0;
    to.disabilityDeduction =
      from.disabilityDeduction != null ? from.disabilityDeduction : 0;
    to.sixtyFiveDeduction =
      from.eligibility.sixtyFiveDeduction != null
        ? from.eligibility.sixtyFiveDeduction
        : 0;
    to.totalDeductions = from.totalDeduction != null ? from.totalDeduction : 0;
    to.totalNetIncome =
      from.eligibility.totalNetIncome != null
        ? from.eligibility.totalNetIncome
        : 0;

    to.applicantAttendantCareExpense = from.applicantAttendantCareExpense;
    to.spouseAttendantCareExpense = from.spouseAttendantCareExpense;
    to.childAttendantCareExpense = from.childAttendantCareExpense;

    to.childCareExpense =
      from.claimedChildCareExpense_line214 != null
        ? (from.claimedChildCareExpense_line214 / 2) * 1
        : 0;

    to.netIncomeLastYear = Number(from.netIncomelastYear);

    to.numChildren =
      !!from.childrenCount && from.childrenCount > 0
        ? from.childrenCount * 1
        : 0;

    let numDis = 0;

    // applicant
    if (
      from.applicantEligibleForDisabilityCredit != null &&
      from.applicantEligibleForDisabilityCredit === true
    ) {
      numDis = numDis + 1;
    }

    // spouse
    if (
      from.spouseEligibleForDisabilityCredit != null &&
      from.spouseEligibleForDisabilityCredit === true
    ) {
      numDis = numDis + 1;
    }

    if (
      from.childWithDisabilityCount != null &&
      from.childWithDisabilityCount >= 0
    ) {
      numDis = numDis * 1 + from.childWithDisabilityCount * 1;
    }

    to.numDisabled = numDis * 1;

    to.spouseIncomeLine236 =
      from.spouseIncomeLine236 != null ? Number(from.spouseIncomeLine236) : 0;
    to.reportedUCCBenefit = from.reportedUCCBenefit_line117;
    to.spouseDSPAmount = from.spouseDSPAmount_line125 * 1;
    to.spouseDeduction = from.eligibility.spouseDeduction;
    to.spouseSixtyFiveDeduction = from.spouseAgeOver65 === true ? 3000 : 0;

    // Capturing Address page response
    to.applicantAddressLine1 = from.mailingAddress.addressLine1;
    to.applicantAddressLine2 = from.mailingAddress.addressLine2;
    to.applicantAddressLine3 = from.mailingAddress.addressLine3;
    to.applicantCity = from.mailingAddress.city;
    to.applicantCountry = from.mailingAddress.country;
    to.applicantPostalCode = from.mailingAddress.postal
      ? from.mailingAddress.postal.toUpperCase().replace(' ', '')
      : '';
    to.applicantProvinceOrState = from.mailingAddress.province;

    if (from.phoneNumber) {
      to.applicantTelephone = from.phoneNumber
        .replace(/[() +/-]/g, '')
        .substr(1);
    }

    // Capturing Authorization page response
    to.authorizedByApplicantDate = format(
      from.authorizedByApplicantDate,
      this.ISO8601DateFormat
    );

    to.authorizedByApplicant = from.authorizedByApplicant ? 'Y' : 'N';
    to.authorizedBySpouse = from.authorizedBySpouse ? 'Y' : 'N';
    to.powerOfAttorney = from.hasPowerOfAttorney ? 'Y' : 'N';

    // returning the suppbenefitresponse object
    return to as SupplementaryBenefitsApplicationType;
  }

  private prepareBenefitApplication(
    from: BenefitApplication
  ): MSPApplicationSchema {
    const object = {
      supplementaryBenefitsApplication: this.convertBenefitApplication(from),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid,
    };
    return object;
  }

  private convertToAttachment(
    images: CommonImage[]
  ): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: MspApiBenefitService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        // TODO - Sure this is the correct UUID here?
        attachmentUuid: image.uuid,
      };
      output.push(partial);
    });

    return output;
  }
}

// TODO - Move file - meant to be generic?
interface AttachmentRequestPartial {
  contentType: 'IMAGE_JPEG';
  // attachmentDocumentType: string; // TODO lock down
  attachmentDocumentType: 'SupportDocument';
  attachmentOrder: string; // String of number! '1', '2', '3'
  description: string;
  attachmentUuid: string;
}
