import * as Primitive from './xml-primitives';
import * as ct from './commonTypes';

interface BaseType {
  _exists: boolean;
  _namespace: string;
  _sequence: Array<string>;
}

// tslint:disable-next-line:class-name
interface _AccountLetterType extends BaseType {
  requesterPHN: string;
  requesterBirthdate: string;
  requesterPostalCode: string;
  letterSelection: string;
  specificPHN: string;
  aclTransactionId: string;
  valid: string;
  errorCode: string;
  errorMessage: string;
}

export interface AccountLetterType extends _AccountLetterType {
  constructor: { new (): AccountLetterType };
}
export let AccountLetterType: { new (): AccountLetterType };

export class AccountLetterApplicantTypeFactory {
  static make(): AccountLetterType {
    const instance = <AccountLetterType>{};
    return instance;
  }
}
