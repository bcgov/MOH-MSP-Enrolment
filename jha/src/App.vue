<template>
  <div id="app">
    <Header :title='pageTitle'
            imagePath='/jha/images/' />
    <main>
      <div class="container stepper">
        <ProgressBar :currentPath='$router.currentRoute.path'
                    :routes='stepRoutes'/>
      </div>
      <router-view/>
    </main>
    <Footer :version='version' />
  </div>
</template>

<script>
import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";
import 'common-lib-vue/dist/common-lib-vue.css';
import './styles/styles.css';

import project from '../package.json';
import {
  Header,
  Footer
} from 'common-lib-vue';
import ProgressBar from '@/components/ProgressBar.vue';
import {
  formAStepRoutes,
} from '@/router/step-routes';
import {
  FORM_A_BASE_URL,
} from '@/router/routes';

export default {
  name: 'App',
  components: {
    Header: Header,
    Footer: Footer,
    ProgressBar: ProgressBar
  },
  data: () => {
    return {
      version: project.version,
    };
  },
  created() {
    document.title = this.pageTitle;
  },
  computed: {
    stepRoutes() {
      const currentPath = this.$router.currentRoute.path;
      if (currentPath.includes(FORM_A_BASE_URL)) {
        return formAStepRoutes;
      }
      return [];
    },
    pageTitle() {
      const currentPath = this.$router.currentRoute.path;
      if (currentPath.includes(FORM_A_BASE_URL)) {
        return 'Form A';
      }
      return '';
    }
  }
}
</script>

<style scoped>
main {
  padding: 0;
}
@media only screen and (max-width: 575px) {
  .container.stepper {
    padding: 0;
  }
}
</style>
