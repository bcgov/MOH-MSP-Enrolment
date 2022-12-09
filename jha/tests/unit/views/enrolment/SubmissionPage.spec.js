import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import router from '@/router';
import SubmissionPage from '@/views/enrolment/SubmissionPage.vue';
import appModule from "@/store/modules/app-module.js";
import { fpcAddressUpdateMiddlewareHTML } from "../../fixtures.js";

const enrolmentModuleState = {
  applicationUuid: null,
  submissionAPIResponse: {
    fpc: {
      returnCode: '0',
      message: fpcAddressUpdateMiddlewareHTML,
    }
  },
  children: [],
};

const store = createStore({
  modules: {
    appModule,
    enrolmentModule: {
      state: () => enrolmentModuleState,
    },
  }
});

jest.mock("@/services/log-service.js", () => ({
  logError: jest.fn(() => Promise.resolve(true)),
  logNavigation: jest.fn(() => Promise.resolve(true)),
}));

describe('Enrolment - FormSelectionPage.vue', () => {

  it('Shows next steps message for successful FPC only applications', () => {
    const wrapper = shallowMount(SubmissionPage, {
      store,
      localVue,
    });
    wrapper.get('.fpc-success-message');
  });
});
