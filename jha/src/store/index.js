import Vue from 'vue';
import Vuex from 'vuex';
import appModule from './modules/app-module';
import enrolmentModule from './modules/enrolment-module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    appModule,
    enrolmentModule,
  }
});
