<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Upload Supporting Documents</h1>
        <hr class="mt-0"/>
        <div>
          <h3>Upload your Canda Revenue Agency Notice of Assessment or Reassessment for 2020</h3>
          <hr/>
          <FileUploader v-model="ahCRADocuments" />
        </div>
        <div v-if="hasSpouse">
          <h3>Upload your spouse's Canda Revenue Agency Notice of Assessment or Reassessment for 2020</h3>
          <hr/>
          <FileUploader v-model="spouseCRADocuments" />
        </div>
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
  SET_AH_CRA_DOCUMENTS,
  SET_SPOUSE_CRA_DOCUMENTS,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
  FileUploader,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'DocumentsPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    FileUploader,
  },
  data: () => {
    return {
      ahCRADocuments: [],
      spouseCRADocuments: [],
      hasSpouse: false,
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.DOCUMENTS_PAGE.path,
      enrolmentRoutes.DOCUMENTS_PAGE.title
    );
    this.ahCRADocuments = this.$store.state.documents.ahCRADocuments;
    this.spouseCRADocuments = this.$store.state.documents.spouseCRADocuments;
    this.hasSpouse = this.$store.state.documents.hasSpouse;
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
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_CRA_DOCUMENTS}`, this.ahCRADocuments);
      if (this.hasSpouse) {
        this.$store.dispatch(`${enrolmentModule}/${SET_SPOUSE_CRA_DOCUMENTS}`, this.spouseCRADocuments);
      }
      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.REVIEW_PAGE.path
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
        enrolmentRoutes.DOCUMENTS_PAGE.path
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
