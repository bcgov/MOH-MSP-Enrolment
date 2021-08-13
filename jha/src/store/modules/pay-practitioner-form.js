import dummyData from '@/store/states/pay-practitioner-form-dummy-data';
import settings from '@/settings';

export const MODULE_NAME = 'payPractitionerForm';

// Action names.
export const RESET_FORM = 'resetForm';
export const SET_APPLICATION_UUID = 'setApplicationUuid';
export const SET_CAPTCHA_TOKEN = 'setCaptchaToken';
export const SET_SUBMISSION_DATE = 'setSubmissionDate';
export const SET_REFERENCE_NUMBER = 'setReferenceNumber';

export const SET_MEDICAL_SERVICE_CLAIMS_COUNT = 'setMedicalServiceClaimsCount';
export const SET_HOSPITAL_VISIT_CLAIMS_COUNT = 'setHospitalVisitClaimsCount';

export const SET_PLAN_REFERENCE_NUMBER = 'setPlanReferenceNumber';

export const SET_PHN = 'setPhn';
export const SET_DEPENDENT_NUMBER = 'setDependentNumber';
export const SET_FIRST_NAME = 'setFirstName';
export const SET_MIDDLE_INITIAL = 'setMiddleInitial';
export const SET_LAST_NAME = 'setLastName';
export const SET_BIRTH_DATE = 'setBirthDate';

export const SET_IS_VEHICLE_ACCIDENT = 'setIsVehicleAccident';
export const SET_VEHICLE_ACCIDENT_CLAIM_NUMBER = 'setVehicleAccidentClaimNumber';

export const SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM = 'setPlanReferenceNumberOfOriginalClaim';

export const SET_MEDICAL_SERVICE_CLAIMS = 'setMedicalServiceClaims';
export const SET_HOSPITAL_VISIT_CLAIMS = 'setHospitalVisitClaims';

export const SET_PRACTITIONER_LAST_NAME = 'setPractitionerLastName';
export const SET_PRACTITIONER_FIRST_NAME = 'setPractitionerFirstName';
export const SET_PRACTITIONER_PAYMENT_NUMBER = 'setPractitionerPaymentNumber';
export const SET_PRACTITIONER_PRACTITIONER_NUMBER = 'setPractitionerPractitionerNumber';
export const SET_PRACTITIONER_FACILITY_NUMBER = 'setPractitionerFacilityNumber';
export const SET_PRACTITIONER_SPECIALTY_CODE = 'setPractitionerSpecialtyCode';
export const SET_COVERAGE_PRE_AUTH_NUMBER = 'setCoveragePreAuthNumber';

export const SET_REFERRED_BY_FIRST_NAME_INITIAL = 'setReferredByFirstNameInitial';
export const SET_REFERRED_BY_LAST_NAME = 'setReferredByLastName';
export const SET_REFERRED_BY_PRACTITIONER_NUMBER = 'setReferredByPractitionerNumber';

export const SET_REFERRED_TO_FIRST_NAME_INITIAL = 'setReferredToFirstNameInitial';
export const SET_REFERRED_TO_LAST_NAME = 'setReferredToLastName';
export const SET_REFERRED_TO_PRACTITIONER_NUMBER = 'setReferredToPractitionerNumber';

