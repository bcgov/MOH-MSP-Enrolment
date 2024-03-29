import { Relationship } from '../../../models/relationship.enum';

/**
 * Various statuses in Canada
 */
export enum StatusInCanada {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident
}

export enum statusInCanadaStrings {
  'Canadian citizen',
  'Permanent resident',
  'Temporary permit holder or diplomat'
}

/**
 * Dropdown selections associated with StatusInCanada enums
 */
export const CanadianStatusStrings = {
  CitizenAdult: 'Canadian Citizen',
  PermanentResident: 'Permanent Resident',
  TemporaryResident: 'Temporary Permit Holder or Diplomat'
};

/**
 * Reasons for returning to Canada
 */
export enum CanadianStatusReason {
  LivingInBCWithoutMSP,
  MovingFromProvince,
  MovingFromCountry,
  WorkingInBC,
  StudyingInBC,
  ReligiousWorker,
  Diplomat,
  Visiting
}

/**
 * Dropdown selections associated with reasons for return to Canada enums
 */
export const CanadianStatusReasonStrings = {
  LivingInBCWithoutMSP: 'Not new to B.C. but needs to apply for MSP',
  MovingFromProvince: 'Moved to B.C. from another province',
  MovingFromCountry: 'Moved to B.C. from another jurisdiction',
  WorkingInBC: 'Work Permit / CUAET',
  StudyingInBC: 'Study Permit',
  ReligiousWorker: 'Religious Worker',
  Diplomat: 'Diplomat',
  Visiting: 'Visitor Permit'
};


/**
 * Business rules for activities
 *
 * Refactored from 'ActivityRules' to 'CanadianStatusRules'.
 */
export class CanadianStatusRules {
  static statusesForRelationship(relationship: Relationship, status: StatusInCanada): CanadianStatusReason[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
      case StatusInCanada.PermanentResident:
        if (relationship === Relationship.Child19To24 ||
            relationship === Relationship.ChildUnder19 || relationship === Relationship.ChildUnder24) {
          return [CanadianStatusReason.MovingFromProvince, CanadianStatusReason.MovingFromCountry, CanadianStatusReason.LivingInBCWithoutMSP];
        } else {
          return [CanadianStatusReason.MovingFromProvince, CanadianStatusReason.MovingFromCountry, CanadianStatusReason.LivingInBCWithoutMSP];
        }
      case StatusInCanada.TemporaryResident:
        if (relationship === Relationship.Applicant) {
          return [CanadianStatusReason.WorkingInBC, CanadianStatusReason.StudyingInBC, CanadianStatusReason.ReligiousWorker,
            CanadianStatusReason.Diplomat];
        } else {
          return [CanadianStatusReason.WorkingInBC, CanadianStatusReason.StudyingInBC, CanadianStatusReason.ReligiousWorker,
            CanadianStatusReason.Diplomat, CanadianStatusReason.Visiting];
        }
    }
  }
}
