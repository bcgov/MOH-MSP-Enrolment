export const MODULE_NAME = 'appModule';

export const SET_SHOW_MOBILE_STEPPER_DETAILS = 'setShowMobileStepperDetails';
export const SET_DEDUCTIBLES_API_DATA = 'setDeductiblesAPIData';

export default {
  namespaced: true,
  state: () => {
    const state = {
      showMobileStepperDetails: false,
      deductiblesAPIData: null,
    };
    return state;
  },
  mutations: {
    [SET_SHOW_MOBILE_STEPPER_DETAILS](state, payload) {
      state.showMobileStepperDetails = payload;
    },
    [SET_DEDUCTIBLES_API_DATA](state, payload) {
      state.deductiblesAPIData = payload;
    },
  },
  actions: {
    [SET_SHOW_MOBILE_STEPPER_DETAILS]({ commit }, payload) {
      commit(SET_SHOW_MOBILE_STEPPER_DETAILS, payload);
    },
    [SET_DEDUCTIBLES_API_DATA]({ commit }, payload) {
      commit(SET_DEDUCTIBLES_API_DATA, payload);
    },
  },
  getters: {}
};
