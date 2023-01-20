import * as Primitive from './xml-primitives';

// Source files:
// https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd/ResponseTypes.xsd

interface BaseType {
  _exists: boolean;
  _namespace: string;
}
// tslint:disable-next-line: class-name
interface _ResponseType extends BaseType {
  errorMessage?: string;
  referenceNumber?: number;
  status: string;
}
export interface ResponseType extends _ResponseType {
  constructor: { new (): ResponseType };
}
export let ResponseType: { new (): ResponseType };

// tslint:disable-next-line: class-name
export interface document extends BaseType {
  response: ResponseType;
}
export let document: document;
