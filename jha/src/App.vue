<template>
  <div id="app">
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
</template>

<script>
import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";
import 'common-lib-vue/dist/common-lib-vue.css';
import './styles/styles.css';

import project from '../package.json';
import {
  Header,
  Footer
} from 'common-lib-vue';
import PageStepper from '@/components/PageStepper.vue';
import {
  formAStepRoutes,
} from '@/router/step-routes';
import {
  FORM_A_BASE_URL,
} from '@/router/routes';
import {
  MODULE_NAME as appModule,
  SET_SHOW_MOBILE_STEPPER_DETAILS,
} from '@/store/modules/app-module';
import pageStateService from '@/services/page-state-service';
import { scrollTo } from '@/helpers/scroll';

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
    };
  },
  created() {
    document.title = this.pageTitle;
  },
  computed: {
    stepRoutes() {
      const currentPath = this.$router.currentRoute.path;
      if (currentPath.includes(FORM_A_BASE_URL)) {
        return formAStepRoutes;
      }
      return [];
    },
    pageTitle() {
      const currentPath = this.$router.currentRoute.path;
      if (currentPath.includes(FORM_A_BASE_URL)) {
        return 'Form A';
      }
      return '';
    },
    isMobileStepperOpen() {
      return this.$store.state.appModule.showMobileStepperDetails;
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