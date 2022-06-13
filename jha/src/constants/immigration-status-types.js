export const StatusInCanada = {
  Citizen: 'Canadian Citizen',
  PermanentResident: 'Permanent Resident',
  TemporaryResident: 'Temporary Permit Holder or Diplomat'
};

export const CanadianStatusReasons = {
  LivingInBCWithoutMSP: 'Not new to B.C. but need to apply for MSP',
  MovingFromProvince: 'Moved to B.C. from another province',
  MovingFromCountry: 'Moved to B.C. from another jurisdiction',
  WorkingInBC: 'Work Permit / CUAET',
  StudyingInBC: 'Study Permit',
  ReligiousWorker: 'Religious Worker',
  Diplomat: 'Diplomat',
  Visiting: 'Visitor Permit'
};

// Types sent to the middleware as "citizenshipType".
export const CitizenshipType = {
  CanadianCitizen: 'CanadianCitizen',
  Diplomat: 'Diplomat',
  PermanentResident: 'PermanentResident',
  ReligiousWorker: 'ReligiousWorker',
  StudyPermit: 'StudyPermit',
  VisitorPermit: 'VisitorPermit',
  WorkPermit: 'WorkPermit'
};

export const getCitizenshipType = (statusInCanada, canadianStatusReason) => {
  switch (statusInCanada) {
    case StatusInCanada.Citizen:
      return CitizenshipType.CanadianCitizen;
    case StatusInCanada.PermanentResident:
      return CitizenshipType.PermanentResident;
    case StatusInCanada.TemporaryResident:
      if (canadianStatusReason === CanadianStatusReasons.Diplomat) {
        return CitizenshipType.Diplomat;
      } else if (canadianStatusReason === CanadianStatusReasons.ReligiousWorker) {
        return CitizenshipType.ReligiousWorker;
      } else if (canadianStatusReason === CanadianStatusReasons.StudyingInBC) {
        return CitizenshipType.StudyPermit;
      } else if (canadianStatusReason === CanadianStatusReasons.Visiting) {
        return CitizenshipType.VisitorPermit;
      } else if (canadianStatusReason === CanadianStatusReasons.WorkingInBC) {
        return CitizenshipType.WorkPermit;
      } else {
        return null;
      }
    default:
      return null;
  }
};
