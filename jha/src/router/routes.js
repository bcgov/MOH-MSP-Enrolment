export const enrolmentRoutes = {
  HOME_PAGE: {
    path: '/',
    title: 'Home',
    name: 'HomePage',
    pageTitle: 'Home | AHDC'
  },
  MSP_ELIGIBILITY_PAGE: {
    path: '/msp-eligibility',
    title: 'MSP Enrolment',
    name: 'MSPEligibilityPage',
    pageTitle: 'MSP Eligibility | AHDC'
  },
  FPCARE_ELIGIBILITY_PAGE: {
    path: '/fpcare-eligibility',
    title: 'Fair PharmaCare',
    name: 'FPCareEligibilityPage',
    pageTitle: 'FPCare Eligibility | AHDC'
  },
  SUPP_BEN_ELIGIBILITY_PAGE: {
    path: '/supp-ben-eligibility',
    title: 'Supplementary Benefits',
    name: 'SuppBenligibilityPage',
    pageTitle: 'Supplementary Benefits Eligibility | AHDC'
  },
  FORM_SELECTION_PAGE: {
    path: '/form-selection',
    title: 'Select Programs',
    name: 'FormSelectionPage',
    pageTitle: 'Select Programs | AHDC'
  },
  PERSONAL_INFO_PAGE: {
    path: '/personal-info',
    title: 'Acct. Holder',
    name: 'PersonalInfoPage',
    pageTitle: 'Personal Info | AHDC'
  },
  SPOUSE_INFO_PAGE: {
    path: '/spouse-info',
    title: 'Spouse',
    name: 'SpouseInfoPage',
    pageTitle: 'Spouse Info | AHDC'
  },
  CHILD_INFO_PAGE: {
    path: '/child-info',
    title: 'Child',
    name: 'ChildInfoPage',
    pageTitle: 'Child Info | AHDC'
  },
  CONTACT_INFO_PAGE: {
    path: '/contact-info',
    title: 'Contact Info',
    name: 'ContactInfoPage',
    pageTitle: 'Contact Info | AHDC'
  },
  FPCARE_INFO_PAGE: {
    path: '/fpcare-info',
    title: 'F PCare Info',
    name: 'FPCareInfoPage',
    pageTitle: 'FPCare Info | AHDC'
  },
  SUPP_BEN_INFO_PAGE: {
    path: '/supp-ben-info',
    title: 'Supp Ben Info',
    name: 'SuppBenInfoPage',
    pageTitle: 'Supplementary Benefits Info | AHDC'
  },
  DOCUMENTS_PAGE: {
    path: '/documents',
    title: 'Documents',
    name: 'DocumentsPage',
    pageTitle: 'Documents | AHDC'
  },
  REVIEW_PAGE: {
    path: '/review',
    title: 'Review',
    name: 'ReviewPage',
    pageTitle: 'Review | AHDC'
  },
  CONSENT_PAGE: {
    path: '/declaration-and-consent',
    title: 'Submit',
    name: 'ConsentPage',
    pageTitle: 'Consent | AHDC'
  },
  SUBMISSION_PAGE: {
    path: '/submission',
    title: 'Submit',
    name: 'SubmissionPage',
    pageTitle: 'Submission | AHDC'
  },
  SUBMISSION_ERROR_PAGE: {
    path: '/submission-error',
    title: 'Submission error',
    name: 'SubmissionErrorPage',
    pageTitle: 'Error | AHDC'
  },
};

export const commonRoutes = {
  MAINTENANCE_PAGE: {
    path: '/maintenance',
    title: 'Maintenance',
    name: 'MaintenancePage',
    pageTitle: 'Maintenance | AHDC'
  },
  PAGE_NOT_FOUND_PAGE: {
    path: '*',
    title: 'Page not found',
    name: 'PageNotFoundPage',
    pageTitle: '404 | AHDC'
  }
};

export const enrolmentRouteStepOrder = [
  enrolmentRoutes.MSP_ELIGIBILITY_PAGE,
  enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE,
  enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE,
  enrolmentRoutes.FORM_SELECTION_PAGE,
  enrolmentRoutes.PERSONAL_INFO_PAGE,
  enrolmentRoutes.SPOUSE_INFO_PAGE,
  enrolmentRoutes.CHILD_INFO_PAGE,
  enrolmentRoutes.FPCARE_INFO_PAGE,
  enrolmentRoutes.SUPP_BEN_INFO_PAGE,
  enrolmentRoutes.DOCUMENTS_PAGE,
  enrolmentRoutes.CONTACT_INFO_PAGE,
  enrolmentRoutes.REVIEW_PAGE,
  enrolmentRoutes.CONSENT_PAGE,
  enrolmentRoutes.SUBMISSION_PAGE
];

const eqRoutes = [
  enrolmentRoutes.MSP_ELIGIBILITY_PAGE,
  enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE,
  enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE,
  enrolmentRoutes.FORM_SELECTION_PAGE
];

export const isPastPath = (toPath, fromPath) => {
  let stepRoutes = [];

  stepRoutes = enrolmentRouteStepOrder;

  for (let i=0; i<stepRoutes.length; i++) {
    if (stepRoutes[i].path === fromPath) {
      return false;
    } else if (stepRoutes[i].path === toPath) {
      return true;
    }
  }
  return false;
};

export const isEQPath = (path) => {
  const eqRoute = eqRoutes.find((route) => route.path === path);
  return !!eqRoute;
}
