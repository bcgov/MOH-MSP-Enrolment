import dummyData from '@/store/states/enrolment-module-dummy-data';
import settings from '@/settings';

export const MODULE_NAME = 'enrolmentModule';

// Action names.
export const RESET_FORM = 'resetForm';
export const SET_APPLICATION_UUID = 'setApplicationUuid';
export const SET_CAPTCHA_TOKEN = 'setCaptchaToken';
export const SET_SUBMISSION_DATE = 'setSubmissionDate';
export const SET_REFERENCE_NUMBER = 'setReferenceNumber';
// Form selections
export const SET_IS_APPLYING_FOR_MSP = 'setIsApplyingForMSP';
export const SET_IS_APPLYING_FOR_FPCARE = 'setIsApplyingForFPCare';
export const SET_IS_APPLYING_FOR_SUPP_BEN = 'setIsApplyingForSuppBen';
// Account Holder info.
export const SET_AH_FIRST_NAME = 'setAHFirstName';
export const SET_AH_MIDDLE_NAME = 'setAHMiddleName';
export const SET_AH_LAST_NAME = 'setAHLastName';
export const SET_AH_BIRTHDATE = 'setAHBirthdate';
export const SET_AH_SIN = 'setAHSIN';
export const SET_AH_GENDER = 'setAHGender';
export const SET_AH_CITIZENSHIP_STATUS = 'setAHCitizenshipStatus';
export const SET_AH_CITIZENSHIP_STATUS_REASON = 'setAHCitizenshipStatusReason';
export const SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE = 'setAHCitizenshipSupportDocumentType';
export const SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS = 'setAHCitizenshipSupportDocuments';
export const SET_AH_IS_NAME_CHANGED = 'setAHIsNameChanged';
export const SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE = 'setAHNameChangeSupportDocumentType';
export const SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS = 'setAHNameChangeSupportDocuments';
export const SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH = 'setAHHasLivedInBCSinceBirth';
export const SET_AH_IS_MOVED_TO_BC_PERMANENTLY = 'setAHIsMovedToBCPermanently';
export const SET_AH_MOVE_FROM_ORIGIN = 'setAHMoveFromOrigin';
export const SET_AH_ARRIVAL_DATE_IN_BC = 'setAHArrivalDateInBC';
export const SET_AH_ARRIVAL_DATE_IN_CANADA = 'setAHArrivalDateInCanada';
export const SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS = 'setAHOutsideBCLast12Months';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON = 'setAHOutsideBCLast12MonthsReason';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION = 'setAHOutsideBCLast12MonthsLocation';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE = 'setAHOutsideBCLast12MonthsDepartureDate';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE = 'setAHOutsideBCLast12MonthsReturnDate';
export const SET_AH_HAS_PREVIOUS_PHN = 'setAHHasPreviousPHN';
export const SET_AH_PREVIOUS_PHN = 'setAHPreviousPHN';
export const SET_AH_IS_RELEASED_FROM_ARMED_FORCES = 'setIsReleasedFromArmedForces';
export const SET_AH_ARMED_FORCES_DISCHARGE_DATE = 'setArmedForcesDischargeDate';
export const SET_AH_IS_STUDENT = 'setAHIsStudent';
export const SET_AH_WILL_STUDENT_RESIDE_IN_BC = 'setAHWillStudentResideInBC';
export const SET_AH_CRA_DOCUMENTS = 'setAHCRADocuments';
export const SET_AH_FPC_INCOME = 'setAHFPCIncome';
export const SET_AH_FPC_RDSP = 'setAHFPCRDSP';
// Spouse info
export const SET_HAS_SPOUSE = 'setHasSpouse';
export const SET_SPOUSE_STATUS = 'setSpouseStatus';
export const SET_SPOUSE_STATUS_REASON = 'setSpouseStatusReason';
export const SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE = 'setSpouseCitizenshipSupportDocumentType';
export const SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS = 'setSpouseCitizenshipSupportDocuments';
export const SET_SPOUSE_IS_NAME_CHANGED = 'setSpouseIsNameChanged';
export const SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE = 'setSpouseNameChangeSupportDocumentType';
export const SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS = 'setSpouseNameChangeSupportDocuments';
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
export const SET_SPOUSE_CRA_DOCUMENTS = 'setSpouseCRADocuments';
export const SET_SPOUSE_FPC_INCOME = 'setSpouseFPCIncome';
export const SET_SPOUSE_FPC_RDSP = 'setSpouseFPCRDSP';
// Child info
export const SET_HAS_CHILDREN = 'setHasChildren';
export const SET_CHILDREN = 'setChildren';
// Contact info
export const SET_RES_ADDRESS_LINE_1 = 'setResAddressLine1';
export const SET_RES_ADDRESS_LINE_2 = 'setResAddressLine2';
export const SET_RES_ADDRESS_LINE_3 = 'setResAddressLine3';
export const SET_RES_CITY = 'setResCity';
export const SET_RES_PROVINCE = 'setResProvince';
export const SET_RES_COUNTRY = 'setResCountry';
export const SET_RES_POSTAL_CODE = 'setResPostalCode';
export const SET_MAIL_ADDRESS_LINE_1 = 'setMailAddressLine1';
export const SET_MAIL_ADDRESS_LINE_2 = 'setMailAddressLine2';
export const SET_MAIL_ADDRESS_LINE_3 = 'setMailAddressLine3';
export const SET_MAIL_CITY = 'setMailCity';
export const SET_MAIL_PROVINCE = 'setMailProvince';
export const SET_MAIL_COUNTRY = 'setMailCountry';
export const SET_MAIL_POSTAL_CODE = 'setMailPostalCode';
export const SET_IS_MAIL_SAME = 'setIsMailSame';
export const SET_PHONE = 'setPhone';

