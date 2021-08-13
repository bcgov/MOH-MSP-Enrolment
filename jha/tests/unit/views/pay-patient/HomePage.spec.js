import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import YourInfoPage from '@/views/pay-patient/HomePage.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(Vuelidate);

describe('Pay Patient - HomePage.vue', () => {
  let state;
  let store;

  beforeEach(() => {
    state ={
      applicationUuid: null,
    };    

    store = new Vuex.Store({
      modules: {
        payPatientForm: {
          state,
          namespaced: true,
          actions: {
            setApplicationUuid() {}
          }
        }
      }
    });
  });
  it('renders', () => {
    const wrapper = shallowMount(YourInfoPage, {
      store,
      localVue,
    });
    expect(wrapper.element).toBeDefined();
  });
});
