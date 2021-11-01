<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Fair PharmaCare Financial Information</h1>
        <hr class="mt-0"/>
        <CurrencyInput :label="`Enter your net income from ${noaYear} - see line 23600 of your Notice of Assessment or Reassessment from the Canada Revenue Agency (samples). For more information, please see Frequently Asked Questions.`"
          v-model="ahIncome"
          id="ah-income"
          class="mt-3"/>
        <CurrencyInput :label="`Enter your spouse/common-law partner's net income from ${noaYear} - see line 23600 of your Notice of Assessment or Reassessment from the Canada Revenue Agency (samples). For more information, please see Frequently Asked Questions.`"
          v-model="spouseIncome"
          id="spouse-income"
          class="mt-3"/>
        <h2 class="mt-5">Disability Information (if applicable)</h2>
        <hr/>
        <CurrencyInput :label="`How much did you report for a Registered Disability Savings Plan on your income tax return ${noaYear} (line 12500)?`"
          v-model="ahDisabilitySavings"
          id="ah-disability-savings"
          class="mt-3"/>
        <CurrencyInput :label="`How much did your spouse/common-law partner report for a Registered Disability Savings Plan on your income tax return ${noaYear} (line 12500)?`"
          v-model="spouseDisabilitySavings"
          id="spouse-disability-savings"
          class="mt-3"/>
      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
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
  MODULE_NAME as formModule,
  RESET_FORM,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  CurrencyInput,
  PageContent,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'FPCareInfoPage',
  mixins: [
    pageContentMixin,
  ],
  components: {
    ContinueBar,
    CurrencyInput,
    PageContent,
  },
  data: () => {
    return {
      noaYear: null,
      ahIncome: null,
      ahDisabilitySavings: null,
      spouseIncome: null,
      spouseDisabilitySavings: null,
    };
  },
  created() {
    this.noaYear = new Date().getFullYear() - 2;

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.FPCARE_INFO_PAGE.path,
      enrolmentRoutes.FPCARE_INFO_PAGE.title
    );
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
      const nextPath = this.$store.state.enrolmentModule.isApplyingForSuppBen ? enrolmentRoutes.SUPP_BEN_INFO_PAGE.path : enrolmentRoutes.CONTACT_INFO_PAGE.path;
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        nextPath
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  computed: {},
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
        enrolmentRoutes.FPCARE_INFO_PAGE.path
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

<style scoped>
</style>
