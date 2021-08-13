import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import payPatientForm from './modules/pay-patient-form';
import payPractitionerForm from './modules/pay-practitioner-form';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    payPatientForm,
    payPractitionerForm,
  }
});
