export const ENROLMENT_BASE_URL = '/enrolment';

export const enrolmentRoutes = {
  HOME_PAGE: {
    path: ENROLMENT_BASE_URL,
    title: 'Home',
    name: 'EnrolmentHomePage',
  },
  FORM_PAGE: {
    path: ENROLMENT_BASE_URL + '/form',
    title: 'Form',
    name: 'EnrolmentFormPage',
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

export const formARouteStepOrder = [
  enrolmentRoutes.HOME_PAGE,
  enrolmentRoutes.FORM_PAGE,
  enrolmentRoutes.REVIEW_PAGE,
  enrolmentRoutes.SUBMISSION_PAGE
];

export const isPastPath = (toPath, fromPath) => {
  let stepRoutes = [];

  if (toPath.includes(ENROLMENT_BASE_URL + '/')) {
    stepRoutes = formARouteStepOrder;
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
