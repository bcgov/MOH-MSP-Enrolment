import { shallowMount } from '@vue/test-utils';
// import { createStore } from 'vuex';
// import { createRouter } from 'vue-router';
import router from '@/router';
import store from '@/store';
import FormSelectionPage from '@/views/enrolment/FormSelectionPage.vue';
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/services/log-service.js", () => {
  return {
    default: {
      logError: vi.fn(() => Promise.resolve(true)),
      logNavigation: vi.fn(() => Promise.resolve(true)),
    },
  };
});

describe('Enrolment - FormSelectionPage.vue', () => {

  it('renders', () => {
    const wrapper = shallowMount(FormSelectionPage, {
      global: {
        plugins: [router, store]
      }
    });

    expect(wrapper.element).toBeDefined();
  });
});
