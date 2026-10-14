import { Component, Input } from '@angular/core';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Router } from '@angular/router';
import { StatusInCanada, CanadianStatusReason, statusInCanadaStrings, CanadianStatusReasonStrings } from '../../../msp-core/models/canadian-status.enum';
import { getCountryDescription, getProvinceDescription } from 'moh-common-lib-angular';
import { getStatusStrings, getStatusReasonStrings } from '../../../msp-core/components/canadian-status/canadian-status.component';
import { Relationship } from '../../../../models/relationship.enum';
import { format } from 'date-fns';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';
import enLang from './i18n/data/en/index';

/* TO BE REPLACED when remaining apps are refactored to have own application  model definitions
 * built off the base classes ( base-person.model, base-application.model, base-msp-data.service,
 * base-msp-api.service)
 */
@Component({
  standalone: false,
  selector: 'account-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class AccountPersonCardComponent {

  public dateFormat = 'MMMM d, yyyy';

  lang = enLang;
  status: string[] = getStatusStrings();

  statusReason: string[] = getStatusReasonStrings();

  @Input() person: MspPerson;
  @Input() editRouterLink: string;
  @Input() customTitle: string;
  @Input() customLinkTitle: string;
  @Input() accountCard = false;

  constructor(private _router: Router) {
  }

  editPersonalInfo() {
    this._router.navigate([this.editRouterLink]);
  }

  get statusInCanadaLabel(): string {
    return statusInCanadaStrings[this.person.status];
  }

  get currentActivityLabel(): string {
    if (this.person.currentActivity === undefined){
      return '';
    }
    const currentActivity = '> ';
    switch (this.person.currentActivity) {
      case CanadianStatusReason.LivingInBCWithoutMSP: {
        return currentActivity + CanadianStatusReasonStrings.LivingInBCWithoutMSP;
      }
      case CanadianStatusReason.MovingFromProvince: {
        return currentActivity + CanadianStatusReasonStrings.MovingFromProvince;
      }
      case CanadianStatusReason.MovingFromCountry: {
        return currentActivity + CanadianStatusReasonStrings.MovingFromCountry;
      }
      case CanadianStatusReason.WorkingInBC: {
        return currentActivity + CanadianStatusReasonStrings.WorkingInBC;
      }
      case CanadianStatusReason.StudyingInBC: {
        return currentActivity + CanadianStatusReasonStrings.StudyingInBC;
      }
      case CanadianStatusReason.ReligiousWorker: {
        return currentActivity + CanadianStatusReasonStrings.ReligiousWorker;
      }
      case CanadianStatusReason.Diplomat: {
        return currentActivity + CanadianStatusReasonStrings.Diplomat;
      }
      case CanadianStatusReason.Visiting: {
        return currentActivity + CanadianStatusReasonStrings.Visiting;
      }
    }
  }

  get hasDocumentAttached(): boolean {
    return this.documentCount > 0;
  }

  /** Files uploaded for the status in Canada question only. */
  get documentCount(): number {
    return this.countFiles(this.person.updateStatusInCanadaDocType);
  }

  /**
   * Files uploaded for the name change question, including the optional
   * additional document that is asked under it. Uploads left over from an
   * answer that was later changed to No are not counted.
   */
  get nameChangeDocumentCount(): number {
    if (!this.person.hasNameChange) {
      return 0;
    }
    return this.countFiles(this.person.nameChangeDocs) +
      (this.person.hasNameChangeAdditional ? this.countFiles(this.person.nameChangeAdditionalDocs) : 0);
  }

  /** Files uploaded for every other update request (name, gender, birthdate, divorce). */
  get otherDocumentCount(): number {
    return [
      this.person.updateNameDueToMarriageDocType,
      this.person.updateNameDueToNameChangeDocType,
      this.person.updateGenderDocType,
      this.person.updateGenderDocType2,
      this.person.updateGenderDocType3,
      this.person.updateNameDueToErrorDocType,
      this.person.updateBirthdateDocType,
      this.person.updateGenderDesignationDocType,
      this.person.removedSpouseDueToDivorceDoc
    ].reduce((total, docs) => total + this.countFiles(docs), 0);
  }

  get movedFromLabel(): string {
    if (this.person.status === StatusInCanada.TemporaryResident ||
      this.person.currentActivity === CanadianStatusReason.MovingFromCountry) {
      return 'Moved from jurisdiction';
    } else {
      return 'Moved from province';
    }
  }

  get fileLabel(): string {
    return this.filesLabel(this.documentCount);
  }

  get nameChangeFileLabel(): string {
    return this.filesLabel(this.nameChangeDocumentCount);
  }

  get otherFileLabel(): string {
    return this.filesLabel(this.otherDocumentCount);
  }

  get movedFromProvinceOrCountry() {
    if (this.person.currentActivity === CanadianStatusReason.MovingFromCountry) {
      return getCountryDescription(this.person.movedFromProvinceOrCountry);
    }
    return getProvinceDescription(this.person.movedFromProvinceOrCountry);
  }

  private countFiles(docs: SupportDocuments): number {
    return docs && docs.images ? docs.images.length : 0;
  }

  private filesLabel(count: number): string {
    if (count > 1) {
      return 'Files';
    }
    return count === 1 ? 'File' : '';
  }

  formatDateField(dt: Date) {
    return format(dt, this.dateFormat);
  }

  get hasMarriageDate(): boolean {
    return !!this.person.marriageDate && this.person.relationship === Relationship.Spouse;
  }

  get title() {
    return this.customTitle ? this.customTitle :
      this.lang.relationshipLabel[this.person.relationship] + ' ' + this.lang.cardSuffix;
  }
}
