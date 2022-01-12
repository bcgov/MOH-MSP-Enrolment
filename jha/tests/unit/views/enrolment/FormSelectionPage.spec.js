import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import FormSelectionPage from '@/views/enrolment/FormSelectionPage.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(Vuelidate);

describe('Enrolment - FormSelectionPage.vue', () => {
  let state;
  let router;
  let store;

  beforeEach(() => {
    state = {
      applicationUuid: null,
    };    

    store = new Vuex.Store({
      modules: {
        appModule: {
          state: {
            showMobileStepperDetails: false,
          }
        },
        enrolmentModule: {
          state,
          namespaced: true,
          actions: {
            setApplicationUuid() {},
            setIsApplyingForMSP() {},
            setIsApplyingForFPCare() {},
            setIsApplyingForSuppBen() {},
          },
          getters: {
            isEligibleForMSP() {
              return true;
            },
            isEligibleForFPCare() {
              return true;
            },
            isEligibleForSuppBen() {
              return true;
            },
          }
        }
      }
    });

    router = new VueRouter();
  });
  it('renders', () => {
    const wrapper = shallowMount(FormSelectionPage, {
      store,
      router,
      localVue,
    });
    expect(wrapper.element).toBeDefined();
  });
});
