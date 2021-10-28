<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Upload Supporting Documents</h1>
        <hr class="mt-0"/>
        <div class="row">
          <div class="col-md-8">
            <div>
              <p class="font-weight-bold">Upload your Canada Revenue Agency Notice of Assessment or Reassessment for 2020</p>
              <hr/>
              <FileUploader v-model="ahCRADocuments" />
            </div>
            <div v-if="hasSpouse">
              <p class="font-weight-bold">Upload your spouse's Canada Revenue Agency Notice of Assessment or Reassessment for 2020</p>
              <hr/>
              <FileUploader v-model="spouseCRADocuments" />
            </div>
          </div>
          <div class="col-md-4">
            <TipBox title="Tip">
              <p>
                If you are uploading a copy of a Notice of Assessment of Reassessment from the Canada Revenue Agency website, make sure the image contains:
              </p>
              <ul>
                <li>Your Name</li>
                <li>The Tax Year</li>
                <li>Your Net Income(line 23600)</li>
                <li>If you have a Regisered Disability Savings Plan(line 12500)</li>
                <li>A JPG, PNG, GIF, BMP, or PDF file.</li>
              </ul>
            </TipBox>
          </div>
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
  MODULE_NAME as enrolmentModule,
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
import TipBox from '@/components/TipBox';

export default {
  name: 'DocumentsPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    FileUploader,
    TipBox,
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
    this.ahCRADocuments = this.$store.state.enrolmentModule.ahCRADocuments;
    this.spouseCRADocuments = this.$store.state.enrolmentModule.spouseCRADocuments;
    this.hasSpouse = this.$store.state.enrolmentModule.hasSpouse !== 'N';
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
      this.$store.dispatch(enrolmentModule + '/' + RESET_FORM);
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