export default {
  namespaced: true,
  state: () => {
    const state = {
      applicationUuid: null,
      captchaToken: null,
      submissionDate: null,
      referenceNumber: null,
      // Form selections
      isApplyingForMSP: false,
      isApplyingForFPCare: false,
      isApplyingForSuppBen: false,
      // Account Holder info.
      ahFirstName: null,
      ahMiddleName: null,
      ahLastName: null,
      ahBirthdate: null,
      ahSIN: null,
      ahGender: null,
      ahCitizenshipStatus: null,
      ahCitizenshipStatusReason: null,
      ahCitizenshipSupportDocumentType: null,
      ahCitizenshipSupportDocuments: [],
      ahIsNameChanged: null,
      ahNameChangeSupportDocumentType: null,
      ahNameChangeSupportDocuments: [],
      ahHasLivedInBCSinceBirth: null,
      ahIsMovedToBCPermanently: null,
      ahMoveFromOrigin: null,
      ahArrivalDateInBC: null,
      ahArrivalDateInCanada: null,
      ahIsOutsideBCLast12Months: null,
      ahOutsideBCLast12MonthsReason: null,
      ahOutsideBCLast12MonthsLocation: null,
      ahOutsideBCLast12MonthsDepartureDate: null,
      ahOutsideBCLast12MonthsReturnDate: null,
      ahHasPreviousPHN: null,
      ahPreviousPHN: null,
      ahIsReleasedFromArmedForces: null,
      ahArmedForcesDischargeDate: null,
      ahIsStudent: null,
      ahWillStudentResideInBC: null,
      ahCRADocuments: [],
      ahFPCIncome: null,
      ahFPCRDSP: null,
      // Spouse info
      hasSpouse: null,
      spouseStatus: null,
      spouseStatusReason: null,
      spouseCitizenshipSupportDocumentType: null,
      spouseCitizenshipSupportDocuments: [],
      spouseIsNameChanged: null,
      spouseNameChangeSupportDocumentType: null,
      spouseNameChangeSupportDocuments: [],
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
      spouseCRADocuments: [],
      spouseFPCIncome: null,
      spouseFPCRDSP: null,
      // Child info
      hasChildren: null,
      children: [],
      // Contact info
      resAddressLine1: null,
      resAddressLine2: null,
      resAddressLine3: null,
      resCity: null,
      resProvince: "British Columbia",
      resCountry: "Canada",
      resPostalCode: null,
      mailAddressLine1: null,
      mailAddressLine2: null,
      mailAddressLine3: null,
      mailCity: null,
      mailProvince: "British Columbia",
      mailCountry: "Canada",
      mailPostalCode: null,
      isMailSame: true,
      phone: null,
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
    // Form selections
    [SET_IS_APPLYING_FOR_MSP](state, payload) {
      state.isApplyingForMSP = payload;
    },
    [SET_IS_APPLYING_FOR_FPCARE](state, payload) {
      state.isApplyingForFPCare = payload;
    },
    [SET_IS_APPLYING_FOR_SUPP_BEN](state, payload) {
      state.isApplyingForSuppBen = payload;
    },
    // Account Holder info.
    [SET_AH_FIRST_NAME](state, payload) {
      state.ahFirstName = payload;
    },
    [SET_AH_MIDDLE_NAME](state, payload) {
      state.ahMiddleName = payload;
    },
    [SET_AH_LAST_NAME](state, payload) {
      state.ahLastName = payload;
    },
    [SET_AH_BIRTHDATE](state, payload) {
      state.ahBirthdate = payload;
    },
    [SET_AH_SIN](state, payload) {
      state.ahSIN = payload;
    },
    [SET_AH_GENDER](state, payload) {
      state.ahGender = payload;
    },
    [SET_AH_CITIZENSHIP_STATUS](state, payload) {
      state.ahCitizenshipStatus = payload;
    },
    [SET_AH_CITIZENSHIP_STATUS_REASON](state, payload) {
      state.ahCitizenshipStatusReason = payload;
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.ahCitizenshipSupportDocumentType = payload;
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS](state, payload) {
      state.ahCitizenshipSupportDocuments = payload;
    },
    [SET_AH_IS_NAME_CHANGED](state, payload) {
      state.ahIsNameChanged = payload;
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.ahNameChangeSupportDocumentType = payload;
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS](state, payload) {
      state.ahNameChangeSupportDocuments = payload;
    },
    [SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH](state, payload) {
      state.ahHasLivedInBCSinceBirth = payload;
    },
    [SET_AH_IS_MOVED_TO_BC_PERMANENTLY](state, payload) {
      state.ahIsMovedToBCPermanently = payload;
    },
    [SET_AH_MOVE_FROM_ORIGIN](state, payload) {
      state.ahMoveFromOrigin = payload;
    },
    [SET_AH_ARRIVAL_DATE_IN_BC](state, payload) {
      state.ahArrivalDateInBC = payload;
    },
    [SET_AH_ARRIVAL_DATE_IN_CANADA](state, payload) {
      state.ahArrivalDateInCanada = payload;
    },
    [SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS](state, payload) {
      state.ahIsOutsideBCLast12Months = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON](state, payload) {
      state.ahOutsideBCLast12MonthsReason = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION](state, payload) {
      state.ahOutsideBCLast12MonthsLocation = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE](state, payload) {
      state.ahOutsideBCLast12MonthsDepartureDate = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE](state, payload) {
      state.ahOutsideBCLast12MonthsReturnDate = payload;
    },
    [SET_AH_HAS_PREVIOUS_PHN](state, payload) {
      state.ahHasPreviousPHN = payload;
    },
    [SET_AH_PREVIOUS_PHN](state, payload) {
      state.ahPreviousPHN = payload;
    },
    [SET_AH_IS_RELEASED_FROM_ARMED_FORCES](state, payload) {
      state.ahIsReleasedFromArmedForces = payload;
    },
    [SET_AH_ARMED_FORCES_DISCHARGE_DATE](state, payload) {
      state.ahArmedForcesDischargeDate = payload;
    },
    [SET_AH_IS_STUDENT](state, payload) {
      state.ahIsStudent = payload;
    },
    [SET_AH_WILL_STUDENT_RESIDE_IN_BC](state, payload) {
      state.ahWillStudentResideInBC = payload;
    },
    [SET_AH_CRA_DOCUMENTS](state, payload) {
      state.ahCRADocuments = payload;
    },
    [SET_AH_FPC_INCOME](state, payload) {
      state.ahFPCIncome = payload;
    },
    [SET_AH_FPC_RDSP](state, payload) {
      state.ahFPCRDSP = payload;
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
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.spouseCitizenshipSupportDocumentType = payload;
    },
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS](state, payload) {
      state.spouseCitizenshipSupportDocuments = payload;
    },
    [SET_SPOUSE_IS_NAME_CHANGED](state, payload) {
      state.spouseIsNameChanged = payload;
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.spouseNameChangeSupportDocumentType = payload;
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS](state, payload) {
      state.spouseNameChangeSupportDocuments = payload;
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
    [SET_SPOUSE_CRA_DOCUMENTS](state, payload) {
      state.spouseCRADocuments = payload;
    },
    [SET_SPOUSE_FPC_INCOME](state, payload) {
      state.spouseFPCIncome = payload;
    },
    [SET_SPOUSE_FPC_RDSP](state, payload) {
      state.spouseFPCRDSP = payload;
    },
    // Child info
    [SET_HAS_CHILDREN](state, payload) {
      state.hasChildren = payload;
    },
    [SET_CHILDREN](state, payload) {
      state.children = payload;
    },
    // Contact info
    [SET_RES_ADDRESS_LINE_1](state, payload) {
      state.resAddressLine1 = payload;
    },
    [SET_RES_ADDRESS_LINE_2](state, payload) {
      state.resAddressLine2 = payload;
    },
    [SET_RES_ADDRESS_LINE_3](state, payload) {
      state.resAddressLine3 = payload;
    },
    [SET_RES_CITY](state, payload) {
      state.resCity = payload;
    },
    [SET_RES_PROVINCE](state, payload) {
      state.resProvince = payload;
    },
    [SET_RES_COUNTRY](state, payload) {
      state.resCountry = payload;
    },
    [SET_RES_POSTAL_CODE](state, payload) {
      state.resPostalCode = payload;
    },
    [SET_MAIL_ADDRESS_LINE_1](state, payload) {
      state.mailAddressLine1 = payload;
    },
    [SET_MAIL_ADDRESS_LINE_2](state, payload) {
      state.mailAddressLine2 = payload;
    },
    [SET_MAIL_ADDRESS_LINE_3](state, payload) {
      state.mailAddressLine3 = payload;
    },
    [SET_MAIL_CITY](state, payload) {
      state.mailCity = payload;
    },
    [SET_MAIL_PROVINCE](state, payload) {
      state.mailProvince = payload;
    },
    [SET_MAIL_COUNTRY](state, payload) {
      state.mailCountry = payload;
    },
    [SET_MAIL_POSTAL_CODE](state, payload) {
      state.mailPostalCode = payload;
    },
    [SET_IS_MAIL_SAME](state, payload) {
      state.isMailSame = payload;
    },
    [SET_PHONE](state, payload) {
      state.phone = payload;
    },
  },
  actions: {
    [RESET_FORM]({ commit }) {
      commit(SET_APPLICATION_UUID, null);
      commit(SET_CAPTCHA_TOKEN, null);
      commit(SET_SUBMISSION_DATE, null);
      commit(SET_REFERENCE_NUMBER, null);
      // Form selections
      commit(SET_IS_APPLYING_FOR_MSP, false);
      commit(SET_IS_APPLYING_FOR_FPCARE, false);
      commit(SET_IS_APPLYING_FOR_SUPP_BEN, false);
      // Account Holder info.
      commit(SET_AH_FIRST_NAME, null);
      commit(SET_AH_MIDDLE_NAME, null);
      commit(SET_AH_LAST_NAME, null);
      commit(SET_AH_BIRTHDATE, null);
      commit(SET_AH_SIN, null);
      commit(SET_AH_GENDER, null);
      commit(SET_AH_CITIZENSHIP_STATUS, null);
      commit(SET_AH_CITIZENSHIP_STATUS_REASON, null);
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS, []);
      commit(SET_AH_IS_NAME_CHANGED, null);
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS, []);
      commit(SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH, null);
      commit(SET_AH_IS_MOVED_TO_BC_PERMANENTLY, null);
      commit(SET_AH_MOVE_FROM_ORIGIN, null);
      commit(SET_AH_ARRIVAL_DATE_IN_BC, null);
      commit(SET_AH_ARRIVAL_DATE_IN_CANADA, null);
      commit(SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, null);
      commit(SET_AH_HAS_PREVIOUS_PHN, null);
      commit(SET_AH_PREVIOUS_PHN, null);
      commit(SET_AH_IS_RELEASED_FROM_ARMED_FORCES, null);
      commit(SET_AH_ARMED_FORCES_DISCHARGE_DATE, null);
      commit(SET_AH_IS_STUDENT, null);
      commit(SET_AH_WILL_STUDENT_RESIDE_IN_BC, null);
      commit(SET_AH_CRA_DOCUMENTS, []);
      commit(SET_AH_FPC_INCOME, null);
      commit(SET_AH_FPC_RDSP, null);
      // Spouse info
      commit(SET_HAS_SPOUSE, null);
      commit(SET_SPOUSE_STATUS, null);
      commit(SET_SPOUSE_STATUS_REASON, null);
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS, []);
      commit(SET_SPOUSE_IS_NAME_CHANGED, null);
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS, []);
      commit(SET_SPOUSE_FIRST_NAME, null);
      commit(SET_SPOUSE_MIDDLE_NAME, null);
      commit(SET_SPOUSE_LAST_NAME, null);
      commit(SET_SPOUSE_BIRTH_DATE, null);
      commit(SET_SPOUSE_GENDER, null);
      commit(SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH, null);
      commit(SET_SPOUSE_MADE_PERMANENT_MOVE, null);
      commit(SET_SPOUSE_MOVED_FROM, null);
      commit(SET_SPOUSE_RECENT_BC_MOVE_DATE, null);
      commit(SET_SPOUSE_CANADA_ARRIVAL_DATE, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, null);
      commit(SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER, null);
      commit(SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER, null);
      commit(SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION, null);
      commit(SET_SPOUSE_DISCHARGE_DATE, null);
      commit(SET_SPOUSE_CRA_DOCUMENTS, []);
      commit(SET_SPOUSE_FPC_INCOME, null);
      commit(SET_SPOUSE_FPC_RDSP, null);
      // Child info
      commit(SET_HAS_CHILDREN, null);
      commit(SET_CHILDREN, []);
      //contact info
      commit(SET_RES_ADDRESS_LINE_1, null);
      commit(SET_RES_ADDRESS_LINE_2, null);
      commit(SET_RES_ADDRESS_LINE_3, null);
      commit(SET_RES_CITY, null);
      commit(SET_RES_PROVINCE, null);
      commit(SET_RES_COUNTRY, null);
      commit(SET_RES_POSTAL_CODE, null);
      commit(SET_MAIL_ADDRESS_LINE_1, null);
      commit(SET_MAIL_ADDRESS_LINE_2, null);
      commit(SET_MAIL_ADDRESS_LINE_3, null);
      commit(SET_MAIL_CITY, null);
      commit(SET_MAIL_PROVINCE, null);
      commit(SET_MAIL_COUNTRY, null);
      commit(SET_MAIL_POSTAL_CODE, null);
      commit(SET_IS_MAIL_SAME, true);
      commit(SET_PHONE, null);
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
    // Form selections
    [SET_IS_APPLYING_FOR_MSP]({commit}, payload) {
      commit(SET_IS_APPLYING_FOR_MSP, payload);
    },
    [SET_IS_APPLYING_FOR_FPCARE]({commit}, payload) {
      commit(SET_IS_APPLYING_FOR_FPCARE, payload);
    },
    [SET_IS_APPLYING_FOR_SUPP_BEN]({commit}, payload) {
      commit(SET_IS_APPLYING_FOR_SUPP_BEN, payload);
    },
    // Account Holder info.
    [SET_AH_FIRST_NAME]({ commit }, payload) {
      commit(SET_AH_FIRST_NAME, payload);
    },
    [SET_AH_MIDDLE_NAME]({ commit }, payload) {
      commit(SET_AH_MIDDLE_NAME, payload);
    },
    [SET_AH_LAST_NAME]({ commit }, payload) {
      commit(SET_AH_LAST_NAME, payload);
    },
    [SET_AH_BIRTHDATE]({ commit }, payload) {
      commit(SET_AH_BIRTHDATE, payload);
    },
    [SET_AH_SIN]({ commit }, payload) {
      commit(SET_AH_SIN, payload);
    },
    [SET_AH_GENDER]({ commit }, payload) {
      commit(SET_AH_GENDER, payload);
    },
    [SET_AH_CITIZENSHIP_STATUS]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_STATUS, payload);
    },
    [SET_AH_CITIZENSHIP_STATUS_REASON]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_STATUS_REASON, payload);
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS, payload);
    },
    [SET_AH_IS_NAME_CHANGED]({ commit }, payload) {
      commit(SET_AH_IS_NAME_CHANGED, payload);
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS, payload);
    },
    [SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH]({ commit }, payload) {
      commit(SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH, payload);
    },
    [SET_AH_IS_MOVED_TO_BC_PERMANENTLY]({ commit }, payload) {
      commit(SET_AH_IS_MOVED_TO_BC_PERMANENTLY, payload);
    },
    [SET_AH_MOVE_FROM_ORIGIN]({ commit }, payload) {
      commit(SET_AH_MOVE_FROM_ORIGIN, payload);
    },
    [SET_AH_ARRIVAL_DATE_IN_BC]({ commit }, payload) {
      commit(SET_AH_ARRIVAL_DATE_IN_BC, payload);
    },
    [SET_AH_ARRIVAL_DATE_IN_CANADA]({ commit }, payload) {
      commit(SET_AH_ARRIVAL_DATE_IN_CANADA, payload);
    },
    [SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS]({ commit }, payload) {
      commit(SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, payload);
    },
    [SET_AH_HAS_PREVIOUS_PHN]({ commit }, payload) {
      commit(SET_AH_HAS_PREVIOUS_PHN, payload);
    },
    [SET_AH_PREVIOUS_PHN]({ commit }, payload) {
      commit(SET_AH_PREVIOUS_PHN, payload);
    },
    [SET_AH_IS_RELEASED_FROM_ARMED_FORCES]({ commit }, payload) {
      commit(SET_AH_IS_RELEASED_FROM_ARMED_FORCES, payload);
    },
    [SET_AH_ARMED_FORCES_DISCHARGE_DATE]({ commit }, payload) {
      commit(SET_AH_ARMED_FORCES_DISCHARGE_DATE, payload);
    },
    [SET_AH_IS_STUDENT]({ commit }, payload) {
      commit(SET_AH_IS_STUDENT, payload);
    },
    [SET_AH_WILL_STUDENT_RESIDE_IN_BC]({ commit }, payload) {
      commit(SET_AH_WILL_STUDENT_RESIDE_IN_BC, payload);
    },
    [SET_AH_CRA_DOCUMENTS]({ commit }, payload) {
      commit(SET_AH_CRA_DOCUMENTS, payload);
    },
    [SET_AH_FPC_INCOME]({ commit }, payload) {
      commit(SET_AH_FPC_INCOME, payload);
    },
    [SET_AH_FPC_RDSP]({ commit }, payload) {
      commit(SET_AH_FPC_RDSP, payload);
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
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS, payload);
    },
    [SET_SPOUSE_IS_NAME_CHANGED]({ commit }, payload) {
      commit(SET_SPOUSE_IS_NAME_CHANGED, payload);
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS, payload);
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
    [SET_SPOUSE_CRA_DOCUMENTS]({ commit }, payload) {
      commit(SET_SPOUSE_CRA_DOCUMENTS, payload);
    },
    [SET_SPOUSE_FPC_INCOME]({ commit }, payload) {
      commit(SET_SPOUSE_FPC_INCOME, payload);
    },
    [SET_SPOUSE_FPC_RDSP]({ commit }, payload) {
      commit(SET_SPOUSE_FPC_RDSP, payload);
    },
    // Child info
    [SET_HAS_CHILDREN]({ commit }, payload) {
      commit(SET_HAS_CHILDREN, payload);
    },
    [SET_CHILDREN]({ commit }, payload) {
      commit(SET_CHILDREN, payload);
    },
    // Contact info
    [SET_RES_ADDRESS_LINE_1]({ commit }, payload) {
      commit(SET_RES_ADDRESS_LINE_1, payload);
    },
    [SET_RES_ADDRESS_LINE_2]({ commit }, payload) {
      commit(SET_RES_ADDRESS_LINE_2, payload);
    },
    [SET_RES_ADDRESS_LINE_3]({ commit }, payload) {
      commit(SET_RES_ADDRESS_LINE_3, payload);
    },
    [SET_RES_CITY]({ commit }, payload) {
      commit(SET_RES_CITY, payload);
    },
    [SET_RES_PROVINCE]({ commit }, payload) {
      commit(SET_RES_PROVINCE, payload);
    },
    [SET_RES_COUNTRY]({ commit }, payload) {
      commit(SET_RES_COUNTRY, payload);
    },
    [SET_RES_POSTAL_CODE]({ commit }, payload) {
      commit(SET_RES_POSTAL_CODE, payload);
    },
    [SET_MAIL_ADDRESS_LINE_1]({ commit }, payload) {
      commit(SET_MAIL_ADDRESS_LINE_1, payload);
    },
    [SET_MAIL_ADDRESS_LINE_2]({ commit }, payload) {
      commit(SET_MAIL_ADDRESS_LINE_2, payload);
    },
    [SET_MAIL_ADDRESS_LINE_3]({ commit }, payload) {
      commit(SET_MAIL_ADDRESS_LINE_3, payload);
    },
    [SET_MAIL_CITY]({ commit }, payload) {
      commit(SET_MAIL_CITY, payload);
    },
    [SET_MAIL_PROVINCE]({ commit }, payload) {
      commit(SET_MAIL_PROVINCE, payload);
    },
    [SET_MAIL_COUNTRY]({ commit }, payload) {
      commit(SET_MAIL_COUNTRY, payload);
    },
    [SET_MAIL_POSTAL_CODE]({ commit }, payload) {
      commit(SET_MAIL_POSTAL_CODE, payload);
    },
    [SET_IS_MAIL_SAME]({ commit }, payload) {
      commit(SET_IS_MAIL_SAME, payload);
    },
    [SET_PHONE]({ commit }, payload) {
      commit(SET_PHONE, payload);
    },
  },
  getters: {}
};
