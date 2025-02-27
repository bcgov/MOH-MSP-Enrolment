import { CanadianStatusReasons } from "./immigration-status-types";
import { ChildAgeTypes } from "./child-age-types";

export const radioOptionsCitizenStatusReasons = [
  {
    id: "new-to-province",
    label: CanadianStatusReasons.MovingFromProvince,
    value: CanadianStatusReasons.MovingFromProvince,
  },
  {
    id: "new-to-country",
    label: CanadianStatusReasons.MovingFromCountry,
    value: CanadianStatusReasons.MovingFromCountry,
  },
  {
    id: "not-new",
    label: CanadianStatusReasons.LivingInBCWithoutMSP,
    value: CanadianStatusReasons.LivingInBCWithoutMSP,
  },
];

export const radioOptionsAHTemporaryResidentStatusReasons = [
  {
    id: "working-permit",
    label: CanadianStatusReasons.WorkingInBC,
    value: CanadianStatusReasons.WorkingInBC,
  },
  {
    id: "study-permit",
    label: CanadianStatusReasons.StudyingInBC,
    value: CanadianStatusReasons.StudyingInBC,
  },
  {
    id: "religious-worker",
    label: CanadianStatusReasons.ReligiousWorker,
    value: CanadianStatusReasons.ReligiousWorker,
  },
  {
    id: "diplomatic-foil",
    label: CanadianStatusReasons.Diplomat,
    value: CanadianStatusReasons.Diplomat,
  },
];

export const radioOptionsTemporaryResidentStatusReasons = [
  {
    id: "working-permit",
    label: CanadianStatusReasons.WorkingInBC,
    value: CanadianStatusReasons.WorkingInBC,
  },
  {
    id: "study-permit",
    label: CanadianStatusReasons.StudyingInBC,
    value: CanadianStatusReasons.StudyingInBC,
  },
  {
    id: "religious-worker",
    label: CanadianStatusReasons.ReligiousWorker,
    value: CanadianStatusReasons.ReligiousWorker,
  },
  {
    id: "diplomatic-foil",
    label: CanadianStatusReasons.Diplomat,
    value: CanadianStatusReasons.Diplomat,
  },
  {
    id: "visitor-permit",
    label: CanadianStatusReasons.Visiting,
    value: CanadianStatusReasons.Visiting,
  },
];

export const radioOptionsOverageChildTemporaryResidentStatusReasons = [
  {
    id: "working-permit",
    label: CanadianStatusReasons.WorkingInBC,
    value: CanadianStatusReasons.WorkingInBC,
  },
  {
    id: "study-permit",
    label: CanadianStatusReasons.StudyingInBC,
    value: CanadianStatusReasons.StudyingInBC,
  },
  {
    id: "diplomatic-foil",
    label: CanadianStatusReasons.Diplomat,
    value: CanadianStatusReasons.Diplomat,
  },
];

export const radioOptionsGender = [
  {
    id: "male",
    label: "Male (M)",
    value: "M",
  },
  {
    id: "female",
    label: "Female (F)",
    value: "F",
  },
  {
    id: "x",
    label: "X",
    value: "X",
  },
];

// For form inputs
export const radioOptionsNoYes = [
  {
    id: "no",
    label: "No",
    value: "N",
  },
  {
    id: "yes",
    label: "Yes",
    value: "Y",
  },
];

// For eligibility questions
export const radioOptionsYesNo = [
  {
    id: "yes",
    label: "Yes",
    value: "Y",
  },
  {
    id: "no",
    label: "No",
    value: "N",
  },
];

export const radioOptionsChildAge = [
  {
    id: "0-18",
    label: "0-18 years",
    value: ChildAgeTypes.Child0To18,
  },
  {
    id: "19-24",
    label: "19-24 years (must be a full-time student)",
    value: ChildAgeTypes.Child19To24,
  },
];
