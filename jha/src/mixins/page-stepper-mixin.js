import pageStateService from '@/services/page-state-service';
import { scrollTo } from '@/helpers/scroll';
import {
  MODULE_NAME as appModule,
  SET_SHOW_MOBILE_STEPPER_DETAILS,
} from '@/store/modules/app-module';
import { PageStepper } from 'common-lib-vue';
import {
  enrolmentRoutes,
} from '@/router/routes';

export default {
  components: {
    PageStepper,
  },
  data: () => {
    return {
      eligibilityStepRoutes: [
        {...enrolmentRoutes.MSP_ELIGIBILITY_PAGE},
        {...enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE},
        {...enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE},
        {...enrolmentRoutes.FORM_SELECTION_PAGE},
      ],
    };
  },
  methods: {
    handleToggleShowMobileStepperDetails(isDetailsShown) {
      this.$store.dispatch(appModule + '/' + SET_SHOW_MOBILE_STEPPER_DETAILS, isDetailsShown);
    },
    handleClickStepperLink(path) {
      pageStateService.setPageIncomplete(this.$router.currentRoute.path);
      pageStateService.setPageComplete(path);
      this.$router.push(path);
      scrollTo(0);
    }
  },
  computed: {
    isMobileStepperOpen() {
      return this.$store.state.appModule.showMobileStepperDetails;
    },
    stepRoutes() {
      const currentPath = this.$router.currentRoute.path;
      const hasCompletedEQ = this.$store.state.enrolmentModule.hasCompletedEQ;

      switch(currentPath) {
        case enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path:
          return this.eligibilityStepRoutes;
        case enrolmentRoutes.FPCARE_ELIGIBILITY_PAGE.path:
          return this.eligibilityStepRoutes;
        case enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path:
          return this.eligibilityStepRoutes;
        case enrolmentRoutes.FORM_SELECTION_PAGE.path:
          return hasCompletedEQ ? this.mainFormStepRoutes : this.eligibilityStepRoutes;
        default:
          return this.mainFormStepRoutes;
      }
    },
    mainFormStepRoutes() {
      const routes = [
        {
          ...enrolmentRoutes.FORM_SELECTION_PAGE,
          isClickable: false,
        },
        {...enrolmentRoutes.PERSONAL_INFO_PAGE},
        {...enrolmentRoutes.SPOUSE_INFO_PAGE},
      ];
      if (this.$store.state.enrolmentModule.isApplyingForFPCare || this.$store.state.enrolmentModule.isApplyingForMSP) {
        routes.push({...enrolmentRoutes.CHILD_INFO_PAGE});
      }
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        routes.push({...enrolmentRoutes.FPCARE_INFO_PAGE});
      }
      if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        routes.push({...enrolmentRoutes.SUPP_BEN_INFO_PAGE});
        routes.push({...enrolmentRoutes.DOCUMENTS_PAGE});
      }
      routes.push({...enrolmentRoutes.CONTACT_INFO_PAGE});
      routes.push({...enrolmentRoutes.REVIEW_PAGE});
      routes.push({...enrolmentRoutes.CONSENT_PAGE});
      return routes;
    },
  },
  mounted() {
    const disabledPageSteps = Array.from(document.querySelectorAll('div.step-text>span'));
    disabledPageSteps.forEach(step => {
      step.setAttribute('role', 'link')
      step.setAttribute('tabindex', '0')
      step.setAttribute('disabled', 'true')
      step.setAttribute('aria-disabled', 'true')
    })
  }
};
