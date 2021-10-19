import { CanadianStatusReasons } from './immigration-status-types'

export const radioOptionsCitizenStatusReasons = [
  {
    id: 'not-new',
    label: CanadianStatusReasons.LivingInBCWithoutMSP,
    value: CanadianStatusReasons.LivingInBCWithoutMSP,
  },
  {
    id: 'new-to-province',
    label: CanadianStatusReasons.MovingFromProvince,
    value: CanadianStatusReasons.MovingFromProvince,
  },
  {
    id: 'new-to-country',
    label: CanadianStatusReasons.MovingFromCountry,
    value: CanadianStatusReasons.MovingFromCountry,
  }
];

export const radioOptionsTemporaryResidentStatusReasons = [
  {
    id: 'working-permit',
    label: CanadianStatusReasons.WorkingInBC,
    value: CanadianStatusReasons.WorkingInBC,
  },
  {
    id: 'study-permit',
    label: CanadianStatusReasons.StudyingInBC,
    value: CanadianStatusReasons.StudyingInBC,
  },
  {
    id: 'religious-worker',
    label: CanadianStatusReasons.ReligiousWorker,
    value: CanadianStatusReasons.ReligiousWorker,
  },
  {
    id: 'diplomatic-foil',
    label: CanadianStatusReasons.Diplomat,
    value: CanadianStatusReasons.Diplomat,
  },
  {
    id: 'visitor-permit',
    label: CanadianStatusReasons.Visiting,
    value: CanadianStatusReasons.Visiting,
  }
];

export const radioOptionsGender = [
  {
    id: 'male',
    label: 'Male',
    value: 'M',
  },
  {
    id: 'female',
    label: 'Female',
    value: 'F',
  }
];

export const radioOptionsNoYes = [
  {
    id: 'no',
    label: 'No',
    value: 'N',
  },
  {
    id: 'yes',
    label: 'Yes',
    value: 'Y',
  }
]
