<template>
  <div id="app">
    <div :aria-hidden="isModalOpen">
      <Header :title='pageTitle'
              imagePath='/jha/images/' />
      <main>
        <router-view/>
      </main>
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
import {
  MODULE_NAME as enrolmentModule,
  SET_APPLICATION_UUID,
} from '@/store/modules/enrolment-module';
import pageStateService from '@/services/page-state-service';
import { commonRoutes } from '@/router/routes';
import { Wormhole } from 'portal-vue';
import { v4 as uuidv4 } from 'uuid';
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
      pageTitle: 'Joint Health Application',
    };
  },
  created() {
    document.title = this.pageTitle;

    this.applicationUuid = uuidv4();
    this.$store.dispatch(enrolmentModule + '/' + SET_APPLICATION_UUID, this.applicationUuid);

    // Load environment variables, and route to maintenance page.
    spaEnvService.loadEnvs()
      .then(() => {
        if (spaEnvService.values && spaEnvService.values.SPA_ENV_OOP_MAINTENANCE_FLAG === 'true') {
          const toPath = commonRoutes.MAINTENANCE_PAGE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(this.applicationUuid, {
          event: 'HTTP error getting values from spa-env-server',
          status: error.response.status,
        });
      });
  },
  computed: {
    isModalOpen() {
      const modalTargetEl = document.body.querySelector('#modal-target');
      const modalTargetHasChildren = modalTargetEl && modalTargetEl.children.length > 0;
      return Wormhole.hasContentFor('modal')
          || modalTargetHasChildren;
    }
  },
}
</script>

<style scoped>
main {
  padding: 0;
}
</style>
