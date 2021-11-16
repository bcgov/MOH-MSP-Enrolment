import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import FormSelectionPage from '@/views/enrolment/FormSelectionPage.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(Vuelidate);

describe('Enrolment - FormSelectionPage.vue', () => {
  let state;
  let store;

  beforeEach(() => {
    state ={
      applicationUuid: null,
    };    

    store = new Vuex.Store({
      modules: {
        enrolmentModule: {
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
    const wrapper = shallowMount(FormSelectionPage, {
      store,
      localVue,
    });
    expect(wrapper.element).toBeDefined();
  });
});
