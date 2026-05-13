<template>
  <div>
    <div class="container stepper">
      <PageStepper
        :current-path="$router.currentRoute.value.path"
        :routes="stepRoutes"
        :is-mobile-stepper-open="isMobileStepperOpen"
        @toggle-show-mobile-details="handleToggleShowMobileStepperDetails($event)"
        @on-click-link="handleClickStepperLink($event)"
      />
    </div>
    <PageContent :delta-height="pageContentDeltaHeight">
      <main class="container pt-3 pt-sm-5 mb-3">
        <h1>Upload supporting documents</h1>
        <hr class="mt-0" />
        <div class="row">
          <div class="col-md-8">
            <div>
              <p class="font-weight-bold">
                Upload your Canada Revenue Agency NOA or NORA for
                {{ selectedNOAYear }}
              </p>
              <hr />
              <FileUploader
                id="ah-cra-documents"
                v-model="ahCRADocuments"
                :is-zoom-portal-enabled="true"
                modal-element-target="#modal-target"
                document-type="Account holder NOA/NOR support documents"
                description="Account holder NOA/NOR"
              />
              <div
                v-if="v$.ahCRADocuments.$dirty && v$.ahCRADocuments.required.$invalid"
                class="text-danger"
                aria-live="assertive"
              >
                File upload required.
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <TipBox title="Tip">
              <p>When uploading a copy of your NOA or NORA, make sure the image contains:</p>
              <ul>
                <li>Your name&nbsp;</li>
                <li>The tax year&nbsp;</li>
                <li>Your net income (Line 23600)&nbsp;</li>
                <li>Registered Disability Savings Plan income (Line 12500) if applicable&nbsp;</li>
              </ul>
              <p>The file must be a JPG, PNG, BMP or PDF.</p>
            </TipBox>
          </div>
        </div>
        <div
          v-if="hasSpouse"
          class="row mt-5"
        >
          <div class="col-md-8">
            <p class="font-weight-bold">
              Upload your spouse's Canada Revenue Agency NOA or NORA for
              {{ selectedNOAYear }}
            </p>
            <hr />
            <FileUploader
              id="spouse-cra-documents"
              v-model="spouseCRADocuments"
              :is-zoom-portal-enabled="true"
              modal-element-target="#modal-target"
              document-type="Spouse NOA/NOR support documents"
              description="Spouse NOA/NOR"
            />
            <div
              v-if="v$.spouseCRADocuments.$dirty && v$.spouseCRADocuments.required.$invalid"
              class="text-danger"
              aria-live="assertive"
            >
              File upload required.
            </div>
          </div>
          <div class="col-md-4">
            <TipBox title="Tip">
              <p>When uploading a copy of your NOA or NORA, make sure the image contains:</p>
              <ul>
                <li>Your name&nbsp;</li>
                <li>The tax year&nbsp;</li>
                <li>Your net income (line 23600)&nbsp;</li>
                <li>Regisered Disability Savings Plan income (line 12500) if applicable&nbsp;</li>
              </ul>
              <p>The file must be a JPG, PNG, BMP or PDF.</p>
            </TipBox>
          </div>
        </div>
      </main>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import pageStateService from "@/services/page-state-service";
import { enrolmentRoutes, isEQPath, isPastPath } from "@/router/routes";
import { scrollTo, scrollToError, getTopScrollPosition } from "@/helpers/scroll";
import { getConvertedPath } from "@/helpers/url";
import {
  MODULE_NAME as enrolmentModule,
  SET_AH_CRA_DOCUMENTS,
  SET_SPOUSE_CRA_DOCUMENTS,
} from "@/store/modules/enrolment-module";
import logService from "@/services/log-service";
import { ContinueBar, PageContent, FileUploader } from "common-lib-vue";
import { required } from "@vuelidate/validators";
import pageContentMixin from "@/mixins/page-content-mixin";
import pageStepperMixin from "@/mixins/page-stepper-mixin";
import TipBox from "@/components/TipBox";

export default {
  name: "DocumentsPage",
  components: {
    ContinueBar,
    PageContent,
    FileUploader,
    TipBox,
  },
  mixins: [pageContentMixin, pageStepperMixin],
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (
      pageStateService.isPageComplete(to.path) ||
      (isPastPath(to.path, from.path) && !isEQPath(to.path))
    ) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.DOCUMENTS_PAGE.path
      );
      next({
        path: toPath,
        replace: true,
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data: () => {
    return {
      ahCRADocuments: [],
      spouseCRADocuments: [],
      hasSpouse: false,
      selectedNOAYear: null,
    };
  },
  computed: {},
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.DOCUMENTS_PAGE.path,
      enrolmentRoutes.DOCUMENTS_PAGE.title
    );
    this.ahCRADocuments = this.$store.state.enrolmentModule.ahCRADocuments;
    this.spouseCRADocuments = this.$store.state.enrolmentModule.spouseCRADocuments;
    this.hasSpouse = this.$store.state.enrolmentModule.hasSpouse !== "N";
    this.selectedNOAYear = this.$store.state.enrolmentModule.selectedNOAYear;
  },
  validations() {
    const validations = {
      ahCRADocuments: {
        required,
      },
      spouseCRADocuments: {},
    };

    if (this.$store.state.enrolmentModule.hasSpouse === "Y") {
      validations.spouseCRADocuments.required = required;
    }
    return validations;
  },
  methods: {
    validateFields() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        scrollToError();
        return;
      }
      this.$store.dispatch(`${enrolmentModule}/${SET_AH_CRA_DOCUMENTS}`, this.ahCRADocuments);
      if (this.hasSpouse) {
        this.$store.dispatch(
          `${enrolmentModule}/${SET_SPOUSE_CRA_DOCUMENTS}`,
          this.spouseCRADocuments
        );
      }
      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.CONTACT_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
};
</script>

<style scoped></style>
