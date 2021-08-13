export const PAY_PATIENT_BASE_URL = '/pay-patient';
export const PAY_PATIENT_CSR_BASE_URL = '/pay-patient-csr';
export const PAY_PRACTITIONER_BASE_URL = '/pay-practitioner';
export const PAY_PRACTITIONER_CSR_BASE_URL = '/pay-practitioner-csr';

export const payPatientRoutes = {
  HOME_PAGE: {
    path: PAY_PATIENT_BASE_URL,
    title: 'Home',
    name: 'PayPatientHomePage',
  },
  CLAIM_COUNT_PAGE: {
    path: PAY_PATIENT_BASE_URL + '/claim-count',
    title: 'Number of claims',
    name: 'PayPatientClaimCountPage',
  },
  MAIN_FORM_PAGE: {
    path: PAY_PATIENT_BASE_URL + '/main-form',
    title: 'Form',
    name: 'PayPatientMainFormPage',
  },
  REVIEW_PAGE: {
    path: PAY_PATIENT_BASE_URL + '/review',
    title: 'Review',
    name: 'PayPatientReviewPage',
  },
  SUBMISSION_PAGE: {
    path: PAY_PATIENT_BASE_URL + '/submission',
    title: 'Submission',
    name: 'PayPatientSubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: PAY_PATIENT_BASE_URL + '/submission-error',
    title: 'Submission error',
    name: 'PayPatientSubmissionErrorPage',
  },
};

export const payPatientCSRRoutes = {
  HOME_PAGE: {
    path: PAY_PATIENT_CSR_BASE_URL,
    title: 'Home',
    name: 'PayPatientCSRHomePage',
  },
  CLAIM_COUNT_PAGE: {
    path: PAY_PATIENT_CSR_BASE_URL + '/claim-count',
    title: 'Number of claims',
    name: 'PayPatientCSRClaimCountPage',
  },
  MAIN_FORM_PAGE: {
    path: PAY_PATIENT_CSR_BASE_URL + '/main-form',
    title: 'Form',
    name: 'PayPatientCSRMainFormPage',
  },
  REVIEW_PAGE: {
    path: PAY_PATIENT_CSR_BASE_URL + '/review',
    title: 'Review',
    name: 'PayPatientCSRReviewPage',
  },
  SUBMISSION_PAGE: {
    path: PAY_PATIENT_CSR_BASE_URL + '/submission',
    title: 'Submission',
    name: 'PayPatientCSRSubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: PAY_PATIENT_CSR_BASE_URL + '/submission-error',
    title: 'Submission error',
    name: 'PayPatientCSRSubmissionErrorPage',
  },
};

export const payPractitionerRoutes = {
  HOME_PAGE: {
    path: PAY_PRACTITIONER_BASE_URL,
    title: 'Home',
    name: 'PayPractitionerHomePage',
  },
  CLAIM_COUNT_PAGE: {
    path: PAY_PRACTITIONER_BASE_URL + '/claim-count',
    title: 'Number of claims',
    name: 'PayPractitionerClaimCountPage',
  },
  MAIN_FORM_PAGE: {
    path: PAY_PRACTITIONER_BASE_URL + '/main-form',
    title: 'Form',
    name: 'PayPractitionerMainFormPage',
  },
  REVIEW_PAGE: {
    path: PAY_PRACTITIONER_BASE_URL + '/review',
    title: 'Review',
    name: 'PayPractitionerReviewPage',
  },
  SUBMISSION_PAGE: {
    path: PAY_PRACTITIONER_BASE_URL + '/submission',
    title: 'Submission',
    name: 'PayPractitionerSubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: PAY_PRACTITIONER_BASE_URL + '/submission-error',
    title: 'Submission error',
    name: 'PayPractitionerSubmissionErrorPage',
  },
};