export default {
  namespaced: true,
  state: () => {
    const state = {
      applicationUuid: null,
      captchaToken: null,
      submissionDate: null,
      referenceNumber: null,

      medicalServiceClaimsCount: null,
      hospitalVisitClaimsCount: null,

      planReferenceNumber: null,

      phn: null,
      dependentNumber: null,
      firstName: null,
      middleInitial: null,
      lastName: null,
      birthDate: null,

      isVehicleAccident: null,
      vehicleAccidentClaimNumber: null,

      planReferenceNumberOfOriginalClaim: null,

      medicalServiceClaims: [],
      hospitalVisitClaims: [],

      practitionerLastName: null,
      practitionerFirstName: null,
      practitionerPaymentNumber: null,
      practitionerPractitionerNumber: null,
      practitionerFacilityNumber: null,
      practitionerSpecialtyCode: null,
      coveragePreAuthNumber: null,

      referredByFirstNameInitial: null,
      referredByLastName: null,
      referredByPractitionerNumber: null,

      referredToFirstNameInitial: null,
      referredToLastName: null,
      referredToPractitionerNumber: null,
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
    [SET_MEDICAL_SERVICE_CLAIMS_COUNT](state, payload) {
      state.medicalServiceClaimsCount = payload;
    },
    [SET_HOSPITAL_VISIT_CLAIMS_COUNT](state, payload) {
      state.hospitalVisitClaimsCount = payload;
    },
    [SET_PLAN_REFERENCE_NUMBER](state, payload) {
      state.planReferenceNumber = payload;
    },
    [SET_PHN](state, payload) {
      state.phn = payload;
    },
    [SET_DEPENDENT_NUMBER](state, payload) {
      state.dependentNumber = payload;
    },
    [SET_FIRST_NAME](state, payload) {
      state.firstName = payload;
    },
    [SET_MIDDLE_INITIAL](state, payload) {
      state.middleInitial = payload;
    },
    [SET_LAST_NAME](state, payload) {
      state.lastName = payload;
    },
    [SET_BIRTH_DATE](state, payload) {
      state.birthDate = payload;
    },
    [SET_IS_VEHICLE_ACCIDENT](state, payload) {
      state.isVehicleAccident = payload;
    },
    [SET_VEHICLE_ACCIDENT_CLAIM_NUMBER](state, payload) {
      state.vehicleAccidentClaimNumber = payload;
    },
    [SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM](state, payload) {
      state.planReferenceNumberOfOriginalClaim = payload;
    },
    [SET_COVERAGE_PRE_AUTH_NUMBER](state, payload) {
      state.coveragePreAuthNumber = payload;
    },
    [SET_MEDICAL_SERVICE_CLAIMS](state, payload) {
      state.medicalServiceClaims = payload;
    },
    [SET_HOSPITAL_VISIT_CLAIMS](state, payload) {
      state.hospitalVisitClaims = payload;
    },
    [SET_PRACTITIONER_LAST_NAME](state, payload) {
      state.practitionerLastName = payload;
    },
    [SET_PRACTITIONER_FIRST_NAME](state, payload) {
      state.practitionerFirstName = payload;
    },
    [SET_PRACTITIONER_PAYMENT_NUMBER](state, payload) {
      state.practitionerPaymentNumber = payload;
    },
    [SET_PRACTITIONER_PRACTITIONER_NUMBER](state, payload) {
      state.practitionerPractitionerNumber = payload;
    },
    [SET_PRACTITIONER_FACILITY_NUMBER](state, payload) {
      state.practitionerFacilityNumber = payload;
    },
    [SET_PRACTITIONER_SPECIALTY_CODE](state, payload) {
      state.practitionerSpecialtyCode = payload;
    },
    [SET_REFERRED_BY_FIRST_NAME_INITIAL](state, payload) {
      state.referredByFirstNameInitial = payload;
    },
    [SET_REFERRED_BY_LAST_NAME](state, payload) {
      state.referredByLastName = payload;
    },
    [SET_REFERRED_BY_PRACTITIONER_NUMBER](state, payload) {
      state.referredByPractitionerNumber = payload;
    },
    [SET_REFERRED_TO_FIRST_NAME_INITIAL](state, payload) {
      state.referredToFirstNameInitial = payload;
    },
    [SET_REFERRED_TO_LAST_NAME](state, payload) {
      state.referredToLastName = payload;
    },
    [SET_REFERRED_TO_PRACTITIONER_NUMBER](state, payload) {
      state.referredToPractitionerNumber = payload;
    },
  },
  actions: {
    [RESET_FORM]({ commit }) {
      commit(SET_APPLICATION_UUID, null);
      commit(SET_CAPTCHA_TOKEN, null);
      commit(SET_SUBMISSION_DATE, null);
      commit(SET_REFERENCE_NUMBER, null);

      commit(SET_MEDICAL_SERVICE_CLAIMS_COUNT, null);
      commit(SET_HOSPITAL_VISIT_CLAIMS_COUNT, null);

      commit(SET_PLAN_REFERENCE_NUMBER, null);

      commit(SET_PHN, null);
      commit(SET_DEPENDENT_NUMBER, null);
      commit(SET_FIRST_NAME, null);
      commit(SET_MIDDLE_INITIAL, null);
      commit(SET_LAST_NAME, null);
      commit(SET_BIRTH_DATE, null);

      commit(SET_IS_VEHICLE_ACCIDENT, null);
      commit(SET_VEHICLE_ACCIDENT_CLAIM_NUMBER, null);

      commit(SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM, null);
      
      commit(SET_MEDICAL_SERVICE_CLAIMS, []);
      commit(SET_HOSPITAL_VISIT_CLAIMS, []);
      
      commit(SET_PRACTITIONER_LAST_NAME, null);
      commit(SET_PRACTITIONER_FIRST_NAME, null);
      commit(SET_PRACTITIONER_PAYMENT_NUMBER, null);
      commit(SET_PRACTITIONER_PRACTITIONER_NUMBER, null);
      commit(SET_PRACTITIONER_SPECIALTY_CODE, null);
      commit(SET_COVERAGE_PRE_AUTH_NUMBER, null);
      
      commit(SET_REFERRED_BY_FIRST_NAME_INITIAL, null);
      commit(SET_REFERRED_BY_LAST_NAME, null);
      commit(SET_REFERRED_BY_PRACTITIONER_NUMBER, null);
      
      commit(SET_REFERRED_TO_FIRST_NAME_INITIAL, null);
      commit(SET_REFERRED_TO_LAST_NAME, null);
      commit(SET_REFERRED_TO_PRACTITIONER_NUMBER, null);
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
    [SET_MEDICAL_SERVICE_CLAIMS_COUNT]({ commit }, payload) {
      commit(SET_MEDICAL_SERVICE_CLAIMS_COUNT, payload);
    },
    [SET_HOSPITAL_VISIT_CLAIMS_COUNT]({ commit }, payload) {
      commit(SET_HOSPITAL_VISIT_CLAIMS_COUNT, payload);
    },
    [SET_PLAN_REFERENCE_NUMBER]({ commit }, payload) {
      commit(SET_PLAN_REFERENCE_NUMBER, payload);
    },
    [SET_PHN]({ commit }, payload) {
      commit(SET_PHN, payload);
    },
    [SET_DEPENDENT_NUMBER]({ commit }, payload) {
      commit(SET_DEPENDENT_NUMBER, payload);
    },
    [SET_FIRST_NAME]({ commit }, payload) {
      commit(SET_FIRST_NAME, payload);
    },
    [SET_MIDDLE_INITIAL]({ commit }, payload) {
      commit(SET_MIDDLE_INITIAL, payload);
    },
    [SET_LAST_NAME]({ commit }, payload) {
      commit(SET_LAST_NAME, payload);
    },
    [SET_BIRTH_DATE]({ commit }, payload) {
      commit(SET_BIRTH_DATE, payload);
    },
    [SET_IS_VEHICLE_ACCIDENT]({ commit }, payload) {
      commit(SET_IS_VEHICLE_ACCIDENT, payload);
    },
    [SET_VEHICLE_ACCIDENT_CLAIM_NUMBER]({ commit }, payload) {
      commit(SET_VEHICLE_ACCIDENT_CLAIM_NUMBER, payload);
    },
    [SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM]({ commit }, payload) {
      commit(SET_PLAN_REFERENCE_NUMBER_OF_ORIGINAL_CLAIM, payload);
    },
    [SET_COVERAGE_PRE_AUTH_NUMBER]({ commit }, payload) {
      commit(SET_COVERAGE_PRE_AUTH_NUMBER, payload);
    },
    [SET_MEDICAL_SERVICE_CLAIMS]({ commit }, payload) {
      commit(SET_MEDICAL_SERVICE_CLAIMS, payload);
    },
    [SET_HOSPITAL_VISIT_CLAIMS]({ commit }, payload) {
      commit(SET_HOSPITAL_VISIT_CLAIMS, payload);
    },
    [SET_PRACTITIONER_LAST_NAME]({ commit }, payload) {
      commit(SET_PRACTITIONER_LAST_NAME, payload);
    },
    [SET_PRACTITIONER_FIRST_NAME]({ commit }, payload) {
      commit(SET_PRACTITIONER_FIRST_NAME, payload);
    },
    [SET_PRACTITIONER_PAYMENT_NUMBER]({ commit }, payload) {
      commit(SET_PRACTITIONER_PAYMENT_NUMBER, payload);
    },
    [SET_PRACTITIONER_PRACTITIONER_NUMBER]({ commit }, payload) {
      commit(SET_PRACTITIONER_PRACTITIONER_NUMBER, payload);
    },
    [SET_PRACTITIONER_FACILITY_NUMBER]({ commit }, payload) {
      commit(SET_PRACTITIONER_FACILITY_NUMBER, payload);
    },
    [SET_PRACTITIONER_SPECIALTY_CODE]({ commit }, payload) {
      commit(SET_PRACTITIONER_SPECIALTY_CODE, payload);
    },
    [SET_REFERRED_BY_FIRST_NAME_INITIAL]({ commit }, payload) {
      commit(SET_REFERRED_BY_FIRST_NAME_INITIAL, payload);
    },
    [SET_REFERRED_BY_LAST_NAME]({ commit }, payload) {
      commit(SET_REFERRED_BY_LAST_NAME, payload);
    },
    [SET_REFERRED_BY_PRACTITIONER_NUMBER]({ commit }, payload) {
      commit(SET_REFERRED_BY_PRACTITIONER_NUMBER, payload);
    },
    [SET_REFERRED_TO_FIRST_NAME_INITIAL]({ commit }, payload) {
      commit(SET_REFERRED_TO_FIRST_NAME_INITIAL, payload);
    },
    [SET_REFERRED_TO_LAST_NAME]({ commit }, payload) {
      commit(SET_REFERRED_TO_LAST_NAME, payload);
    },
    [SET_REFERRED_TO_PRACTITIONER_NUMBER]({ commit }, payload) {
      commit(SET_REFERRED_TO_PRACTITIONER_NUMBER, payload);
    },
  },
  getters: {}
};
