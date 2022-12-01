import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';
import SubmissionPage from '@/views/enrolment/SubmissionPage.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fpcAddressUpdateMiddlewareHTML } from "../../fixtures.js";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.component('font-awesome-icon', FontAwesomeIcon);

describe('Enrolment - FormSelectionPage.vue', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      applicationUuid: null,
      submissionAPIResponse: {
        fpc: {
          returnCode: '0',
          message: fpcAddressUpdateMiddlewareHTML,
        }
      },
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
        }
      }
    });
  });

  it('Shows next steps message for successful FPC only applications', () => {
    const wrapper = shallowMount(SubmissionPage, {
      store,
      localVue,
    });
    const middlwareResponseContainer = wrapper.get('.fpc-success-message');
  });
});
