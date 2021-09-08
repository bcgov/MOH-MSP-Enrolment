import {
  enrolmentRoutes
} from './routes';

export const enrolmentStepRoutes = [
  {...enrolmentRoutes.ELIGIBILITY_PAGE},
  {...enrolmentRoutes.PERSONAL_INFO_PAGE},
  {...enrolmentRoutes.SPOUSE_INFO_PAGE},
  {...enrolmentRoutes.CHILD_INFO_PAGE},
  {...enrolmentRoutes.CONTACT_INFO_PAGE},
  {...enrolmentRoutes.REVIEW_PAGE},
];
