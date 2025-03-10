<template>
  <div>
    <div :aria-hidden="isModalOpen">
      <HeaderComponent :title="pageTitle" imagePath="/ahdc/images/" />
      <router-view />
      <FooterComponent :version="version" />
    </div>
    <div id="modal-target" name="modal" ref="modal"></div>
  </div>
</template>

<script>
import "@bcgov/bootstrap-v5-theme/css/bootstrap-theme.min.css";
import "common-lib-vue/dist/common-lib-vue.css";
import "./styles/styles.css";

import project from "../package.json";
import { HeaderComponent, FooterComponent } from "common-lib-vue";
import pageStateService from "@/services/page-state-service";
import { commonRoutes } from "@/router/routes";
import spaEnvService from "@/services/spa-env-service";
import logService from "@/services/log-service";
import {
  MODULE_NAME as appModule,
  SET_MAINTENANCE_MESSAGE,
} from "@/store/modules/app-module";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data: () => {
    return {
      version: project.version,
      pageTitle:
        "British Columbia Application for Health and Drug Coverage (AHDC)",
      isModalOpen: false,
      modalObserver: null,
    };
  },
  methods: {
    initModalObserver() {
      const modalObserver = new MutationObserver(() => {
        const modalTargetEl = this.$refs.modal;
        const modalTargetHasChildren =
          modalTargetEl && modalTargetEl.children.length > 0;
        this.isModalOpen = modalTargetHasChildren;
      });
      modalObserver.observe(this.$refs.modal, { childList: true });
      this.modalObserver = modalObserver;
    },
  },
  created() {
    document.title = this.pageTitle;

    const applicationUuid = this.$store.state.enrolmentModule.applicationUuid;

    // Load environment variables, and route to maintenance page.
    spaEnvService
      .loadEnvs()
      .then(() => {
        if (
          spaEnvService.values &&
          spaEnvService.values.SPA_ENV_JHA_MAINTENANCE_FLAG === "true"
        ) {
          this.$store.dispatch(
            `${appModule}/${SET_MAINTENANCE_MESSAGE}`,
            spaEnvService.values.SPA_ENV_JHA_MAINTENANCE_MESSAGE,
          );
          const toPath = commonRoutes.MAINTENANCE_PAGE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(applicationUuid, {
          event: "HTTP error getting values from spa-env-server",
          status: error.response.status,
          error,
        });
      });
  },
  mounted() {
    this.initModalObserver();
  },
  beforeDestroy() {
    if (this.modalObserver) this.modalObserver.disconnect();
  },
};
</script>

<style scoped>
main {
  padding: 0;
}
</style>
