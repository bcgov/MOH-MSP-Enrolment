import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  FORM_A_BASE_URL,
  formARoutes,
  commonRoutes,
} from './routes';
import pageStateService from '@/services/page-state-service';
import LandingPage from '@/views/LandingPage.vue';
import FormAHomePage from '@/views/form-a/HomePage.vue';
import FormAFormPage from '@/views/form-a/FormPage.vue';
import FormAReviewPage from '@/views/form-a/ReviewPage.vue';
import FormASubmissionPage from '@/views/form-a/SubmissionPage.vue';
import FormASubmissionErrorPage from '@/views/form-a/SubmissionErrorPage.vue';
import MaintenancePage from '@/views/MaintenancePage.vue';
import PageNotFoundPage from '@/views/PageNotFoundPage.vue';

Vue.use(VueRouter);

pageStateService.importPageRoutes(commonRoutes);
pageStateService.importPageRoutes(formARoutes);

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
    path: formARoutes.HOME_PAGE.path,
    name: formARoutes.HOME_PAGE.name,
    component: FormAHomePage
  },
  {
    path: formARoutes.FORM_PAGE.path,
    name: formARoutes.FORM_PAGE.name,
    component: FormAFormPage
  },
  {
    path: formARoutes.REVIEW_PAGE.path,
    name: formARoutes.REVIEW_PAGE.name,
    component: FormAReviewPage
  },
  {
    path: formARoutes.SUBMISSION_PAGE.path,
    name: formARoutes.SUBMISSION_PAGE.name,
    component: FormASubmissionPage
  },
  {
    path: formARoutes.SUBMISSION_ERROR_PAGE.path,
    name: formARoutes.SUBMISSION_ERROR_PAGE.name,
    component: FormASubmissionErrorPage
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeCollection
});

router.beforeEach((to, from, next) => {
  // Home redirects.
  if (to.path.includes(FORM_A_BASE_URL + '/')
    && to.path !== formARoutes.HOME_PAGE.path
    && !pageStateService.isPageVisited(to.path)) {
    next({ name: formARoutes.HOME_PAGE.name });
  }
  
  // Catch-all (navigation).
  else {
    next();
  }
});

export default router;
