import Vue from 'vue';
import Vuex from 'vuex';
import appModule from './modules/app-module';
import formAModule from './modules/form-a-module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    appModule,
    formAModule,
  }
});
