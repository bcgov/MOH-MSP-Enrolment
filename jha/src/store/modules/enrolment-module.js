import dummyData from '@/store/states/enrolment-module-dummy-data';
import settings from '@/settings';

export const MODULE_NAME = 'enrolmentModule';

// Action names.
export const RESET_FORM = 'resetForm';
export const SET_APPLICATION_UUID = 'setApplicationUuid';
export const SET_CAPTCHA_TOKEN = 'setCaptchaToken';
export const SET_SUBMISSION_DATE = 'setSubmissionDate';
export const SET_REFERENCE_NUMBER = 'setReferenceNumber';
// Spouse info
export const SET_HAS_SPOUSE = 'setHasSpouse';
export const SET_SPOUSE_STATUS = 'setSpouseStatus';
export const SET_SPOUSE_STATUS_REASON = 'setSpouseStatusReason';
export const SET_SPOUSE_FIRST_NAME = 'setSpouseFirstName';
export const SET_SPOUSE_MIDDLE_NAME = 'setSpouseMiddleName';
export const SET_SPOUSE_LAST_NAME = 'setSpouseLastName';
export const SET_SPOUSE_BIRTH_DATE = 'setSpouseBirthDate';
export const SET_SPOUSE_GENDER = 'setSpouseGender';
export const SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH = 'setSpouseLivedInBCSinceBirth';
export const SET_SPOUSE_MADE_PERMANENT_MOVE = 'setSpouseMadePermanentMove';
export const SET_SPOUSE_MOVED_FROM = 'setSpouseMovedFrom';
export const SET_SPOUSE_RECENT_BC_MOVE_DATE = 'setSpouseRecentBCMoveDate';
export const SET_SPOUSE_CANADA_ARRIVAL_DATE = 'setSpouseCanadaArrivalDate';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS = 'setSpouseOutsideBCLast12Months';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON = 'setSpouseOutsideBCLast12MonthsReason';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION = 'setSpouseOutsideBCLast12MonthsDestination';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE = 'setSpouseOutsideBCLast12MonthsDepartureDate';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE = 'setSpouseOutsideBCLast12MonthsReturnDate';
export const SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER = 'setSpouseHasPreviousBCHealthNumber';
export const SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER = 'setSpousePreviousBCHealthNumber';
export const SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION = 'setSpouseBeenReleasedFromInstitution';
export const SET_SPOUSE_DISCHARGE_DATE = 'setSpouseDischargeDate';

