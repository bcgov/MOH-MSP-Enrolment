import { Base, CommonImage } from 'moh-common-lib-angular';
import { v4 as uuid } from 'uuid';

/**
 * All applications have these fields
 */
export class BaseApplication extends Base {

  // Flag to indicate whether individual has read the collection agreement
  infoCollectionAgreement: boolean;

  // Token for all calls to backend
  authorizationToken: string;

  // Reference number returned by call to back-end
  referenceNumber: string;

  // Authorization
  authorizedByApplicant: boolean;
  authorizedBySpouse: boolean;
  authorizedByApplicantDate: Date;

  // Wrapper arount objectId so that we do not break applications that call this method
  get uuid(): string {
    return this.objectId;
  }

  // Regenerate the UUID
  regenUUID() {
    this.objectId = uuid();
  }

  // Specific to application
  getAllImages(): CommonImage[] {
    return [];
  }
}

export class BaseApplicationDto {

  // Flag to indicate whether individual has read the collection agreement
  infoCollectionAgreement: boolean;

  // Authorization
  authorizedByApplicant: boolean;
  authorizedBySpouse: boolean;
  authorizedByApplicantDate: number;
}
