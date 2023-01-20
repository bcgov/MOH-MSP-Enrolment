import { APP_ROUTES } from '../../models/route-constants';

const PAGE_NAMES = {
  home: 'home',
  personalInfo: 'personal-info',
  spouseInfo: 'spouse-info',
  childInfo: 'child-info',
  contactInfo: 'contact-info',
  review: 'review',
  authorize: 'authorize',
  sending: 'sending',
  confirmation: 'confirmation',
};

export const ACCOUNT_PAGES = {
  HOME: {
    path: PAGE_NAMES.home,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.home}`,
    title: 'Home - MSP Account Change Request',
  },
  PERSONAL_INFO: {
    path: PAGE_NAMES.personalInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.personalInfo}`,
    title: 'Personal Info - MSP Account Change Request',
  },
  SPOUSE_INFO: {
    path: PAGE_NAMES.spouseInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.spouseInfo}`,
    title: 'Spouse Info - MSP Account Change Request',
  },
  CHILD_INFO: {
    path: PAGE_NAMES.childInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.childInfo}`,
    title: 'Child Info - MSP Account Change Request',
  },
  CONTACT_INFO: {
    path: PAGE_NAMES.contactInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.contactInfo}`,
    title: 'Contact Info - MSP Account Change Request',
  },
  REVIEW: {
    path: PAGE_NAMES.review,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.review}`,
    title: 'Review - MSP Account Change Request',
  },
  AUTHORIZE: {
    path: PAGE_NAMES.authorize,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.authorize}`,
    title: 'Authorize - MSP Account Change Request',
  },
  SENDING: {
    path: PAGE_NAMES.sending,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.sending}`,
    title: 'Sending - MSP Account Change Request',
  },
  CONFIRMATION: {
    path: PAGE_NAMES.confirmation,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.confirmation}`,
    title: 'Confirmation - MSP Account Change Request',
  },
};
