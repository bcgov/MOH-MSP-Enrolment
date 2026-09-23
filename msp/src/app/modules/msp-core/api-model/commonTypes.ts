
// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd-flat/CommonTypes.xsd

interface BaseType {
  _exists: boolean;
  _namespace: string;
  _sequence: string[];
}

interface _AddressType extends BaseType {
  street: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  provinceOrState?: string;
}
export interface AddressType extends _AddressType {
  constructor: new () => AddressType;
}
export let AddressType: new () => AddressType;

export class AddressTypeFactory {
  static make(): AddressType {
    const instance = {} as AddressType;
    instance._sequence = [
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'postalCode',
      'provinceOrState',
      'country',
    ];
    return instance;
  }
}

interface _AttachmentUuidsType extends BaseType {
  attachmentUuid: string[];
}
export interface AttachmentUuidsType extends _AttachmentUuidsType {
  constructor: new () => AttachmentUuidsType;
}
export let AttachmentUuidsType: new () => AttachmentUuidsType;

export class AttachmentUuidsTypeFactory {
  static make(): AttachmentUuidsType {
    const instance = {} as AttachmentUuidsType;
    instance._sequence = ['attachmentUuid'];
    return instance;
  }
}

interface _BasicCitizenshipType extends BaseType {
  attachmentUuids: AttachmentUuidsType;
  citizenshipType: CitizenshipType;
}
export interface BasicCitizenshipType extends _BasicCitizenshipType {
  constructor: new () => BasicCitizenshipType;
}
export let BasicCitizenshipType: new () => BasicCitizenshipType;

export class BasicCitizenshipTypeFactory {
  static make(): BasicCitizenshipType {
    const instance = {} as BasicCitizenshipType;
    instance._sequence = ['citizenshipType', 'attachmentUuids'];
    return instance;
  }
}

export interface _BasicInfoType extends BaseType {
  attachmentUuids?: AttachmentUuidsType;
  birthDate: string;
  gender?: GenderType;
  name: NameType;
}
export interface BasicInfoType extends _BasicInfoType {
  constructor: new () => BasicInfoType;
}
export let BasicInfoType: new () => BasicInfoType;

export class BasicInfoTypeFactory {
  static make(): BasicInfoType {
    const instance = {} as BasicInfoType;
    instance._sequence = ['name', 'gender', 'birthDate', 'attachmentUuids'];
    return instance;
  }
}

export type CitizenshipType =
  | 'CanadianCitizen'
  | 'PermanentResident'
  | 'WorkPermit'
  | 'StudyPermit'
  | 'Diplomat'
  | 'ReligiousWorker'
  | 'VisitorPermit';

export type CityType = string;

export type CountryType = string;

export type GenderType = 'M' | 'F';

export type GroupNumberType = number;

interface _NameType extends BaseType {
  firstName: string;
  lastName: string;
  secondName?: string;
}
export interface NameType extends _NameType {
  constructor: new () => NameType;
}
export let NameType: new () => NameType;

export class NameTypeFactory {
  static make(): NameType {
    const instance = {} as NameType;
    instance._sequence = ['firstName', 'secondName', 'lastName'];
    return instance;
  }
}

export type PHNType = number;

export type PostalCodeType = string;

export type PrevHealthNumberType = string;

export type PrevProvinceOrCountryType = string;

export type ProvinceOrStateType = string;

export type SchoolAddressType = string;

export type InstitutionNameType = string;

export type SchoolNameType = string;

export type SINType = number;

export type SubAddressLineType = string;

export type SubNameType = string;

export type TelephoneType = number;

export type YearType = number;

export type YesOrNoType = 'Y' | 'N';

export type document = BaseType;
export let document: document;
