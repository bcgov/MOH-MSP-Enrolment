<template>
  <div id="app">
    <div :aria-hidden="isModalOpen">
      <Header :title='pageTitle'
              imagePath='/jha/images/' />
      <main>
        <div class="container stepper">
          <PageStepper :currentPath='$router.currentRoute.path'
                      :routes='stepRoutes'
                      @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
                      :isMobileStepperOpen='isMobileStepperOpen'
                      @onClickLink='handleClickStepperLink($event)'/>
        </div>
        <router-view/>
      </main>
      <Footer :version='version' />
    </div>
    <portal-target name="modal"></portal-target>
  </div>
</template>

<script>
import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";
import 'common-lib-vue/dist/common-lib-vue.css';
import './styles/styles.css';

import project from '../package.json';
import {
  Header,
  Footer,
  PageStepper,
} from 'common-lib-vue';
import {
  MODULE_NAME as appModule,
  SET_SHOW_MOBILE_STEPPER_DETAILS,
} from '@/store/modules/app-module';
import pageStateService from '@/services/page-state-service';
import { scrollTo } from '@/helpers/scroll';
import { enrolmentRoutes } from './router/routes';
import { Wormhole } from 'portal-vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    PageStepper,
  },
  data: () => {
    return {
      version: project.version,
      pageTitle: 'Joint Health Application',
    };
  },
  created() {
    document.title = this.pageTitle;
  },
  computed: {
    stepRoutes() {
      const routes = [
        {...enrolmentRoutes.HOME_PAGE},
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
    isMobileStepperOpen() {
      return this.$store.state.appModule.showMobileStepperDetails;
    },
    isModalOpen() {
      return Wormhole.hasContentFor('modal');
    }
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
  }
}
</script>

<style scoped>
main {
  padding: 0;
}
@media only screen and (max-width: 575px) {
  .container.stepper {
    padding: 0;
  }
}
</style>
