import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { MspAccountApp } from '../models/account.model';
import {
  AttachmentType,
  _ApplicationTypeNameSpace,
} from '../../msp-core/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { AbstractHttpService, CommonImage } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { AccountMaintenanceApiResponse } from '../models/account-response.interface';
import { SchemaService } from 'app/services/schema.service';
import {
  AccountChangeAccountHolderFactory,
  AccountChangeApplicationTypeFactory,
  AccountChangeAccountHolderType,
  AccountChangeChildType,
  AccountChangeChildTypeFactory,
  AccountChangeChildrenFactory,
  AccountChangeSpouseType,
  AccountChangeSpouseTypeFactory,
  AccountChangeSpousesTypeFactory,
  OperationActionType,
} from '../../../modules/msp-core/api-model/accountChangeTypes';
import {
  AccountChangeApplicationType,
  StatusInCanadaType,
  DocumentType,
} from '../../msp-core/interfaces/i-api';
import {
  OperationActionType as OperationActionTypeEnum,
  MspPerson,
} from '../../../components/msp/model/msp-person.model';
import { Address } from 'moh-common-lib';
import {
  AttachmentTypeFactory,
  AttachmentsType,
  AttachmentsTypeFactory,
} from '../../../modules/msp-core/api-model/applicationTypes';
import {
  AddressType,
  AddressTypeFactory,
  CitizenshipType,
  GenderType,
  NameType,
  NameTypeFactory,
} from '../../../modules/msp-core/api-model/commonTypes';
import {
  LivedInBCTypeFactory,
  OutsideBCTypeFactory,
  WillBeAwayTypeFactory,
} from '../../../modules/msp-core/api-model/enrolmentTypes';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';
import {
  StatusInCanada,
  CanadianStatusReason,
} from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { ApiResponse } from 'app/models/api-response.interface';
import { format } from 'date-fns';
import { SupportDocumentList } from '../../msp-core/models/support-documents.enum';

@Injectable({
  providedIn: 'root',
})

// TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiAccountService extends AbstractHttpService {
  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'yyyy-MM-dd';
  accountMaintenanceApiResponse: AccountMaintenanceApiResponse;

  constructor(
    protected http: HttpClient,
    private logService: MspLogService,
    private schemaSvc: SchemaService
  ) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: MspAccountApp): Promise<any> {
    const suppBenefitRequest = this.prepareAccountApplication(app);

    return new Promise<ApiResponse>((resolve, reject) => {
      //Validating the response against the schema
      this.schemaSvc.validate(suppBenefitRequest).then((res) => {
        if (res.errors) {
          let errorField;
          let errorMessage;

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
                  'Account - API validation against schema failed because of ' +
                  errorField +
                  ' field',
                response: errorMessage,
              },
              'Account - API validation against schema failed'
            );

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
              if (response && response.op_reference_number) {
                app.referenceNumber = response.op_reference_number.toString();
              }
              // Let our caller know were done passing back the application
              return resolve(response);
            });
          })
          .catch((error: Response | any) => {
            // TODO - Is this error correct? What if sendApplication() errors, would it be caught in this .catch()?
            this.logService.log(
              {
                text: 'Account - Attachment - Send All Rejected ',
                response: error,
              },
              'Account - Attachment - Send All Rejected'
            );
            return resolve(error);
          });
      });
    });
  }

  sendChangeAddressApplication(
    mspAccountApp: MspAccountApp
  ): Promise<ApiResponse> {
    const app: MSPApplicationSchema = {
      accountChangeApplication: {
        accountHolder: {
          selectedAddressChange: 'Y',
          selectedAddRemove: 'N',
          selectedPersonalInfoChange: 'N',
          selectedStatusChange: 'N',
          authorizedByApplicant: mspAccountApp.authorizedByApplicant
            ? 'Y'
            : 'N',
          authorizedByApplicantDate: format(new Date(), this.ISO8601DateFormat),
          birthDate: '2000-01-01',
          name: {
            firstName: 'NA',
            lastName: 'NA',
          },
          phn: '1234567890',
          residenceAddress: {
            addressLine1: 'UNKNOWN',
            city: 'UNKNOWN',
            provinceOrState: 'UNKNOWN',
            country: 'UNKNOWN',
            postalCode: 'UNKNOWN',
          },
          gender: 'M',
        },
      },
      attachments: [],
      uuid: mspAccountApp.uuid,
    };
    return new Promise<ApiResponse>((resolve, reject) => {
      this.sendApplication(
        app,
        mspAccountApp.uuid,
        mspAccountApp.authorizationToken
      ).subscribe(
        (response) => {
          // Add reference number
          if (response && response.op_reference_number) {
            mspAccountApp.referenceNumber =
              response.op_reference_number.toString();
          }
          // Let our caller know were done passing back the application
          return resolve(response);
        },
        (error) => {
          return reject(error);
        }
      );
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
    return this.post<MspAccountApp>(url, app);
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
                text: 'Account - Send All Attachments - Success',
                response: responses,
              },
              'Account - Send All Attachments - Success'
            );
            return resolve(responses);
          },
          (error: Response | any) => {
            this.logService.log(
              {
                text: 'Account - Attachments - Send All Error ',
                error: error,
              },
              'Account - Attachments - Send All Error '
            );
            return reject();
          }
        )
        .catch((error: Response | any) => {
          this.logService.log(
            {
              text: 'Account - Attachments - Send All Error ',
              error: error,
            },
            'Account - Attachments - Send All Error '
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
      url += '?programArea=ENROLMENT';

      // attachmentDocumentType - UI does NOT collect this property
      url += '&attachmentDocumentType=' + MspApiService.AttachmentDocumentType;

      // contentType
      url += '&contentType=' + attachment.contentType;

      // imageSize
      url += '&imageSize=' + attachment.size;

      // Necessary to differentiate between PA and SuppBen
      // TODO - VALIDATE THIS VALUE IS CORRECT, NEEDS TO BE CONFIRMED
      url += '&dpackage=msp_enrolment_pkg';

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
                text: 'Account - Send Individual Attachment - Success',
                response: response,
              },
              'Account - Send Individual Attachment - Success'
            );
            return resolve(response);
          },
          (error: Response | any) => {
            this.logService.log(
              {
                text: 'Account - Attachment - Send Individual Error ',
                response: error,
              },
              'Account - Attachment - Send Individual Error '
            );
            return reject(error);
          }
        )
        .catch((error: Response | any) => {
          this.logService.log(
            {
              text: 'Account - Attachment - Send Individual Error ',
              response: error,
            },
            'Account - Attachment - Send Individual Error '
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
        text: 'Account - Cannot get API response',
        response: error,
      },
      'Account - Cannot get API response'
    );

    // A user facing error message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(error);
  }

  // This method is used to convert the response from user into a JSON object
  convertMspAccountApp(from: MspAccountApp): AccountChangeApplicationType {
    const to: any = {};

    // Create Account Holder
    to.accountHolder = this.convertAccountHolderFromAccountChange(from);

    // Create Spouses for Adding, Removing and Updating
    to.spouses = AccountChangeSpousesTypeFactory.make();

    /** the account change option check is added so that only data belonging to current selection is sent..
     *  this avoids uncleared data being sent
     *  so only if PI or Update status is selected ; send updated spouse and children
     *  send add/remove only if dependent option is selected
     *
     *  The same login should in be in review screen as well
     */

    // Add Spouse
    if (
      from.accountChangeOptions.dependentChange &&
      from.hasSpouseAdded === true
    ) {
      to.spouses.addedSpouse = this.convertSpouseFromAccountChange(
        from.addedSpouse
      );
    }

    // Remove Spouse
    if (
      from.accountChangeOptions.dependentChange &&
      from.hasSpouseRemoved === true
    ) {
      to.spouses.removedSpouse = this.convertSpouseFromAccountChange(
        from.removedSpouse
      );
    }

    // Update Spouse
    if (from.hasSpouseUpdated === true) {
      to.spouses.updatedSpouse = this.convertSpouseFromAccountChange(
        from.updatedSpouse
      );
    }

    // Children
    if (
      from.addedChildren.length > 0 ||
      from.removedChildren.length > 0 ||
      from.updatedChildren.length > 0
    ) {
      to.children = new Array<AccountChangeChildType>();

      // Convert Added Children
      if (from.addedChildren.length > 0) {
        for (const child of from.addedChildren) {
          if (child && child.firstName && child.lastName) {
            to.children.push(this.convertChildFromAccountChange(child));
          }
        }
      }

      // Convert Removed Children
      if (from.removedChildren.length > 0) {
        for (const child of from.removedChildren) {
          if (child && child.firstName && child.lastName) {
            to.children.push(this.convertChildFromAccountChange(child));
          }
        }
      }

      // Convert Updated Children
      if (from.updatedChildren.length > 0) {
        for (const child of from.updatedChildren) {
          if (child && child.firstName && child.lastName) {
            to.children.push(this.convertChildFromAccountChange(child));
          }
        }
      }
    }

    return this.removeSequences(to);
  }

  private removeSequences(obj: any) {
    // Removes sequence.
    delete obj._sequence;

    // Iterate of object looking for more objects.
    for (const property in obj) {
      if (obj[property] instanceof Object) {
        obj[property] = this.removeSequences(obj[property]);
      }
    }
    return obj;
  }

  private convertSpouseFromAccountChange(
    from: MspPerson
  ): AccountChangeSpouseType {
    const to = AccountChangeSpouseTypeFactory.make();

    // Name
    to.name = this.convertName(from);

    // Birth Date
    if (from.hasDob) {
      to.birthDate = format(from.dob, this.ISO8601DateFormat);
    }

    // Gender
    if (from.gender != null) {
      to.gender = <GenderType>from.gender.toString();
    }

    // PHN
    if (from.previous_phn) {
      to.phn = from.previous_phn.replace(new RegExp('[^0-9]', 'g'), '');
    }

    // Status
    if (from.status != null) {
      to.citizenship = this.findCitizenShip(from.status, from.currentActivity);
    }

    // Previous Last name
    if (from.prevLastName) {
      to.previousLastName = from.prevLastName;
    }

    // Requested last name
    if (from.updateNameDueToMarriageRequestedLastName) {
      to.requestedLastName = from.updateNameDueToMarriageRequestedLastName;
    }

    // Marriage Date
    if (from.marriageDate) {
      to.marriageDate = format(from.marriageDate, this.ISO8601DateFormat);
    }

    if (from.isExistingBeneficiary != null) {
      to.isExistingBeneficiary =
        from.isExistingBeneficiary === true ? 'Y' : 'N';
    }

    if (from.isExistingBeneficiary === false) {
      this.populateNewBeneficiaryDetailsForSpouse(from, to);
    }

    to.livedInBC = LivedInBCTypeFactory.make();

    to.livedInBC.hasLivedInBC = from.livedInBCSinceBirth ? 'Y' : 'N';

    if (from.arrivalToBCDate) {
      to.livedInBC.recentBCMoveDate = format(
        from.arrivalToBCDate,
        this.ISO8601DateFormat
      );
    }

    if (from.arrivalToCanadaDate) {
      to.livedInBC.recentCanadaMoveDate = format(
        from.arrivalToCanadaDate,
        this.ISO8601DateFormat
      );
    }

    if (from.madePermanentMoveToBC) {
      to.livedInBC.isPermanentMove =
        from.madePermanentMoveToBC === true ? 'Y' : 'N';
    }

    if (from.movedFromProvinceOrCountry) {
      to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
    }

    if (from.healthNumberFromOtherProvince) {
      to.livedInBC.prevHealthNumber = from.healthNumberFromOtherProvince;
    }

    if (from.declarationForOutsideOver30Days) {
      to.outsideBC = OutsideBCTypeFactory.make();
      to.outsideBC.beenOutsideBCMoreThan = 'Y';
      to.outsideBC.familyMemberReason = from.departureReason12Months;
      to.outsideBC.destination = from.departureDestination12Months;
      if (from.departureDateDuring12MonthsDate) {
        to.outsideBC.departureDate = format(
          from.departureDateDuring12MonthsDate,
          this.ISO8601DateFormat
        );
      }
      if (from.returnDateDuring12MonthsDate) {
        to.outsideBC.returnDate = format(
          from.returnDateDuring12MonthsDate,
          this.ISO8601DateFormat
        );
      }
    } else if (from.declarationForOutsideOver30Days === false) {
      to.outsideBC = OutsideBCTypeFactory.make();
      to.outsideBC.beenOutsideBCMoreThan = 'N';
    }

    if (from.declarationForOutsideOver60Days) {
      to.outsideBCinFuture = OutsideBCTypeFactory.make();
      to.outsideBCinFuture.beenOutsideBCMoreThan = 'Y';
      to.outsideBCinFuture.familyMemberReason = from.departureReason;
      to.outsideBCinFuture.destination = from.departureDestination;
      if (from.departureDateDuring6MonthsDate) {
        to.outsideBCinFuture.departureDate = format(
          from.departureDateDuring6MonthsDate,
          this.ISO8601DateFormat
        );
      }
      if (from.returnDateDuring6MonthsDate) {
        to.outsideBCinFuture.returnDate = format(
          from.returnDateDuring6MonthsDate,
          this.ISO8601DateFormat
        );
      }
    } else if (from.declarationForOutsideOver60Days === false) {
      to.outsideBCinFuture = OutsideBCTypeFactory.make();
      to.outsideBCinFuture.beenOutsideBCMoreThan = 'N';
    }

    // Removing Spouse
    if (from.reasonForCancellation !== 'pleaseSelect') {
      to.cancellationReason = from.reasonForCancellation;
      if (from.cancellationDate) {
        to.cancellationDate = format(
          from.cancellationDate,
          this.ISO8601DateFormat
        );
      }
    }

    if (
      from.mailingAddress &&
      from.mailingAddress.addressLine1 &&
      from.mailingAddress.city &&
      from.mailingAddress.province &&
      from.mailingAddress.country &&
      from.mailingAddress.postal
    ) {
      to.mailingAddress = this.convertAddress(from.mailingAddress);
    }

    if (from.hasDischarge) {
      to.willBeAway = WillBeAwayTypeFactory.make();
      to.willBeAway.armedDischargeDate = format(
        from.dischargeDate,
        this.ISO8601DateFormat
      );
      to.willBeAway.armedForceInstitutionName = from.nameOfInstitute;
      to.willBeAway.isFullTimeStudent =
        from.relationship === Relationship.Child19To24 ? 'Y' : 'N';
    }

    return to;
  }

  private unknownAddress(): AddressType {
    const to = AddressTypeFactory.make();
    to.addressLine1 = 'UNKNOWN';
    to.addressLine2 = '';
    to.addressLine3 = '';
    to.city = 'UNKNOWN';
    to.country = 'UNKNOWN';
    to.postalCode = 'UNKNOWN';
    to.provinceOrState = 'UNKNOWN';

    return to;
  }

  private convertAddress(from: Address): AddressType {
    // Instantiate new object from interface
    const to = AddressTypeFactory.make();
    to.addressLine1 = from.addressLine1;
    to.addressLine2 = from.addressLine2;
    to.addressLine3 = from.addressLine3;
    to.city = from.city;
    to.country = from.country;
    to.postalCode = from.postal
      ? from.postal.toUpperCase().replace(' ', '')
      : undefined;
    to.provinceOrState = from.province;
    return to;
  }

  private convertChildFromAccountChange(
    from: MspPerson
  ): AccountChangeChildType {
    const to = AccountChangeChildTypeFactory.make();

    to.operationAction = <OperationActionType>(
      OperationActionTypeEnum[from.operationActionType]
    );
    to.name = this.convertName(from);

    if (from.hasDob) {
      to.birthDate = format(from.dob, this.ISO8601DateFormat);
    }

    if (from.gender != null) {
      to.gender = <GenderType>from.gender.toString();
    }

    if (from.previous_phn) {
      to.phn = from.previous_phn.replace(new RegExp('[^0-9]', 'g'), '');
    }

    if (from.status != null) {
      to.citizenship = this.findCitizenShip(from.status, from.currentActivity);
    }

    if (from.isExistingBeneficiary != null) {
      to.isExistingBeneficiary =
        from.isExistingBeneficiary === true ? 'Y' : 'N';
    }

    if (from.operationActionType === OperationActionTypeEnum.Add) {
      this.populateNewBeneficiaryDetailsForChild(from, to);
    }

    to.livedInBC = LivedInBCTypeFactory.make();

    to.livedInBC.hasLivedInBC = from.livedInBCSinceBirth ? 'Y' : 'N';

    if (from.arrivalToBCDate) {
      to.livedInBC.recentBCMoveDate = format(
        from.arrivalToBCDate,
        this.ISO8601DateFormat
      );
    }

    if (from.arrivalToCanadaDate) {
      to.livedInBC.recentCanadaMoveDate = format(
        from.arrivalToCanadaDate,
        this.ISO8601DateFormat
      );
    }

    if (from.madePermanentMoveToBC) {
      to.livedInBC.isPermanentMove =
        from.madePermanentMoveToBC === true ? 'Y' : 'N';
    }

    if (from.movedFromProvinceOrCountry) {
      to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
    }

    if (from.healthNumberFromOtherProvince) {
      to.livedInBC.prevHealthNumber = from.healthNumberFromOtherProvince;
    }

    if (from.declarationForOutsideOver30Days) {
      to.outsideBC = OutsideBCTypeFactory.make();
      to.outsideBC.beenOutsideBCMoreThan = 'Y';
      to.outsideBC.familyMemberReason = from.departureReason12Months;
      to.outsideBC.destination = from.departureDestination12Months;
      if (from.departureDateDuring12MonthsDate) {
        to.outsideBC.departureDate = format(
          from.departureDateDuring12MonthsDate,
          this.ISO8601DateFormat
        );
      }
      if (from.returnDateDuring12MonthsDate) {
        to.outsideBC.returnDate = format(
          from.returnDateDuring12MonthsDate,
          this.ISO8601DateFormat
        );
      }
    } else if (from.declarationForOutsideOver30Days === false) {
      to.outsideBC = OutsideBCTypeFactory.make();
      to.outsideBC.beenOutsideBCMoreThan = 'N';
    }

    if (from.declarationForOutsideOver60Days) {
      to.outsideBCinFuture = OutsideBCTypeFactory.make();
      to.outsideBCinFuture.beenOutsideBCMoreThan = 'Y';
      to.outsideBCinFuture.familyMemberReason = from.departureReason;
      to.outsideBCinFuture.destination = from.departureDestination;
      if (from.departureDateDuring6MonthsDate) {
        to.outsideBCinFuture.departureDate = format(
          from.departureDateDuring6MonthsDate,
          this.ISO8601DateFormat
        );
      }
      if (from.returnDateDuring6MonthsDate) {
        to.outsideBCinFuture.returnDate = format(
          from.returnDateDuring6MonthsDate,
          this.ISO8601DateFormat
        );
      }
    } else if (from.declarationForOutsideOver60Days === false) {
      to.outsideBCinFuture = OutsideBCTypeFactory.make();
      to.outsideBCinFuture.beenOutsideBCMoreThan = 'N';
    }

    // Child 19-24
    if (from.relationship === Relationship.Child19To24) {
      if (from.schoolName) {
        to.schoolName = from.schoolName;
      }

      if (from.hasStudiesDeparture) {
        to.departDateSchoolOutside = format(
          from.studiesDepartureDate,
          this.ISO8601DateFormat
        );
      }

      if (from.hasStudiesFinished) {
        to.dateStudiesFinish = format(
          from.studiesFinishedDate,
          this.ISO8601DateFormat
        );
      }

      if (from.hasStudiesBegin) {
        to.dateStudiesBegin = format(
          from.studiesBeginDate,
          this.ISO8601DateFormat
        );
      }

      to.schoolAddress = this.convertAddress(from.schoolAddress);
    }

    if (from.reasonForCancellation !== 'pleaseSelect') {
      to.cancellationReason = from.reasonForCancellation;
      if (from.cancellationDate) {
        to.cancellationDate = format(
          from.cancellationDate,
          this.ISO8601DateFormat
        );
      }
    }

    if (
      from.mailingAddress &&
      from.mailingAddress.addressLine1 &&
      from.mailingAddress.city &&
      from.mailingAddress.province &&
      from.mailingAddress.country &&
      from.mailingAddress.postal
    ) {
      to.mailingAddress = this.convertAddress(from.mailingAddress);
    }

    to.willBeAway = WillBeAwayTypeFactory.make();

    if (from.hasDischarge) {
      to.willBeAway.armedDischargeDate = format(
        from.dischargeDate,
        this.ISO8601DateFormat
      );
      to.willBeAway.armedForceInstitutionName = from.nameOfInstitute;
      to.willBeAway.isFullTimeStudent =
        from.relationship === Relationship.Child19To24 ? 'Y' : 'N';
    }

    if (from.inBCafterStudies !== undefined && from.inBCafterStudies !== null) {
      to.willBeAway.isInBCafterStudies = from.inBCafterStudies ? 'Y' : 'N';
    }

    return to;
  }

  /**
   * Creates the array of attachments from applicant, spouse and all children
   * used with both assistance and Account Management
   * @param {CommonImage[]} from
   * @returns {AttachmentsType}
   */
  private convertAttachments(from: CommonImage[]): AttachmentsType {
    const to = AttachmentsTypeFactory.make();
    to.attachment = new Array<AttachmentType>();

    // assemble all attachments
    const attachments: CommonImage[] = from;

    // If no attachments just return
    if (!attachments || attachments.length < 1) {
      return null;
    }

    // Convert each one
    for (const attachment of attachments) {
      if (attachment && attachment.uuid) {
        // Init new attachment with defaults
        const toAttachment = AttachmentTypeFactory.make();
        toAttachment.attachmentDocumentType =
          MspApiService.AttachmentDocumentType;

        // Content type
        switch (attachment.contentType) {
          case 'image/jpeg':
            toAttachment.contentType = 'image/jpeg';
            break;
          case 'application/pdf':
            toAttachment.contentType = 'application/pdf';
            break;
          default:
          //TODO: throw error on bad content type
        }

        // uuid
        toAttachment.attachmentUuid = attachment.uuid;
        toAttachment.attachmentOrder = String(attachment.attachmentOrder);
        // user does NOT provide description so it's left blank for now, may be used in future

        // Add to array
        to.attachment.push(toAttachment);
      }
    }

    return to;
  }

  private prepareAccountApplication(from: MspAccountApp): MSPApplicationSchema {
    const object = {
      accountChangeApplication: this.convertMspAccountApp(from),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid,
    };
    return object;
  }

  /*
    common method for spouse and child
     */
  private populateNewBeneficiaryDetailsForChild(
    from: MspPerson,
    to: AccountChangeChildType
  ) {
    //Has person lived in B.C. since birth?
    if (from.livedInBCSinceBirth != null) {
      to.livedInBC = LivedInBCTypeFactory.make();
      if (from.livedInBCSinceBirth === true) {
        to.livedInBC.hasLivedInBC = 'Y';
      } else {
        to.livedInBC.hasLivedInBC = 'N';
      }

      if (from.livedInBCSinceBirth === false) {
        to.livedInBC.isPermanentMove =
          from.madePermanentMoveToBC === true ? 'Y' : 'N';
        if (from.healthNumberFromOtherProvince) {
          to.livedInBC.prevHealthNumber = from.healthNumberFromOtherProvince; // out of province health numbers
        }

        if (from.movedFromProvinceOrCountry) {
          to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
        }

        // Arrival dates
        if (from.hasArrivalToBC) {
          to.livedInBC.recentBCMoveDate = format(
            from.arrivalToBCDate,
            this.ISO8601DateFormat
          );
        }
      }
    }
    //Is this child newly adopted?
    if (from.newlyAdopted) {
      to.adoptionDate = format(from.adoptedDate, this.ISO8601DateFormat);
    }
  }

  private populateNewBeneficiaryDetailsForSpouse(
    from: MspPerson,
    to: AccountChangeSpouseType
  ) {
    //Has person lived in B.C. since birth?
    if (from.livedInBCSinceBirth != null) {
      to.livedInBC = LivedInBCTypeFactory.make();
      if (from.livedInBCSinceBirth === true) {
        to.livedInBC.hasLivedInBC = 'Y';
      } else {
        to.livedInBC.hasLivedInBC = 'N';
      }

      if (from.livedInBCSinceBirth === false) {
        to.livedInBC.isPermanentMove =
          from.madePermanentMoveToBC === true ? 'Y' : 'N';
        if (from.healthNumberFromOtherProvince) {
          to.livedInBC.prevHealthNumber = from.healthNumberFromOtherProvince; // out of province health numbers
        }

        if (from.movedFromProvinceOrCountry) {
          to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
        }

        // Arrival dates
        if (from.hasArrivalToBC) {
          to.livedInBC.recentBCMoveDate = format(
            from.arrivalToBCDate,
            this.ISO8601DateFormat
          );
        }
      }
    }
  }

  private convertToAttachment(
    images: CommonImage[]
  ): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: MspApiAccountService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        // TODO - Sure this is the correct UUID here?
        attachmentUuid: image.uuid,
      };
      output.push(partial);
    });
    return output;
  }

  private convertName(from: MspPerson): NameType {
    const to = NameTypeFactory.make();

    /*
     firstName: string;
     lastName: string;
     secondName?: string;
     */
    to.firstName = from.firstName;
    to.secondName = from.middleName;
    to.lastName = from.lastName;

    return to;
  }

  findStatusInCanada(statusInCanada: StatusInCanada): StatusInCanadaType {
    let status: StatusInCanadaType;
    switch (statusInCanada) {
      case StatusInCanada.CitizenAdult:
        status = StatusInCanadaType.CitizenAdult;
        break;
      case StatusInCanada.PermanentResident:
        status = StatusInCanadaType.PermanentResident;
        break;
      case StatusInCanada.TemporaryResident:
        status = StatusInCanadaType.TemporaryResident;
        break;
    }
    return status;
  }

  findDocumentType(documentType: string): DocumentType {
    let document: DocumentType;
    switch (documentType) {
      case SupportDocumentList.CanadianBirthCertificate:
        document = DocumentType.CanadianBirthCertificate;
        break;
      case SupportDocumentList.CanadianCitizenCard:
        document = DocumentType.CanadianCitizenCard;
        break;
      case SupportDocumentList.CanadianPassport:
        document = DocumentType.CanadianPassport;
        break;
      case SupportDocumentList.ChangeGenderAdultApplication:
        document = DocumentType.ChangeGenderAdultApplication;
        break;
      case SupportDocumentList.ChangeGenderMinorApplication:
        document = DocumentType.ChangeGenderMinorApplication;
        break;
      case SupportDocumentList.ChangeGenderPhysicianConfirmation:
        document = DocumentType.ChangeGenderPhysicianConfirmation;
        break;
      case SupportDocumentList.ChangeOfNameCertificate:
        document = DocumentType.ChangeOfNameCertificate;
        break;
      case SupportDocumentList.DiplomaticPassportAcceptance:
        document = DocumentType.DiplomaticPassportAcceptance;
        break;
      case SupportDocumentList.DivorceDecree:
        document = DocumentType.DivorceDecree;
        break;
      case SupportDocumentList.DriversLicense:
        document = DocumentType.DriversLicense;
        break;
      case SupportDocumentList.MarriageCertificate:
        document = DocumentType.MarriageCertificate;
        break;
      case SupportDocumentList.NoticeOfDecision:
        document = DocumentType.NoticeOfDecision;
        break;
      case SupportDocumentList.NotarizedStatementOrAffidavit:
        document = DocumentType.NotarizedStatementOrAffidavit;
        break;
      case SupportDocumentList.Other:
        document = DocumentType.Other;
        break;
      case SupportDocumentList.ParentalConsentWaiver:
        document = DocumentType.ParentalConsentWaiver;
        break;
      case SupportDocumentList.PassportWithDiplomaticFoil:
        document = DocumentType.PassportWithDiplomaticFoil;
        break;
      case SupportDocumentList.PermanentResidentCard:
        document = DocumentType.PermanentResidentCard;
        break;
      case SupportDocumentList.PermanentResidentConfirmation:
        document = DocumentType.PermanentResidentConfirmation;
        break;
      case SupportDocumentList.RecordOfLanding:
        document = DocumentType.RecordOfLanding;
        break;
      case SupportDocumentList.ReligiousWorker:
        document = DocumentType.ReligiousWorker;
        break;
      case SupportDocumentList.SeparationAgreement:
        document = DocumentType.SeparationAgreement;
        break;
      case SupportDocumentList.StudyPermit:
        document = DocumentType.StudyPermit;
        break;
      case SupportDocumentList.VisitorVisa:
        document = DocumentType.VisitorVisa;
        break;
      case SupportDocumentList.WorkInCanadaAcceptance:
        document = DocumentType.WorkInCanadaAcceptance;
        break;
      case SupportDocumentList.WorkPermit:
        document = DocumentType.WorkPermit;
        break;
    }
    return document;
  }

  findCitizenShip(
    statusInCanada: StatusInCanada,
    currentActivity: CanadianStatusReason
  ): CitizenshipType {
    let citizen: CitizenshipType;
    switch (statusInCanada) {
      case StatusInCanada.CitizenAdult:
        citizen = 'CanadianCitizen';
        break;
      case StatusInCanada.PermanentResident:
        citizen = 'PermanentResident';
        break;
      case StatusInCanada.TemporaryResident:
        switch (currentActivity) {
          case CanadianStatusReason.WorkingInBC:
            citizen = 'WorkPermit';
            break;
          case CanadianStatusReason.StudyingInBC:
            citizen = 'StudyPermit';
            break;
          case CanadianStatusReason.Diplomat:
            citizen = 'Diplomat';
            break;
          case CanadianStatusReason.ReligiousWorker:
            citizen = 'ReligiousWorker';
            break;
          case CanadianStatusReason.Visiting:
          default:
            citizen = 'VisitorPermit';
            break;
        }
    }
    return citizen;
  }

  private convertAccountHolderFromAccountChange(
    from: MspAccountApp
  ): AccountChangeAccountHolderType {
    const accountHolder: AccountChangeAccountHolderType =
      AccountChangeAccountHolderFactory.make();

    accountHolder.selectedAddRemove =
      from.accountChangeOptions.dependentChange ||
      (from.addedChildren && from.addedChildren.length > 0) ||
      (from.removedChildren && from.removedChildren.length > 0)
        ? 'Y'
        : 'N';
    accountHolder.selectedAddressChange = from.accountChangeOptions
      .addressUpdate
      ? 'Y'
      : 'N';
    accountHolder.selectedPersonalInfoChange =
      from.accountChangeOptions.personInfoUpdate ||
      from.applicant.updatingPersonalInfo === true
        ? 'Y'
        : 'N';
    accountHolder.selectedStatusChange =
      from.applicant.updateStatusInCanada ||
      (from.addedSpouse && from.addedSpouse.updateStatusInCanada) ||
      (from.removedSpouse && from.removedSpouse.updateStatusInCanada) ||
      (from.updatedSpouse && from.updatedSpouse.updateStatusInCanada)
        ? 'Y'
        : 'N';

    // Full Name
    accountHolder.name = this.convertName(from.applicant);

    // PHN
    if (from.applicant.previous_phn) {
      accountHolder.phn = from.applicant.previous_phn.replace(
        new RegExp('[^0-9]', 'g'),
        ''
      );
    }

    // Birth Date
    if (from.applicant.hasDob) {
      accountHolder.birthDate = format(
        from.applicant.dob,
        this.ISO8601DateFormat
      );
    }

    // Gender
    if (from.applicant.gender != null) {
      accountHolder.gender = <GenderType>from.applicant.gender.toString();
    }

    // Status
    if (from.applicant.status != null) {
      accountHolder.citizenship = this.findCitizenShip(
        from.applicant.status,
        from.applicant.currentActivity
      );
    }

    if (from.authorizedByApplicant != null) {
      accountHolder.authorizedByApplicant = from.authorizedByApplicant
        ? 'Y'
        : 'N';
      accountHolder.authorizedByApplicantDate = format(
        from.authorizedByApplicantDate,
        this.ISO8601DateFormat
      );
    }

    if (from.authorizedBySpouse != null) {
      accountHolder.authorizedBySpouse = from.authorizedBySpouse ? 'Y' : 'N';
    }

    if (from.residentialAddress) {
      accountHolder.residenceAddress = this.convertAddress(
        from.residentialAddress
      );
    }

    // If mailing is same as residential address, use residential address as the mailing address.
    // Otherwise, use a different address as the mailing address.
    if (from.mailingSameAsResidentialAddress === true) {
      accountHolder.mailingAddress = this.convertAddress(
        from.residentialAddress
      );
    } else {
      accountHolder.mailingAddress = this.convertAddress(from.mailingAddress);
    }

    if (from.phoneNumber) {
      accountHolder.telephone = from.phoneNumber
        .replace(/[() +/-]/g, '')
        .substr(1);
    }

    if (from.applicant.updateNameDueToMarriage) {
      accountHolder.requestedLastName =
        from.applicant.updateNameDueToMarriageRequestedLastName;
    }

    return accountHolder;
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
