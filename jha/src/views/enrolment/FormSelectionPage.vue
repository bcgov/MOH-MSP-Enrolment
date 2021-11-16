<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Select the programs you want to enrol </h1>
        <hr class="mt-0"/>
        <Checkbox label="MSP Enrolment"
          id="msp"
          v-model="isApplyingForMSP">
          <template v-slot:description>
            <p class="mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis quidem deleniti molestiae provident a veritatis nulla obcaecati assumenda iusto consequuntur.</p>
          </template>
        </Checkbox>
        <Checkbox label="Fair PharmaCare"
          id="fpc"
          v-model="isApplyingForFPCare">
          <template v-slot:description>
            <p class="mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis quidem deleniti molestiae provident a veritatis nulla obcaecati assumenda iusto consequuntur.</p>
          </template>
        </Checkbox>
        <Checkbox label="MSP Supplementary Benefits"
          id="sb"
          v-model="isApplyingForSuppBen">
          <template v-slot:description>
            <p class="mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis quidem deleniti molestiae provident a veritatis nulla obcaecati assumenda iusto consequuntur.</p>
          </template>
        </Checkbox>
        <div class="text-danger mt-3"
          v-if="$v.$dirty && !$v.atLeastOne"
          aria-live="assertive">You must select at least one program.</div>
      </div>
    </PageContent>
    <portal v-if="isInfoCollectionNoticeOpen"
      to="modal">
      <ConsentModal :applicationUuid="applicationUuid"
        @close="handleCloseConsentModal"
        @captchaVerified="handleCaptchaVerified"/>
    </portal>
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
import ConsentModal from '@/components/ConsentModal.vue';
import {
  MODULE_NAME as enrolmentModule,
  SET_CAPTCHA_TOKEN,
  SET_IS_APPLYING_FOR_MSP,
  SET_IS_APPLYING_FOR_FPCARE,
  SET_IS_APPLYING_FOR_SUPP_BEN,
  SET_IS_INFO_COLLECTION_NOTICE_OPEN,
} from '@/store/modules/enrolment-module';
import {
  Checkbox,
  PageContent,
  ContinueBar,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

const atLeastOne = (vm) => {
  return vm.isApplyingForMSP
      || vm.isApplyingForFPCare
      || vm.isApplyingForSuppBen;
};

export default {
  name: 'FormSelectionPage',
  mixins: [pageContentMixin],
  components: {
    Checkbox,
    ContinueBar,
    PageContent,
    ConsentModal,
  },
  data: () => {
    return {
      isPageLoaded: false,
      isApplyingForMSP: false,
      isApplyingForFPCare: false,
      isApplyingForSuppBen: false,
      applicationUuid: null,
    };
  },
  watch: {
    isApplyingForMSP(newValue) {
      if (this.isPageLoaded) {
        this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_MSP}`, newValue);
      }
    },
    isApplyingForFPCare(newValue) {
      if (this.isPageLoaded) {
        this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_FPCARE}`, newValue);
      }
    },
    isApplyingForSuppBen(newValue) {
      if (this.isPageLoaded) {
        this.$store.dispatch(`${enrolmentModule}/${SET_IS_APPLYING_FOR_SUPP_BEN}`, newValue);
      }
    }
  },
  created() {
    this.applicationUuid = this.$store.state.enrolmentModule.applicationUuid;
    this.isApplyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    this.isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.isApplyingForSuppBen = this.$store.state.enrolmentModule.isApplyingForSuppBen;

    logService.logNavigation(
      this.applicationUuid,
      enrolmentRoutes.HOME_PAGE.path,
      enrolmentRoutes.HOME_PAGE.title
    );

    this.$nextTick(() => {
      this.isPageLoaded = true;
    })
  },
  validations() {
    const validations = {
      atLeastOne,
    };
    return validations;
  },
  computed: {
    isInfoCollectionNoticeOpen() {
      return this.$store.state.enrolmentModule.isInfoCollectionNoticeOpen;
    }
  },
  methods: {
    handleCaptchaVerified(captchaToken) {
      this.$store.dispatch(`${enrolmentModule}/${SET_CAPTCHA_TOKEN}`, captchaToken);
    },
    handleCloseConsentModal() {
      this.$store.dispatch(`${enrolmentModule}/${SET_IS_INFO_COLLECTION_NOTICE_OPEN}`, false);
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
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
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
