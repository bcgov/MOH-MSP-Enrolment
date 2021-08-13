export const MODULE_NAME = 'app';

export const SET_SHOW_MOBILE_STEPPER_DETAILS = 'setShowMobileStepperDetails';

export default {
  namespaced: true,
  state: () => {
    const state = {
      showMobileStepperDetails: false,
    };
    return state;
  },
  mutations: {
    [SET_SHOW_MOBILE_STEPPER_DETAILS](state, payload) {
      state.showMobileStepperDetails = payload;
    },
  },
  actions: {
    [SET_SHOW_MOBILE_STEPPER_DETAILS]({ commit }, payload) {
      commit(SET_SHOW_MOBILE_STEPPER_DETAILS, payload);
    },
  },
  getters: {}
};
