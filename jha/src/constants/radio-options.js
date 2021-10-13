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

export const radioOptionsHasSpouse = [
  {
    id: 'no-spouse',
    label: 'No',
    value: 'N',
  },
  {
    id: 'has-spouse',
    label: 'Yes',
    value: 'Y',
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

export const radioOptionsLivedInBCSinceBirth = [
  {
    id: 'not-lived-in-bc-since',
    label: 'No',
    value: 'N',
  },
  {
    id: 'lived-in-bc-since',
    label: 'Yes',
    value: 'Y',
  }
];

export const radioOptionsPermanentMove = [
  {
    id: 'not-permanent-move',
    label: 'No',
    value: 'N',
  },
  {
    id: 'permanent-move',
    label: 'Yes',
    value: 'Y',
  }
];

export const radioOptionsOutsideBCLast12Months = [
  {
    id: 'last-twelve-months-no',
    label: 'No',
    value: 'N',
  },
  {
    id: 'last-twelve-months-yes',
    label: 'Yes',
    value: 'Y',
  }
];

export const radioOptionsHasPreviousBCHealthNumber = [
  {
    id: 'does-not-have-previous-health-number',
    label: 'No',
    value: 'N',
  },
  {
    id: 'has-previous-health-number',
    label: 'Yes',
    value: 'Y',
  }
];

export const radioOptionsReleasedFromInstitution = [
  {
    id: 'not-released',
    label: 'No',
    value: 'N',
  },
  {
    id: 'released',
    label: 'Yes',
    value: 'Y',
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
