<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Eligibility questionnaire</h1>
        <hr class="mt-0"/>
        <h2>MSP Supplementary Benefits</h2>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import logService from '@/services/log-service';
import {
  enrolmentRoutes,
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
import {
  PageContent,
  ContinueBar,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'MSPEligibilityPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
  },
  data: () => {
    return {
      isPageLoaded: false,
    };
  },
  created() {
    logService.logNavigation(
      this.applicationUuid,
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path,
      enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.title
    );

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {};
    return validations;
  },
  methods: {
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
        enrolmentRoutes.FORM_SELECTION_PAGE.path
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
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUPP_BEN_ELIGIBILITY_PAGE.path
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
