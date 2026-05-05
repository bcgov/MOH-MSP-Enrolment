<template>
  <div>
    <PageContent :delta-height="pageContentDeltaHeight">
      <main class="container pt-3 pt-sm-5 mb-3">
        <div class="box-border border border-danger rounded">
          <div class="row align-items-center">
            <div class="col-2 pr-0 text-center">
              <div class="status-icon text-danger">
                <font-awesome-icon icon="times-circle" />
              </div>
            </div>
            <div class="col-10 pl-0 py-3">
              <h1>There was a technical issue with your submission</h1>
              <p>Your application was not submitted.</p>
            </div>
          </div>
        </div>
      </main>
    </PageContent>
  </div>
</template>

<script>
import pageStateService from "@/services/page-state-service";
import { enrolmentRoutes } from "@/router/routes";
import { MODULE_NAME as enrolmentModule, RESET_FORM } from "@/store/modules/enrolment-module";
import { scrollTo } from "@/helpers/scroll";
import { getConvertedPath } from "@/helpers/url";
import logService from "@/services/log-service";
import { PageContent } from "common-lib-vue";
import pageContentMixin from "@/mixins/page-content-mixin";

export default {
  name: "SubmissionErrorPage",
  components: {
    PageContent,
  },
  mixins: [pageContentMixin],
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    this.$store.dispatch(enrolmentModule + "/" + RESET_FORM);
    if (to.path === enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path) {
      next();
    } else {
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.MSP_ELIGIBILITY_PAGE.path
      );
      next({ path: toPath });
    }
    setTimeout(() => {
      scrollTo(0);
    }, 0);
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SUBMISSION_ERROR_PAGE.path,
      enrolmentRoutes.SUBMISSION_ERROR_PAGE.title
    );
  },
};
</script>

<style scoped>
.box-border {
  border-width: 4px !important;
}
.status-icon {
  font-size: 32px;
}
</style>
