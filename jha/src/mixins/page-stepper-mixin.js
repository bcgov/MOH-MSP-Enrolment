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
      const routes = [
        {...enrolmentRoutes.FORM_SELECTION_PAGE},
        {...enrolmentRoutes.PERSONAL_INFO_PAGE},
        {...enrolmentRoutes.SPOUSE_INFO_PAGE},
        {...enrolmentRoutes.CHILD_INFO_PAGE},
      ];
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        routes.push({...enrolmentRoutes.FPCARE_INFO_PAGE});
      }
      if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        routes.push({...enrolmentRoutes.SUPP_BEN_INFO_PAGE});
        routes.push({...enrolmentRoutes.DOCUMENTS_PAGE});
      }
      routes.push({...enrolmentRoutes.CONTACT_INFO_PAGE});
      routes.push({...enrolmentRoutes.REVIEW_PAGE});
      routes.push({...enrolmentRoutes.SUBMISSION_PAGE});
      return routes;
    },
  }
};
