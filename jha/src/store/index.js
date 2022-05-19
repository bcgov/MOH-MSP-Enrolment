import Vue from 'vue';
import { createStore } from 'vuex';
import appModule from './modules/app-module';
import enrolmentModule from './modules/enrolment-module';

const store = createStore({
  modules: {
    appModule,
    enrolmentModule,
  }
});

Vue.use(store);

export default createStore({
  modules: {
    appModule,
    enrolmentModule,
  }
});