export default {
  namespaced: true,
  state: () => {
    const state = {
      applicationUuid: null,
      captchaToken: null,
      submissionDate: null,
      referenceNumber: null,
      // Spouse info
      hasSpouse: null,
      spouseStatus: null,
      spouseStatusReason: null,
      spouseFirstName: null,
      spouseMiddleName: null,
      spouseLastName: null,
      spouseBirthDate: null,
      spouseGender: null,
      spouseLivedInBCSinceBirth: null,
      spouseMadePermanentMove: null,
      spouseMovedFrom: null,
      spouseRecentBCMoveDate: null,
      spouseCanadaArrivalDate: null,
      spouseOutsideBCLast12Months: null,
      spouseOutsideBCLast12MonthsReason: null,
      spouseOutsideBCLast12MonthsDestination: null,
      spouseOutsideBCLast12MonthsDepartureDate: null,
      spouseOutsideBCLast12MonthsReturnDate: null,
      spouseHasPreviousBCHealthNumber: null,
      spousePreviousBCHealthNumber: null,
      spouseBeenReleasedFromInstitution: null,
      spouseDischargeDate: null,
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
    // Spouse info
    [SET_HAS_SPOUSE](state, payload) {
      state.hasSpouse = payload;
    },
    [SET_SPOUSE_STATUS](state, payload) {
      state.spouseStatus = payload;
    },
    [SET_SPOUSE_STATUS_REASON](state, payload) {
      state.spouseStatusReason = payload;
    },
    [SET_SPOUSE_FIRST_NAME](state, payload) {
      state.spouseFirstName = payload;
    },
    [SET_SPOUSE_MIDDLE_NAME](state, payload) {
      state.spouseMiddleName = payload;
    },
    [SET_SPOUSE_LAST_NAME](state, payload) {
      state.spouseLastName = payload;
    },
    [SET_SPOUSE_BIRTH_DATE](state, payload) {
      state.spouseBirthDate = payload;
    },
    [SET_SPOUSE_GENDER](state, payload) {
      state.spouseGender = payload;
    },
    [SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH](state, payload) {
      state.spouseLivedInBCSinceBirth = payload;
    },
    [SET_SPOUSE_MADE_PERMANENT_MOVE](state, payload) {
      state.spouseMadePermanentMove = payload;
    },
    [SET_SPOUSE_MOVED_FROM](state, payload) {
      state.spouseMovedFrom = payload;
    },
    [SET_SPOUSE_RECENT_BC_MOVE_DATE](state, payload) {
      state.spouseRecentBCMoveDate = payload;
    },
    [SET_SPOUSE_CANADA_ARRIVAL_DATE](state, payload) {
      state.spouseCanadaArrivalDate = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS](state, payload) {
      state.spouseOutsideBCLast12Months = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON](state, payload) {
      state.spouseOutsideBCLast12MonthsReason = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION](state, payload) {
      state.spouseOutsideBCLast12MonthsDestination = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE](state, payload) {
      state.spouseOutsideBCLast12MonthsDepartureDate = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE](state, payload) {
      state.spouseOutsideBCLast12MonthsReturnDate = payload;
    },
    [SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER](state, payload) {
      state.spouseHasPreviousBCHealthNumber = payload;
    },
    [SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER](state, payload) {
      state.spousePreviousBCHealthNumber = payload;
    },
    [SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION](state, payload) {
      state.spouseBeenReleasedFromInstitution = payload;
    },
    [SET_SPOUSE_DISCHARGE_DATE](state, payload) {
      state.spouseDischargeDate = payload;
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
    // Spouse info
    [SET_HAS_SPOUSE]({ commit }, payload) {
     commit(SET_HAS_SPOUSE, payload);
    },
    [SET_SPOUSE_STATUS]({ commit }, payload) {
      commit(SET_SPOUSE_STATUS, payload);
    },
    [SET_SPOUSE_STATUS_REASON]({ commit }, payload) {
      commit(SET_SPOUSE_STATUS_REASON, payload);
    },
    [SET_SPOUSE_FIRST_NAME]({ commit }, payload) {
      commit(SET_SPOUSE_FIRST_NAME, payload);
    },
    [SET_SPOUSE_MIDDLE_NAME]({ commit }, payload) {
      commit(SET_SPOUSE_MIDDLE_NAME, payload);
    },
    [SET_SPOUSE_LAST_NAME]({ commit }, payload) {
      commit(SET_SPOUSE_LAST_NAME, payload);
    },
    [SET_SPOUSE_BIRTH_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_BIRTH_DATE, payload);
    },
    [SET_SPOUSE_GENDER]({ commit }, payload) {
      commit(SET_SPOUSE_GENDER, payload);
    },
    [SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH]({ commit }, payload) {
      commit(SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH, payload);
    },
    [SET_SPOUSE_MADE_PERMANENT_MOVE]({ commit }, payload) {
      commit(SET_SPOUSE_MADE_PERMANENT_MOVE, payload);
    },
    [SET_SPOUSE_MOVED_FROM]({ commit }, payload) {
      commit(SET_SPOUSE_MOVED_FROM, payload);
    },
    [SET_SPOUSE_RECENT_BC_MOVE_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_RECENT_BC_MOVE_DATE, payload);
    },
    [SET_SPOUSE_CANADA_ARRIVAL_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_CANADA_ARRIVAL_DATE, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, payload);
    },
    [SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER]({ commit }, payload) {
      commit(SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER, payload);
    },
    [SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER]({ commit }, payload) {
      commit(SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER, payload);
    },
    [SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION]({ commit }, payload) {
      commit(SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION, payload);
    },
    [SET_SPOUSE_DISCHARGE_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_DISCHARGE_DATE, payload);
    },
  },
  getters: {}
};
