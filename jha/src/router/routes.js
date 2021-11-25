export const enrolmentRoutes = {
  HOME_PAGE: {
    path: '/',
    title: 'Home',
    name: 'HomePage',
  },
  MSP_ELIGIBILITY_PAGE: {
    path: '/msp-eligibility',
    title: 'MSP Eligibility',
    name: 'MSPEligibilityPage',
  },
  FPCARE_ELIGIBILITY_PAGE: {
    path: '/fpcare-eligibility',
    title: 'Fair PharmaCare Eligibility',
    name: 'FPCareEligibilityPage',
  },
  SUPP_BEN_ELIGIBILITY_PAGE: {
    path: '/supp-ben-eligibility',
    title: 'Supplimentary Benefits Eligibility',
    name: 'SuppBenligibilityPage',
  },
  FORM_SELECTION_PAGE: {
    path: '/form-selection',
    title: 'JHA Selection',
    name: 'FormSelectionPage',
  },
  PERSONAL_INFO_PAGE: {
    path: '/personal-info',
    title: 'Acct. Holder',
    name: 'PersonalInfoPage',
  },
  SPOUSE_INFO_PAGE: {
    path: '/spouse-info',
    title: 'Spouse',
    name: 'SpouseInfoPage',
  },
  CHILD_INFO_PAGE: {
    path: '/child-info',
    title: 'Children',
    name: 'ChildInfoPage',
  },
  CONTACT_INFO_PAGE: {
    path: '/contact-info',
    title: 'Contact Info',
    name: 'ContactInfoPage',
  },
  FPCARE_INFO_PAGE: {
    path: '/fpcare-info',
    title: 'F PCare Info',
    name: 'FPCareInfoPage',
  },
  SUPP_BEN_INFO_PAGE: {
    path: '/supp-ben-info',
    title: 'Supp Ben Info',
    name: 'SuppBenInfoPage',
  },
  DOCUMENTS_PAGE: {
    path: '/documents',
    title: 'Documents',
    name: 'DocumentsPage',
  },
  REVIEW_PAGE: {
    path: '/review',
    title: 'Review',
    name: 'ReviewPage',
  },
  SUBMISSION_PAGE: {
    path: '/submission',
    title: 'Submission',
    name: 'SubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: '/submission-error',
    title: 'Submission error',
    name: 'SubmissionErrorPage',
  },
};

export const commonRoutes = {
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

export const enrolmentRouteStepOrder = [
  enrolmentRoutes.MSP_ELIGIBILITY_PAGE,
  enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE,
  enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE,
  enrolmentRoutes.FORM_SELECTION_PAGE,
  enrolmentRoutes.PERSONAL_INFO_PAGE,
  enrolmentRoutes.SPOUSE_INFO_PAGE,
  enrolmentRoutes.CHILD_INFO_PAGE,
  enrolmentRoutes.CONTACT_INFO_PAGE,
  enrolmentRoutes.FPCARE_INFO_PAGE,
  enrolmentRoutes.SUPP_BEN_INFO_PAGE,
  enrolmentRoutes.DOCUMENTS_PAGE,
  enrolmentRoutes.REVIEW_PAGE,
  enrolmentRoutes.SUBMISSION_PAGE
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
