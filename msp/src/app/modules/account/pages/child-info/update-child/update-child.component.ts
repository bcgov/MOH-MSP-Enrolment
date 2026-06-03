import { Component, OnInit, Input } from '@angular/core';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { StatusInCanada, CanadianStatusReason } from '../../../../msp-core/models/canadian-status.enum';
import { SupportDocumentTypes } from 'app/modules/msp-core/models/support-documents.enum';
import {
  nameChangeSupportDocs,
  nameChangeDueToMarriageOrDivorceDocuments,
  genderDesignationChangeDocuments,
  nameChangeDueToErrorDocuments,
  genderBirthDateChangeDocuments
} from '../../../../msp-core/components/support-documents/support-documents.component';
import { SpaEnvService } from '../../../../../services/spa-env.service';
import { ErrorMessage } from 'moh-common-lib';
import { startOfToday, subDays, isBefore } from 'date-fns';

@Component({
  selector: 'msp-update-child',
  templateUrl: './update-child.component.html',
  styleUrls: ['./update-child.component.scss']
})
export class UpdateChildComponent implements OnInit {

  constructor( public dataService: MspAccountMaintenanceDataService,
              private spaEnvService: SpaEnvService
  ) { }

  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
  @Input() accountApp: MspAccountApp;
  @Input() index: number;
  @Input() phns: string[];
  canadianCitizenDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.CanadianPassport
  ];
  permanentResidentDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.PermanentResidentCard
  ];
  hideStatus: StatusInCanada[] = [
    StatusInCanada.CitizenAdult,
    StatusInCanada.PermanentResident
  ];
  nameChangeDueToNameChangeDocs = nameChangeSupportDocs();
  nameChangeDueToMarriageDocs = nameChangeDueToMarriageOrDivorceDocuments();
  genderChangeDocs = genderDesignationChangeDocuments();
  nameChangeDuetoErrorDocs = nameChangeDueToErrorDocuments();
  genderBirthdateChangeDocs = genderBirthDateChangeDocuments();

  private _today = startOfToday();
  // Replace default messages in the date component for school completion and departure dates
  schoolCompletionErrMsg: ErrorMessage = {
    noPastDatesAllowed: 'Expected school completion cannot be in the past.',
    invalidValue: 'This does not appear to be a valid date.',
    dayOutOfRange: 'This does not appear to be a valid date.',
    noFutureDatesAllowed: 'This does not appear to be a valid date.',
    yearDistantFuture: 'This does not appear to be a valid date.',
    yearDistantPast: 'This does not appear to be a valid date.',
    invalidRange: 'This does not appear to be a valid date, Expected school completion cannot be in the past'
  };

  schoolDepartureErrMsg: ErrorMessage = {
    noFutureDatesAllowed: 'Departure date can not be in the future.',
    invalidValue: 'This does not appear to be a valid date.',
    dayOutOfRange: 'This does not appear to be a valid date.',
    noPastDatesAllowed: 'This does not appear to be a valid date.',
    yearDistantFuture: 'This does not appear to be a valid date.',
    yearDistantPast: 'This does not appear to be a valid date.'
  };

  ngOnInit() {
    this.child.relationship = Relationship.Child;
  }

  checkStatus() {
    return (this.child.status === StatusInCanada.CitizenAdult ||
      this.child.status === StatusInCanada.PermanentResident ||
      this.child.currentActivity !== undefined);
    }

    getDocList() {
      if (this.child.status === StatusInCanada.CitizenAdult){
      return this.canadianCitizenDocList;
    } else if (this.child.status === StatusInCanada.PermanentResident) {
      return this.permanentResidentDocList;
    }
  }

  get studiesDepartureDateStartRange() {
    if (this.child.arrivalToBCDate) {
      return this.child.arrivalToBCDate;
    }
    return this.child.dob;
  }

  get studiesDepartureDateEndRange() {
    if (this.child.studiesBeginDate) {
      return this.child.studiesBeginDate < subDays(this._today, 1)
        ? this.child.studiesBeginDate
        : subDays(this._today, 1);
    }
    return subDays(this._today, 1);
  }

  get studiesDepartureDateErrorMessage(): ErrorMessage {
    // If they leave to school before they arrived in BC
    if (this.child.studiesDepartureDate < this.child.arrivalToBCDate) {
      return { invalidRange: 'Date must be after arrival in BC.' };
      // If they leave to school in the future
    } else if (this.child.studiesDepartureDate > this._today) {
      return { invalidRange: 'Date cannot be in the future.' };
      // If they leave to school before they were born
    } else if (this.child.studiesDepartureDate < this.child.dob) {
      return { invalidRange: 'Date must be after birthdate.' };
      // If studies begin before they depart
    } else if (this.child.studiesBeginDate < this.child.studiesDepartureDate) {
      return { invalidRange: 'Date must be prior to school beginning.' };
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' };
    }
  }

  get studiesBeginDateStartRange() {
    if (
      this.child.studiesDepartureDate &&
      isBefore(this.child.dob, this.child.studiesDepartureDate)
    ) {
      return this.child.studiesDepartureDate;
    }
    return this.child.dob;
  }

  get studiesBeginDateEndRange() {
    return this.child.studiesFinishedDate ? this.child.studiesFinishedDate : null;
  }

  get studiesBeginDateErrorMessage(): ErrorMessage {
    // If studies begin before they depart
    if (this.child.studiesBeginDate < this.child.studiesDepartureDate) {
      return { invalidRange: 'Date must be after departure to school.' };
      // If studies begin after they finish
    } else if (this.child.studiesBeginDate > this.child.studiesFinishedDate) {
      return { invalidRange: 'Date must be prior to finish date.' };
      // If studies begin before birthdate
    } else if (this.child.studiesBeginDate < this.child.dob) {
      return { invalidRange: 'Date must be after birthdate.' };
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' };
    }
  }

  get studiesFinishedDateStartRange() {
    return this.child.studiesBeginDate > this._today
      ? this.child.studiesBeginDate
      : this._today;
  }

  get studiesFinishedDateEndRange() {
    return null;
  }

  get studiesFinishedDateErrorMessage(): ErrorMessage {
    // If the finish date is before the start date
    if (this.child.studiesFinishedDate < this.child.studiesBeginDate) {
      return { invalidRange: 'Date must be after date studies begin.' };
      // If the finish date is before today
    } else if (this.child.studiesFinishedDate < this._today) {
      return { invalidRange: 'Date cannot be in the past.' };
      // If the arrival is before birthdate
    } else if (this.child.studiesFinishedDate < this.child.dob) {
      return { invalidRange: 'Date must be after birthdate.' };
      // Catchall
    } else {
      return { invalidRange: 'Invalid date range.' };
    }
  }

  get accountUpdateList(): UpdateList[] {
    return [
      {
        // tslint:disable-next-line: quotemark
        "label": "Update status in Canada",
        'value': this.child.updateStatusInCanada
      },
      {
        'label': 'Update name - due to marriage or other',
        'value': this.child.updateNameDueToMarriage
      },
      {
        'label': 'Correct name - due to error',
        'value': this.child.updateNameDueToError
      },
      {
        'label': 'Correct birthdate',
        'value': this.child.updateBirthdate
      },
      {
        'label': 'Correct gender',
        'value': this.child.updateGender
      },
      {
        'label': 'Change gender designation',
        'value': this.child.updateGenderDesignation
      },
      {
        'label': 'Update child status to dependent post-secondary student',
        'value': this.child.updateChildStatus
      }
    ];
  }

  get phnList() {
    const cp = [...this.phns];
    cp.splice(cp.indexOf(this.child.phn), 1);
    return cp;
  }

  isWorkPermit() {
    return this.child.currentActivity === CanadianStatusReason.WorkingInBC;
  }

  get isAddressValidatorEnabled(): boolean {
    const envs = this.spaEnvService.getValues();
    return envs && envs.SPA_ENV_ENABLE_ADDRESS_VALIDATOR === 'true';
  }

  isAdult() {
    const childDob = new Date(this.child.dob);
    const hadDobThisYear = this._today.getMonth() > childDob.getMonth()
      || (this._today.getMonth() === childDob.getMonth()
      && this._today.getDate() >= childDob.getDate());
    let childAge = this._today.getFullYear() - childDob.getFullYear();

    if (!hadDobThisYear) {
      childAge--;
    }
    return childAge >= 18;
  }
}
