export const ENROLMENT_BASE_URL = '/enrolment';

export const enrolmentRoutes = {
  HOME_PAGE: {
    path: ENROLMENT_BASE_URL,
    title: 'Home',
    name: 'EnrolmentHomePage',
  },
  ELIGIBILITY_PAGE: {
    path: ENROLMENT_BASE_URL + '/eligibility',
    title: 'Check Eligibility',
    name: 'EnrolmentEligibilityPage',
  },
  PERSONAL_INFO_PAGE: {
    path: ENROLMENT_BASE_URL + '/personal-info',
    title: 'Personal Info',
    name: 'EnrolmentPersonalInfoPage',
  },
  SPOUSE_INFO_PAGE: {
    path: ENROLMENT_BASE_URL + '/spouse-info',
    title: 'Spouse Info',
    name: 'EnrolmentSpouseInfoPage',
  },
  CHILD_INFO_PAGE: {
    path: ENROLMENT_BASE_URL + '/child-info',
    title: 'Child Info',
    name: 'EnrolmentChildInfoPage',
  },
  CONTACT_INFO_PAGE: {
    path: ENROLMENT_BASE_URL + '/contact-info',
    title: 'Contact Info',
    name: 'EnrolmentContactInfoPage',
  },
  REVIEW_PAGE: {
    path: ENROLMENT_BASE_URL + '/review',
    title: 'Review',
    name: 'EnrolmentReviewPage',
  },
  SUBMISSION_PAGE: {
    path: ENROLMENT_BASE_URL + '/submission',
    title: 'Submission',
    name: 'EnrolmentSubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: ENROLMENT_BASE_URL + '/submission-error',
    title: 'Submission error',
    name: 'EnrolmentSubmissionErrorPage',
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

export const enrolmentRouteStepOrder = [
  enrolmentRoutes.HOME_PAGE,
  enrolmentRoutes.ELIGIBILITY_PAGE,
  enrolmentRoutes.REVIEW_PAGE,
  enrolmentRoutes.SUBMISSION_PAGE
];

export const isPastPath = (toPath, fromPath) => {
  let stepRoutes = [];

  if (toPath.includes(ENROLMENT_BASE_URL + '/')) {
    stepRoutes = enrolmentRouteStepOrder;
  }

  for (let i=0; i<stepRoutes.length; i++) {
    if (stepRoutes[i].path === fromPath) {
      return false;
    } else if (stepRoutes[i].path === toPath) {
      return true;
    }
  }
  return false;
};
