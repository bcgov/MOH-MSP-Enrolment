<template>
  <div>
    <div class="container stepper">
      <PageStepper :currentPath='$router.currentRoute.path'
        :routes='stepRoutes'
        @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
        :isMobileStepperOpen='isMobileStepperOpen'
        @onClickLink='handleClickStepperLink($event)'/>
    </div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Review</h1>
        <hr/>
        <ReviewTableList :showEditButtons='true' 
                        tableBackgroundColor='#EEE'/>
        <div v-if="isSystemUnavailable"
            class="text-danger mt-3 mb-5"
            aria-live="assertive">Unable to continue, system unavailable. Please try again later.</div>
      </div>
    </PageContent>
    <ContinueBar @continue='continueHandler()'/>
  </div>
</template>

<script>
import ReviewTableList from '@/components/enrolment/ReviewTableList.vue';
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isPastPath
} from '@/router/routes';
import {
  scrollTo,
  getTopScrollPosition
} from '@/helpers/scroll';
import { getConvertedPath } from '@/helpers/url';
import {
  MODULE_NAME as formModule,
  RESET_FORM,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

export default {
  name: 'ReviewPage',
  mixins: [
    pageContentMixin,
    pageStepperMixin,
  ],
  components: {
    PageContent,
    ContinueBar,
    ReviewTableList,
  },
  data: () => {
    return {
      isLoading: false,
      isSystemUnavailable: false,
    }
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.REVIEW_PAGE.path,
      enrolmentRoutes.REVIEW_PAGE.title
    );
  },
  methods: {
    continueHandler() {
      this.navigateToConsentPage();
    },
    navigateToConsentPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.CONSENT_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(formModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.REVIEW_PAGE.path
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
