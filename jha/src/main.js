import { createApp } from 'vue';
import PortalVue from 'portal-vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faCalendarAlt,
  faCheckCircle,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faPencilAlt,
  faPrint,
  faTimesCircle,
  faInfoCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'core-js/es/number'; // IE polyfill for `Number.isNaN()`.
import { isIE } from '@/helpers/user-agent';

library.add(faAngleDown);
library.add(faAngleRight);
library.add(faArrowLeft);
library.add(faArrowRight);
library.add(faCalendarAlt);
library.add(faCheckCircle);
library.add(faChevronDown);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faChevronUp);
library.add(faPencilAlt);
library.add(faPrint);
library.add(faTimesCircle);
library.add(faInfoCircle);
library.add(faExclamationCircle);

// Vue.component('font-awesome-icon', FontAwesomeIcon);

// Vue.use(Vuelidate);
// Vue.use(PortalVue);
// Vue.use(router);

// Vue.config.productionTip = false;

const app = createApp({
  router,
  ...App,
})

app.use(store)
app.use(router)
app.mount('#app');
