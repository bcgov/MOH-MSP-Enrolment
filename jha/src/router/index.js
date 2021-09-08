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
import EnrolmentFormPage from '@/views/enrolment/FormPage.vue';
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
  
  // Form A Routes.
  {
    path: enrolmentRoutes.HOME_PAGE.path,
    name: enrolmentRoutes.HOME_PAGE.name,
    component: EnrolmentHomePage
  },
  {
    path: enrolmentRoutes.FORM_PAGE.path,
    name: enrolmentRoutes.FORM_PAGE.name,
    component: EnrolmentFormPage
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
