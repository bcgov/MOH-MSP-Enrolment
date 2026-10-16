import {
  EventEmitter,
  Output,
  Component,
  Input,
  forwardRef, OnInit,
} from '@angular/core';
import {
  MspAccountApp,
  UpdateList,
  ItemList,
} from '../../models/account.model';
import {
  nameChangeSupportDocs,
  nameChangeDueToMarriageOrDivorceDocuments,
  genderDesignationChangeDocuments,
  nameChangeDueToErrorDocuments,
  genderBirthDateChangeDocuments,
} from '../../../msp-core/components/support-documents/support-documents.component';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';
import { SupportDocumentTypes } from 'app/modules/msp-core/models/support-documents.enum';
import { Base } from 'moh-common-lib-angular';
import { ControlContainer, NgForm } from '@angular/forms';
import { CanadianStatusReason, StatusInCanada } from 'app/modules/msp-core/models/canadian-status.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

@Component({
  standalone: false,
  selector: 'msp-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => NgForm),
    },
  ],
})
export class UpdateRequestComponent extends Base implements OnInit {
  @Input() person: MspPerson;
  @Input() activitiesTable: any[];
  @Input() accountApp: MspAccountApp;
  @Input() label = 'Update';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() status: boolean;
  @Input() updateList: UpdateList[];

  itemList: ItemList[];
  @Output() statusChange: EventEmitter<boolean>; //  = new EventEmitter<boolean>();
  mspAccountApp: MspAccountApp;
  canadianCitizenDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.CanadianCitizenCard,
  ];
  permanentResidentDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.PermanentResidentCard,
  ];
  hideStatus: StatusInCanada[] = [
    StatusInCanada.CitizenAdult,
    StatusInCanada.PermanentResident,
  ];

  nameChangeDueToMarriageDocs = nameChangeDueToMarriageOrDivorceDocuments();
  nameChangeDueToNameChangeDocs = nameChangeSupportDocs();
  nameChangeDueToErrorDocs = nameChangeDueToErrorDocuments();
  genderBirthdateChangeDocs = genderBirthDateChangeDocuments();
  genderChangeDocs = genderDesignationChangeDocuments();

  //statusValue: number;
  //  = legalStatus;
  constructor() {
    super();
    //this.mspAccountApp = dataService.getMspAccountApp();
  }

  ngOnInit() {
    //this.person = this.dataService.getMspAccountApp().applicant ;
    if (this.person.status >= 0 && this.person.status !== undefined) {
      //this.itemList = this.item(this.person.status);
    }
  }

  get hasStatus() {
    // Has to have values
    return this.person.status !== undefined;
  }

  get statusDocuments(): SupportDocuments {
    return this.person.updateStatusInCanadaDocType;
  }

  set statusDocuments(document: SupportDocuments) {
    this.person.updateStatusInCanadaDocType = document;

    if (document.images && document.images.length === 0) {
      // no status documents remove any name documents
      this.person.nameChangeDocs.documentType = null;
      this.person.nameChangeDocs.images = [];

      this.person.nameChangeAdditionalDocs.documentType = null;
      this.person.nameChangeAdditionalDocs.images = [];

      this.person.updateNameDueToMarriageRequestedLastName = null;
      this.person.updateNameDueToMarriageDocType.documentType = null;
      this.person.updateNameDueToMarriageDocType.images = [];

      this.person.updateNameDueToNameChangeDocType.documentType = null;
      this.person.updateNameDueToNameChangeDocType.images = [];

      this.person.updateNameDueToErrorDocType.documentType = null;
      this.person.updateNameDueToErrorDocType.images = [];

      this.person.updateBirthdateDocType.documentType = null;
      this.person.updateBirthdateDocType.images = [];

      this.person.updateGenderDocType.documentType = null;
      this.person.updateGenderDocType.images = [];

      this.person.updateGenderDesignationDocType.documentType = null;
      this.person.updateGenderDesignationDocType.images = [];
    }
  }

  getDocList() {
    if (this.person.status === StatusInCanada.CitizenAdult) {
      return this.canadianCitizenDocList;
    } else if (this.person.status === StatusInCanada.PermanentResident) {
      return this.permanentResidentDocList;
    }
  }

  checkStatus() {
    return (
      this.person.status === StatusInCanada.CitizenAdult ||
      this.person.status === StatusInCanada.PermanentResident ||
      this.person.currentActivity !== undefined
    );
  }

  isWorkPermit() {
    return this.person.currentActivity === CanadianStatusReason.WorkingInBC;
  }

  get isChild() {
    return (
      this.person.relationship === Relationship.Child ||
      this.person.relationship === undefined
    );
  }

  get relationshipText() {
    switch (this.person.relationship) {
      case Relationship.Applicant:
        return 'Account Holder';
      case Relationship.Spouse:
        return 'Spouse';
      default:
        return 'Child';
    }
  }

  get possessiveRelationshipNoun() {
    switch (this.person.relationship) {
      case Relationship.Applicant:
        return 'your';
      case Relationship.Spouse:
               return "your spouse's";
      default:
               return "the child's";
    }
  }

  // An option that is unchecked no longer applies, so its uploaded files and
  // document type are dropped. Review counts and submit read these models.
  private clearDocuments(doc: SupportDocuments) {
    doc.documentType = null;
    doc.images = [];
  }

  changeUpdateStatusInCanada(event: boolean) {
    this.person.updateStatusInCanada = event;
    if (!event) {
      this.clearDocuments(this.person.updateStatusInCanadaDocType);
    }
  }

  changeUpdateNameDueToMarriage(event: boolean) {
    this.person.updateNameDueToMarriage = event;
    if (!event) {
      this.person.updateNameDueToMarriageRequestedLastName = '';
      this.clearDocuments(this.person.updateNameDueToMarriageDocType);
    }
  }

  changeUpdateNameDueToNameChange(event: boolean) {
    this.person.updateNameDueToNameChange = event;
    if (!event) {
      this.clearDocuments(this.person.updateNameDueToNameChangeDocType);
    }
  }

  changeUpdateGender(event: boolean) {
    this.person.updateGender = event;
    if (!event) {
      this.clearDocuments(this.person.updateGenderDocType);
      this.clearDocuments(this.person.updateGenderDocType2);
      this.clearDocuments(this.person.updateGenderDocType3);
      this.person.updateGenderAdditionalDocs = null;
      this.person.updateGenderAdditionalDocs2 = null;
    }
  }

  // Answering No to a second or third document question drops the files that
  // were uploaded under it, so they are not counted or submitted.
  onGenderAdditionalAnswer(hasAdditional: boolean) {
    if (hasAdditional === false) {
      this.clearDocuments(this.person.updateGenderDocType2);
      this.clearDocuments(this.person.updateGenderDocType3);
      this.person.updateGenderAdditionalDocs2 = null;
    }
  }

  onGenderAdditionalAnswer2(hasAdditional: boolean) {
    if (hasAdditional === false) {
      this.clearDocuments(this.person.updateGenderDocType3);
    }
  }

  changeUpdateNameDueToError(event: boolean) {
    this.person.updateNameDueToError = event;
    if (!event) {
      this.clearDocuments(this.person.updateNameDueToErrorDocType);
    }
  }

  changeUpdateBirthdate(event: boolean) {
    this.person.updateBirthdate = event;
    if (!event) {
      this.clearDocuments(this.person.updateBirthdateDocType);
    }
  }

  changeUpdateGenderDesignation(event: boolean) {
    this.person.updateGenderDesignation = event;
    if (!event) {
      this.clearDocuments(this.person.updateGenderDesignationDocType);
    }
  }
}
