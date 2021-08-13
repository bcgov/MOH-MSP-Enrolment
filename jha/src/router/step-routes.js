import {
  payPatientRoutes,
  payPatientCSRRoutes,
  payPractitionerRoutes,
  payPractitionerCSRRoutes
} from './routes';

export const payPatientStepRoutes = [
  {...payPatientRoutes.CLAIM_COUNT_PAGE},
  {...payPatientRoutes.MAIN_FORM_PAGE},
  {...payPatientRoutes.REVIEW_PAGE},
];

export const payPractitionerStepRoutes = [
  {...payPractitionerRoutes.CLAIM_COUNT_PAGE},
  {...payPractitionerRoutes.MAIN_FORM_PAGE},
  {...payPractitionerRoutes.REVIEW_PAGE},
];

export const payPatientCSRStepRoutes = [
  {...payPatientCSRRoutes.CLAIM_COUNT_PAGE},
  {...payPatientCSRRoutes.MAIN_FORM_PAGE},
  {...payPatientCSRRoutes.REVIEW_PAGE},
];

export const payPractitionerCSRStepRoutes = [
  {...payPractitionerCSRRoutes.CLAIM_COUNT_PAGE},
  {...payPractitionerCSRRoutes.MAIN_FORM_PAGE},
  {...payPractitionerCSRRoutes.REVIEW_PAGE},
];
