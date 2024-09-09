import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import router from '@/router';
import SubmissionPage from '@/views/enrolment/SubmissionPage.vue';
import appModule from "@/store/modules/app-module.js";
import { fpcAddressUpdateMiddlewareHTML } from "../../fixtures.js";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

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

vi.mock("@/services/api-service.js", () => {
  return {
    default: {
      logError: vi.fn(() => Promise.resolve(true)),
      logNavigation: vi.fn(() => Promise.resolve(true)),
    },
  };
});

vi.mock("@/services/log-service.js", () => {
  return {
    default: {
      logError: vi.fn(() => Promise.resolve(true)),
      logNavigation: vi.fn(() => Promise.resolve(true)),
    },
  };
});

describe('Enrolment - FormSelectionPage.vue', () => {

  it('Shows next steps message for successful FPC only applications', () => {
    const wrapper = mount(SubmissionPage, {
      global: {
        stubs: {
          'font-awesome-icon': {
              template: '<i />'
          },
        },
        plugins: [router, store]
      }
    });
    const middlwareResponseContainer = wrapper.get('.fpc-success-message');
    expect(middlwareResponseContainer).not.toBeFalsy();
  });
});