export const payPractitionerCSRRoutes = {
  HOME_PAGE: {
    path: PAY_PRACTITIONER_CSR_BASE_URL,
    title: 'Home',
    name: 'PayPractitionerCSRHomePage',
  },
  CLAIM_COUNT_PAGE: {
    path: PAY_PRACTITIONER_CSR_BASE_URL + '/claim-count',
    title: 'Number of claims',
    name: 'PayPractitionerCSRClaimCountPage',
  },
  MAIN_FORM_PAGE: {
    path: PAY_PRACTITIONER_CSR_BASE_URL + '/main-form',
    title: 'Form',
    name: 'PayPractitionerCSRMainFormPage',
  },
  REVIEW_PAGE: {
    path: PAY_PRACTITIONER_CSR_BASE_URL + '/review',
    title: 'Review',
    name: 'PayPractitionerCSRReviewPage',
  },
  SUBMISSION_PAGE: {
    path: PAY_PRACTITIONER_CSR_BASE_URL + '/submission',
    title: 'Submission',
    name: 'PayPractitionerCSRSubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: PAY_PRACTITIONER_CSR_BASE_URL + '/submission-error',
    title: 'Submission error',
    name: 'PayPractitionerCSRSubmissionErrorPage',
  },
};

export const commonRoutes = {
  LANDING_PAGE: {
    path: '/',
    title: 'Landing page',
    name: 'LandingPage'
  },
  MAINTENANCE_PAGE: {
    path: '/maintenance',
    title: 'Maintenance',
    name: 'MaintenancePage'
  },
  PAGE_NOT_FOUND_PAGE: {
    path: '*',
    title: 'Page not found',
    name: 'PageNotFoundPage'
  }
};

export const payPatientRouteStepOrder = [
  payPatientRoutes.HOME_PAGE,
  payPatientRoutes.CLAIM_COUNT_PAGE,
  payPatientRoutes.MAIN_FORM_PAGE,
  payPatientRoutes.REVIEW_PAGE,
  payPatientRoutes.SUBMISSION_PAGE
];

export const payPractitionerRouteStepOrder = [
  payPractitionerRoutes.HOME_PAGE,
  payPractitionerRoutes.CLAIM_COUNT_PAGE,
  payPractitionerRoutes.MAIN_FORM_PAGE,
  payPractitionerRoutes.REVIEW_PAGE,
  payPractitionerRoutes.SUBMISSION_PAGE
];

export const payPatientCSRRouteStepOrder = [
  payPatientCSRRoutes.HOME_PAGE,
  payPatientCSRRoutes.CLAIM_COUNT_PAGE,
  payPatientCSRRoutes.MAIN_FORM_PAGE,
  payPatientCSRRoutes.REVIEW_PAGE,
  payPatientCSRRoutes.SUBMISSION_PAGE
];

export const payPractitionerCSRRouteStepOrder = [
  payPractitionerCSRRoutes.HOME_PAGE,
  payPractitionerCSRRoutes.CLAIM_COUNT_PAGE,
  payPractitionerCSRRoutes.MAIN_FORM_PAGE,
  payPractitionerCSRRoutes.REVIEW_PAGE,
  payPractitionerCSRRoutes.SUBMISSION_PAGE
];

export const isPastPath = (toPath, fromPath) => {
  let stepRoutes = [];

  if (toPath.includes(PAY_PATIENT_BASE_URL + '/')) {
    stepRoutes = payPatientRouteStepOrder;
  } else if (toPath.includes(PAY_PRACTITIONER_BASE_URL + '/')) {
    stepRoutes = payPractitionerRouteStepOrder;
  } else if (toPath.includes(PAY_PATIENT_CSR_BASE_URL)) {
    stepRoutes = payPatientCSRRouteStepOrder;
  } else if (toPath.includes(PAY_PRACTITIONER_CSR_BASE_URL)) {
    stepRoutes = payPractitionerCSRRouteStepOrder;
  }

  for (let i=0; i<stepRoutes.length; i++) {
    if (stepRoutes[i].path === fromPath) {
      return false;
    } else if (stepRoutes[i].path === toPath) {
      return true;
    }
  }
  return false;
}
