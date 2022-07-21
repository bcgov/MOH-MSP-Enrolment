<template>
  <div id="app">
    <div :aria-hidden="isModalOpen">
      <Header :title='pageTitle'
              imagePath='/ahdc/images/' />
      <router-view/>
      <Footer :version='version' />
    </div>
    <portal-target id="modal-target" name="modal"></portal-target>
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
import { Wormhole } from 'portal-vue';
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
      pageTitle: 'British Columbia Application for Health and Drug Coverage (AHDC)',
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
      return Wormhole.hasContentFor('modal');
    }
  },
}
</script>

<style scoped>
main {
  padding: 0;
}
</style>
