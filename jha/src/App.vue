<template>
  <div id="app">
    <div :aria-hidden="isModalOpen">
      <Header :title='pageTitle'
              imagePath='/ahdc/images/' />
      <main>
        <router-view/>
      </main>
      <Footer :version='version' />
    </div>
    <div id="modal-target" name="modal"></div>
  </div>
</template>

<script>
import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";
import 'common-lib-vue/dist/common-lib-vue.css';
import './styles/styles.css';

import project from '../package.json';
import {
  Header,
  Footer,
} from 'common-lib-vue';
import pageStateService from '@/services/page-state-service';
import { commonRoutes } from '@/router/routes';
import spaEnvService from '@/services/spa-env-service';
import logService from '@/services/log-service';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  data: () => {
    return {
      version: project.version,
      pageTitle: 'British Columbia Application for Health Drug Coverage (AHDC)',
    };
  },
  created() {
    document.title = this.pageTitle;

    const applicationUuid = this.$store.state.enrolmentModule.applicationUuid;

    // Load environment variables, and route to maintenance page.
    spaEnvService.loadEnvs()
      .then(() => {
        if (spaEnvService.values && spaEnvService.values.SPA_ENV_JHA_MAINTENANCE_FLAG === 'true') {
          const toPath = commonRoutes.MAINTENANCE_PAGE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(applicationUuid, {
          event: 'HTTP error getting values from spa-env-server',
          status: error.response.status,
        });
      });
  },
  computed: {
    isModalOpen() {
      const modalTargetEl = document.body.querySelector('#modal-target');
      const modalTargetHasChildren = modalTargetEl && modalTargetEl.children.length > 0;
      // TODO: Update commented out code below for new Teleport component
      // return Wormhole.hasContentFor('modal')
      //     || modalTargetHasChildren;
      return modalTargetHasChildren;
    }
  },
}
</script>

<style scoped>
main {
  padding: 0;
}
</style>
