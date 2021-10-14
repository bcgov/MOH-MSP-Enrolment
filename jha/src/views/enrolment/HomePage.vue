<template>
  <div>
    <ConsentModal v-if="showConsentModal"
                  :applicationUuid="applicationUuid"
                  @close="handleCloseConsentModal"
                  @captchaVerified="handleCaptchaVerified" />
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Select the programs you want to enrol </h1>
        <hr class="mt-0"/>
        <input class="mr-2" type="checkbox" id="msp" value="msp" v-model="formOptions">
        <label for="msp">MSP Enrolment</label>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis quidem deleniti molestiae provident a veritatis nulla obcaecati assumenda iusto consequuntur.</p>
        <input class="mr-2" type="checkbox" id="fpc" value="fpc" v-model="formOptions">
        <label for="fpc">Fair PharmaCare</label>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis quidem deleniti molestiae provident a veritatis nulla obcaecati assumenda iusto consequuntur.</p>
        <input class="mr-2" type="checkbox" id="suppben" value="suppben" v-model="formOptions">
        <label for="suppben">MSP Supplementary Benefits</label>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis quidem deleniti molestiae provident a veritatis nulla obcaecati assumenda iusto consequuntur.</p>
        <div class="text-danger"
          v-if="$v.formOptions.$dirty && !$v.formOptions.atLeastOne"
          aria-live="assertive">You must select at least one program</div>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import spaEnvService from '@/services/spa-env-service';
import {
  enrolmentRoutes,
  commonRoutes,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import {
  getConvertedPath,
} from '@/helpers/url';
import ConsentModal from '@/components/ConsentModal.vue';
import { v4 as uuidv4 } from 'uuid';
import {
  MODULE_NAME as enrolmentModule,
  RESET_FORM,
  SET_APPLICATION_UUID,
  SET_CAPTCHA_TOKEN,
  SET_IS_APPLYING_FOR_MSP,
  SET_IS_APPLYING_FOR_FPCARE,
  SET_IS_APPLYING_FOR_SUPP_BEN,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  PageContent,
  ContinueBar,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

const atLeastOne = array => {
  return array.length > 0;
}

export default {
  name: 'HomePage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    ConsentModal,
  },
  data: () => {
    return {
      isPageLoaded: false,
      formOptions: [],
      showConsentModal: true,
      applicationUuid: null,
    };
  },
  watch: {
    formOptions: function(array) {
      if (array.indexOf('msp') !== -1) {
        this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_MSP, true);
      } else {
        this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_MSP, false);
      }
      if (array.indexOf('fpc') !== -1) {
        this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_FPCARE, true);
      } else {
        this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_FPCARE, false);
      }
      if (array.indexOf('suppben') !== -1) {
        this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_SUPP_BEN, true);
      } else {
        this.$store.dispatch(enrolmentModule + '/' + SET_IS_APPLYING_FOR_SUPP_BEN, false);
      }
    }
  },
  created() {
    this.applicationUuid = uuidv4();
    this.$store.dispatch(enrolmentModule + '/' + SET_APPLICATION_UUID, this.applicationUuid);

    // Load environment variables, and route to maintenance page.
    spaEnvService.loadEnvs()
      .then(() => {
        if (spaEnvService.values && spaEnvService.values.SPA_ENV_OOP_MAINTENANCE_FLAG === 'true') {
          const toPath = commonRoutes.MAINTENANCE_PAGE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(this.applicationUuid, {
          event: 'HTTP error getting values from spa-env-server',
          status: error.response.status,
        });
      });

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.HOME_PAGE.path,
      enrolmentRoutes.HOME_PAGE.title
    );
  },
  validations() {
    const validations = {
      formOptions: { atLeastOne }
    };
    return validations;
  },
  methods: {
    handleCaptchaVerified(captchaToken) {
      this.$store.dispatch(enrolmentModule + '/' + SET_CAPTCHA_TOKEN, captchaToken);
    },
    handleCloseConsentModal() {
      this.showConsentModal = false;
    },
    validateFields() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.PERSONAL_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    }
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(enrolmentModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.HOME_PAGE.path
      );
      next({
        path: toPath,
        replace: true
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  }
}
</script>
