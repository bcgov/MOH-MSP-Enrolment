import Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import {
  enrolmentRoutes,
  commonRoutes,
} from './routes';
import pageStateService from '@/services/page-state-service';
import FormSelectionPage from '@/views/enrolment/FormSelectionPage.vue';
import MSPEligibilityPage from '@/views/enrolment/MSPEligibilityPage.vue';
import FPCareEligibilityPage from '@/views/enrolment/FPCareEligibilityPage.vue';
import SuppBenEligibilityPage from '@/views/enrolment/SuppBenEligibilityPage.vue';
import PersonalInfoPage from '@/views/enrolment/PersonalInfoPage.vue';
import SpouseInfoPage from '@/views/enrolment/SpouseInfoPage.vue';
import ChildInfoPage from '@/views/enrolment/ChildInfoPage.vue';
import ContactInfoPage from '@/views/enrolment/ContactInfoPage.vue';
import FPCareInfoPage from '@/views/enrolment/FPCareInfoPage.vue';
import SuppBenInfoPage from '@/views/enrolment/SuppBenInfoPage.vue';
import DocumentsPage from '@/views/enrolment/DocumentsPage.vue';
import ReviewPage from '@/views/enrolment/ReviewPage.vue';
import ConsentPage from '@/views/enrolment/ConsentPage.vue';
import SubmissionPage from '@/views/enrolment/SubmissionPage.vue';
import SubmissionErrorPage from '@/views/enrolment/SubmissionErrorPage.vue';
import MaintenancePage from '@/views/MaintenancePage.vue';
import PageNotFoundPage from '@/views/PageNotFoundPage.vue';

pageStateService.importPageRoutes(commonRoutes);
pageStateService.importPageRoutes(enrolmentRoutes);

const routeCollection = [
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
    redirect: () => {
      const path = enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path;
      pageStateService.setPageComplete(path);
      pageStateService.visitPage(path);
      return path;
    }
  },
  {
    path: enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.MSP_ELIGIBILITY_PAGE.name,
    component: MSPEligibilityPage
  },
  {
    path: enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.name,
    component: FPCareEligibilityPage
  },
  {
    path: enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.name,
    component: SuppBenEligibilityPage
  },
  {
    path: enrolmentRoutes.FORM_SELECTION_PAGE.path,
    name: enrolmentRoutes.FORM_SELECTION_PAGE.name,
    component: FormSelectionPage
  },
  {
    path: enrolmentRoutes.PERSONAL_INFO_PAGE.path,
    name: enrolmentRoutes.PERSONAL_INFO_PAGE.name,
    component: PersonalInfoPage
  },
  {
    path: enrolmentRoutes.SPOUSE_INFO_PAGE.path,
    name: enrolmentRoutes.SPOUSE_INFO_PAGE.name,
    component: SpouseInfoPage
  },
  {
    path: enrolmentRoutes.CHILD_INFO_PAGE.path,
    name: enrolmentRoutes.CHILD_INFO_PAGE.name,
    component: ChildInfoPage
  },
  {
    path: enrolmentRoutes.CONTACT_INFO_PAGE.path,
    name: enrolmentRoutes.CONTACT_INFO_PAGE.name,
    component: ContactInfoPage
  },
  {
    path: enrolmentRoutes.FPCARE_INFO_PAGE.path,
    name: enrolmentRoutes.FPCARE_INFO_PAGE.name,
    component: FPCareInfoPage
  },
  {
    path: enrolmentRoutes.SUPP_BEN_INFO_PAGE.path,
    name: enrolmentRoutes.SUPP_BEN_INFO_PAGE.name,
    component: SuppBenInfoPage
  },
  {
    path: enrolmentRoutes.DOCUMENTS_PAGE.path,
    name: enrolmentRoutes.DOCUMENTS_PAGE.name,
    component: DocumentsPage
  },
  {
    path: enrolmentRoutes.REVIEW_PAGE.path,
    name: enrolmentRoutes.REVIEW_PAGE.name,
    component: ReviewPage
  },
  {
    path: enrolmentRoutes.CONSENT_PAGE.path,
    name: enrolmentRoutes.CONSENT_PAGE.name,
    component: ConsentPage
  },
  {
    path: enrolmentRoutes.SUBMISSION_PAGE.path,
    name: enrolmentRoutes.SUBMISSION_PAGE.name,
    component: SubmissionPage
  },
  {
    path: enrolmentRoutes.SUBMISSION_ERROR_PAGE.path,
    name: enrolmentRoutes.SUBMISSION_ERROR_PAGE.name,
    component: SubmissionErrorPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  base: process.env.BASE_URL,
  routes: routeCollection
});

router.beforeEach((to, from, next) => {
  // Home redirects.
  if (to.path !== enrolmentRoutes.HOME_PAGE.path
    && !pageStateService.isPageVisited(to.path)) {
    next({ name: enrolmentRoutes.HOME_PAGE.name });
  }
  
  // Catch-all (navigation).
  else {
    next();
  }
});

export default router;
