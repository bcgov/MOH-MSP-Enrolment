import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import HomePage from '@/views/form-a/HomePage.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
Vue.use(Vuelidate);

describe('Form A - HomePage.vue', () => {
  let state;
  let store;

  beforeEach(() => {
    state ={
      applicationUuid: null,
    };    

    store = new Vuex.Store({
      modules: {
        formAModule: {
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
    const wrapper = shallowMount(HomePage, {
      store,
      localVue,
    });
    expect(wrapper.element).toBeDefined();
  });
});
