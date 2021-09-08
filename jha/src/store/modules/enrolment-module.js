import dummyData from '@/store/states/enrolment-module-dummy-data';
import settings from '@/settings';

export const MODULE_NAME = 'enrolmentModule';

// Action names.
export const RESET_FORM = 'resetForm';
export const SET_APPLICATION_UUID = 'setApplicationUuid';
export const SET_CAPTCHA_TOKEN = 'setCaptchaToken';
export const SET_SUBMISSION_DATE = 'setSubmissionDate';
export const SET_REFERENCE_NUMBER = 'setReferenceNumber';

export default {
  namespaced: true,
  state: () => {
    const state = {
      applicationUuid: null,
      captchaToken: null,
      submissionDate: null,
      referenceNumber: null,
    };
    if (settings.useDummyData) {
      Object.assign(state, dummyData);
    }
    return state;
  },
  mutations: {
    [SET_APPLICATION_UUID](state, payload) {
      state.applicationUuid = payload;
    },
    [SET_CAPTCHA_TOKEN](state, payload) {
      state.captchaToken = payload;
    },
    [SET_SUBMISSION_DATE](state, payload) {
      state.submissionDate = payload;
    },
    [SET_REFERENCE_NUMBER](state, payload) {
      state.referenceNumber = payload;
    },
  },
  actions: {
    [RESET_FORM]({ commit }) {
      commit(SET_APPLICATION_UUID, null);
      commit(SET_CAPTCHA_TOKEN, null);
      commit(SET_SUBMISSION_DATE, null);
      commit(SET_REFERENCE_NUMBER, null);
    },
    [SET_APPLICATION_UUID]({ commit }, payload) {
      commit(SET_APPLICATION_UUID, payload);
    },
    [SET_CAPTCHA_TOKEN]({ commit }, payload) {
      commit(SET_CAPTCHA_TOKEN, payload);
    },
    [SET_SUBMISSION_DATE]({ commit }, payload) {
      commit(SET_SUBMISSION_DATE, payload);
    },
    [SET_REFERENCE_NUMBER]({ commit }, payload) {
      commit(SET_REFERENCE_NUMBER, payload);
    },
  },
  getters: {}
};
