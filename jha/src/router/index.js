import { createRouter, createWebHistory } from "vue-router";
import { enrolmentRoutes, commonRoutes } from "./routes";
import pageStateService from "@/services/page-state-service";
import FormSelectionPage from "@/views/enrolment/FormSelectionPage.vue";
import MSPEligibilityPage from "@/views/enrolment/MSPEligibilityPage.vue";
import FPCareEligibilityPage from "@/views/enrolment/FPCareEligibilityPage.vue";
import SuppBenEligibilityPage from "@/views/enrolment/SuppBenEligibilityPage.vue";
import PersonalInfoPage from "@/views/enrolment/PersonalInfoPage.vue";
import SpouseInfoPage from "@/views/enrolment/SpouseInfoPage.vue";
import ChildInfoPage from "@/views/enrolment/ChildInfoPage.vue";
import ContactInfoPage from "@/views/enrolment/ContactInfoPage.vue";
import FPCareInfoPage from "@/views/enrolment/FPCareInfoPage.vue";
import SuppBenInfoPage from "@/views/enrolment/SuppBenInfoPage.vue";
import DocumentsPage from "@/views/enrolment/DocumentsPage.vue";
import ReviewPage from "@/views/enrolment/ReviewPage.vue";
import ConsentPage from "@/views/enrolment/ConsentPage.vue";
import SubmissionPage from "@/views/enrolment/SubmissionPage.vue";
import SubmissionErrorPage from "@/views/enrolment/SubmissionErrorPage.vue";
import MaintenancePage from "@/views/MaintenancePage.vue";
import PageNotFoundPage from "@/views/PageNotFoundPage.vue";

pageStateService.importPageRoutes(commonRoutes);
pageStateService.importPageRoutes(enrolmentRoutes);

export const routeCollection = [
  {
    path: commonRoutes.MAINTENANCE_PAGE.path,
    name: commonRoutes.MAINTENANCE_PAGE.name,
    component: MaintenancePage,
    meta: {
      title: commonRoutes.MAINTENANCE_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Maintenance page, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Maintenance page, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: commonRoutes.PAGE_NOT_FOUND_PAGE.path,
    name: commonRoutes.PAGE_NOT_FOUND_PAGE.name,
    component: PageNotFoundPage,
    meta: {
      title: commonRoutes.PAGE_NOT_FOUND_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Page not found, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Page not found, Application for Health and Drug Coverage",
        },
      ],
    },
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
    },
    meta: {
      title: enrolmentRoutes.HOME_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Home page, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Home page, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.MSP_ELIGIBILITY_PAGE.name,
    component: MSPEligibilityPage,
    meta: {
      title: enrolmentRoutes.MSP_ELIGIBILITY_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "MSP Eligbility, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "MSP Eligbility, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.name,
    component: FPCareEligibilityPage,
    meta: {
      title: enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content:
            "FPCare Eligibility, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content:
            "FPCare Eligibility, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path,
    name: enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.name,
    component: SuppBenEligibilityPage,
    meta: {
      title: enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content:
            "Supplementary Benefits Eligibility, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content:
            "Supplementary Benefits Eligibility, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.FORM_SELECTION_PAGE.path,
    name: enrolmentRoutes.FORM_SELECTION_PAGE.name,
    component: FormSelectionPage,
    meta: {
      title: enrolmentRoutes.FORM_SELECTION_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Form selection, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Form selection, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.PERSONAL_INFO_PAGE.path,
    name: enrolmentRoutes.PERSONAL_INFO_PAGE.name,
    component: PersonalInfoPage,
    meta: {
      title: enrolmentRoutes.PERSONAL_INFO_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Personal info, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Personal info, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.SPOUSE_INFO_PAGE.path,
    name: enrolmentRoutes.SPOUSE_INFO_PAGE.name,
    component: SpouseInfoPage,
    meta: {
      title: enrolmentRoutes.SPOUSE_INFO_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Spouse info, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Spouse info, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.CHILD_INFO_PAGE.path,
    name: enrolmentRoutes.CHILD_INFO_PAGE.name,
    component: ChildInfoPage,
    meta: {
      title: enrolmentRoutes.CHILD_INFO_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Child info, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Child info, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.CONTACT_INFO_PAGE.path,
    name: enrolmentRoutes.CONTACT_INFO_PAGE.name,
    component: ContactInfoPage,
    meta: {
      title: enrolmentRoutes.CONTACT_INFO_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Contact info, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Contact info, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.FPCARE_INFO_PAGE.path,
    name: enrolmentRoutes.FPCARE_INFO_PAGE.name,
    component: FPCareInfoPage,
    meta: {
      title: enrolmentRoutes.FPCARE_INFO_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content:
            "Fair PharmaCare info, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content:
            "Fair PharmaCare info, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.SUPP_BEN_INFO_PAGE.path,
    name: enrolmentRoutes.SUPP_BEN_INFO_PAGE.name,
    component: SuppBenInfoPage,
    meta: {
      title: enrolmentRoutes.SUPP_BEN_INFO_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content:
            "Supplementary Benefits info, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content:
            "Supplementary Benefits info, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.DOCUMENTS_PAGE.path,
    name: enrolmentRoutes.DOCUMENTS_PAGE.name,
    component: DocumentsPage,
    meta: {
      title: enrolmentRoutes.DOCUMENTS_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Document upload, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Document upload, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.REVIEW_PAGE.path,
    name: enrolmentRoutes.REVIEW_PAGE.name,
    component: ReviewPage,
    meta: {
      title: enrolmentRoutes.REVIEW_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Review, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Review, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.CONSENT_PAGE.path,
    name: enrolmentRoutes.CONSENT_PAGE.name,
    component: ConsentPage,
    meta: {
      title: enrolmentRoutes.CONSENT_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Consent, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Consent, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.SUBMISSION_PAGE.path,
    name: enrolmentRoutes.SUBMISSION_PAGE.name,
    component: SubmissionPage,
    meta: {
      title: enrolmentRoutes.SUBMISSION_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Submission, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Submission, Application for Health and Drug Coverage",
        },
      ],
    },
  },
  {
    path: enrolmentRoutes.SUBMISSION_ERROR_PAGE.path,
    name: enrolmentRoutes.SUBMISSION_ERROR_PAGE.name,
    component: SubmissionErrorPage,
    meta: {
      title: enrolmentRoutes.SUBMISSION_ERROR_PAGE.pageTitle,
      metaTags: [
        {
          name: "description",
          content: "Error, Application for Health and Drug Coverage",
        },
        {
          property: "og:description",
          content: "Error, Application for Health and Drug Coverage",
        },
      ],
    },
  },
];

const router = createRouter({
  history: createWebHistory("ahdc"),
  routes: routeCollection,
});

router.beforeEach((to, from, next) => {
  // Home redirects.
  if (
    to.path !== enrolmentRoutes.HOME_PAGE.path &&
    !pageStateService.isPageVisited(to.path)
  ) {
    return next({ name: enrolmentRoutes.HOME_PAGE.name });
  }
  // This goes through the matched routes from last to first, finding the closest route with a title
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el),
  );

  // Skip rendering meta tags if there are none
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create so we don't interfere with other ones
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head
    .forEach((tag) => document.head.appendChild(tag));

  // Catch-all (navigation).
  next();
});

export default router;
