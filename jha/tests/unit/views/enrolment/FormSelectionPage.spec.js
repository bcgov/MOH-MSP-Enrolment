import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { createRouter } from 'vue-router';
import router from '@/router';
import store from '@/store';
import FormSelectionPage from '@/views/enrolment/FormSelectionPage.vue';

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
