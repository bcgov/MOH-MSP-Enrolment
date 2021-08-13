export const FORM_A_BASE_URL = '/form-a';

export const formARoutes = {
  HOME_PAGE: {
    path: FORM_A_BASE_URL,
    title: 'Home',
    name: 'FormAHomePage',
  },
  FORM_PAGE: {
    path: FORM_A_BASE_URL + '/form',
    title: 'Form',
    name: 'FormAFormPage',
  },
  REVIEW_PAGE: {
    path: FORM_A_BASE_URL + '/review',
    title: 'Review',
    name: 'FormAReviewPage',
  },
  SUBMISSION_PAGE: {
    path: FORM_A_BASE_URL + '/submission',
    title: 'Submission',
    name: 'FormASubmissionPage',
  },
  SUBMISSION_ERROR_PAGE: {
    path: FORM_A_BASE_URL + '/submission-error',
    title: 'Submission error',
    name: 'FormASubmissionErrorPage',
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
  formARoutes.HOME_PAGE,
  formARoutes.FORM_PAGE,
  formARoutes.REVIEW_PAGE,
  formARoutes.SUBMISSION_PAGE
];

export const isPastPath = (toPath, fromPath) => {
  let stepRoutes = [];

  if (toPath.includes(FORM_A_BASE_URL + '/')) {
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
