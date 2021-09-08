<template>
  <div>
    <ConsentModal v-if="showConsentModal"
                  :applicationUuid="applicationUuid"
                  @close="handleCloseConsentModal"
                  @captchaVerified="handleCaptchaVerified" />
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Form Title</h1>
        <hr/>
        <p>Page content here.</p>
      </div>
    </PageContent>
    <ContinueBar @continue='nextPage()'/>
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import spaEnvService from '@/services/spa-env-service';
import {
  enrolmentRoutes,
  commonRoutes,
} from '@/router/routes';
import {
  scrollTo,
  getTopScrollPosition
} from '@/helpers/scroll';
import ConsentModal from '@/components/ConsentModal.vue';
import { v4 as uuidv4 } from 'uuid';
import {
  MODULE_NAME as formModule,
  SET_APPLICATION_UUID,
  SET_CAPTCHA_TOKEN,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import { getConvertedPath } from '@/helpers/url';
import {
  PageContent,
  ContinueBar,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'HomePage',
  mixins:[pageContentMixin],
  components: {
    ConsentModal,
    ContinueBar,
    PageContent,
  },
  data: () => {
    return {
      showConsentModal: true,
      applicationUuid: null,
    }
  },
  created() {
    this.applicationUuid = uuidv4();
    this.$store.dispatch(formModule + '/' + SET_APPLICATION_UUID, this.applicationUuid);

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
      this.applicationUuid,
      enrolmentRoutes.HOME_PAGE.path,
      enrolmentRoutes.HOME_PAGE.title
    );
  },
  methods: {
    handleCaptchaVerified(captchaToken) {
      this.$store.dispatch(formModule + '/' + SET_CAPTCHA_TOKEN, captchaToken);
    },
    handleCloseConsentModal() {
      this.showConsentModal = false;
    },
    nextPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.FORM_PAGE.path
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
    if (pageStateService.isPageComplete(to.path)) {
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
