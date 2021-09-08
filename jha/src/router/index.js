import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  ENROLMENT_BASE_URL,
  enrolmentRoutes,
  commonRoutes,
} from './routes';
import pageStateService from '@/services/page-state-service';
import LandingPage from '@/views/LandingPage.vue';
import EnrolmentHomePage from '@/views/enrolment/HomePage.vue';
import EnrolmentEligibilityPage from '@/views/enrolment/EligibilityPage.vue';
import EnrolmentPersonalInfoPage from '@/views/enrolment/PersonalInfoPage.vue';
import EnrolmentSpouseInfoPage from '@/views/enrolment/SpouseInfoPage.vue';
import EnrolmentChildInfoPage from '@/views/enrolment/ChildInfoPage.vue';
import EnrolmentContactInfoPage from '@/views/enrolment/ContactInfoPage.vue';
import EnrolmentReviewPage from '@/views/enrolment/ReviewPage.vue';
import EnrolmentSubmissionPage from '@/views/enrolment/SubmissionPage.vue';
import EnrolmentSubmissionErrorPage from '@/views/enrolment/SubmissionErrorPage.vue';
import MaintenancePage from '@/views/MaintenancePage.vue';
import PageNotFoundPage from '@/views/PageNotFoundPage.vue';

Vue.use(VueRouter);

pageStateService.importPageRoutes(commonRoutes);
pageStateService.importPageRoutes(enrolmentRoutes);

const routeCollection = [
  {
    path: commonRoutes.LANDING_PAGE.path,
    name: commonRoutes.LANDING_PAGE.name,
    component: LandingPage
  },
  {
    path: commonRoutes.MAINTENANCE_PAGE.path,
    name: commonRoutes.MAINTENANCE_PAGE.name,
    component: MaintenancePage
  },
  {
    path: commonRoutes.PAGE_NOT_FOUND_PAGE.path,
    name: commonRoutes.PAGE_NOT_FOUND_PAGE.name,
    component: PageNotFoundPage
  },
  
  // Enrolment routes.
  {
    path: enrolmentRoutes.HOME_PAGE.path,
    name: enrolmentRoutes.HOME_PAGE.name,
    component: EnrolmentHomePage
  },
  {
    path: enrolmentRoutes.ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.ELIGIBILITY_PAGE.name,
    component: EnrolmentEligibilityPage
  },
  {
    path: enrolmentRoutes.PERSONAL_INFO_PAGE.path,
    name: enrolmentRoutes.PERSONAL_INFO_PAGE.name,
    component: EnrolmentPersonalInfoPage
  },
  {
    path: enrolmentRoutes.SPOUSE_INFO_PAGE.path,
    name: enrolmentRoutes.SPOUSE_INFO_PAGE.name,
    component: EnrolmentSpouseInfoPage
  },
  {
    path: enrolmentRoutes.CHILD_INFO_PAGE.path,
    name: enrolmentRoutes.CHILD_INFO_PAGE.name,
    component: EnrolmentChildInfoPage
  },
  {
    path: enrolmentRoutes.CONTACT_INFO_PAGE.path,
    name: enrolmentRoutes.CONTACT_INFO_PAGE.name,
    component: EnrolmentContactInfoPage
  },
  {
    path: enrolmentRoutes.REVIEW_PAGE.path,
    name: enrolmentRoutes.REVIEW_PAGE.name,
    component: EnrolmentReviewPage
  },
  {
    path: enrolmentRoutes.SUBMISSION_PAGE.path,
    name: enrolmentRoutes.SUBMISSION_PAGE.name,
    component: EnrolmentSubmissionPage
  },
  {
    path: enrolmentRoutes.SUBMISSION_ERROR_PAGE.path,
    name: enrolmentRoutes.SUBMISSION_ERROR_PAGE.name,
    component: EnrolmentSubmissionErrorPage
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeCollection
});

router.beforeEach((to, from, next) => {
  // Home redirects.
  if (to.path.includes(ENROLMENT_BASE_URL + '/')
    && to.path !== enrolmentRoutes.HOME_PAGE.path
    && !pageStateService.isPageVisited(to.path)) {
    next({ name: enrolmentRoutes.HOME_PAGE.name });
  }
  
  // Catch-all (navigation).
  else {
    next();
  }
});

export default router;
